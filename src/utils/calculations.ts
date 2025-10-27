/**
 * Módulo de cálculo financeiro usando decimal.js para precisão.
 * Realiza operações com Decimal internamente e retorna valores
 * com precisão de 8 casas decimais (sem usar operações em float).
 */
import Decimal from 'decimal.js'

// Configuramos Decimal para ter precisão suficiente para cálculos intermediários.
Decimal.set({ precision: 40 })

/** Representa os parâmetros básicos da venda */
export interface SaleParams {
  unitPrice: number | string        // preço unitário do produto (aceita number ou string)
  unitCost: number | string         // custo de produção por unidade (aceita number ou string)
  fixedFeeBeforePercentage: number | string  // taxa fixa antes da taxa percentual (aceita number ou string)
  platformFeeRate: number           // taxa percentual da plataforma (0.20 = 20%)
  fixedFeeAfterPercentage: number | string   // taxa fixa depois da taxa percentual (aceita number ou string)
  baseQuantity: number              // quantidade de unidades vendidas
}

function toDecimal(v: number | string): Decimal {
  return new Decimal(v)
}

function toNumber8(d: Decimal): number {
  // Retorna um number com até 8 casas decimais (representação numérica final).
  // Usamos toFixed(8) para garantir 8 casas decimais e evitar imprecisão floats interm.
  return Number(d.toFixed(8))
}

/** Calcula o lucro total com base nos parâmetros. */
export function calculateTotalProfit(params: SaleParams): number {
  const unitPrice = toDecimal(params.unitPrice)
  const unitCost = toDecimal(params.unitCost)
  const platformFeeRate = toDecimal(params.platformFeeRate)
  const fixedFeeBefore = toDecimal(params.fixedFeeBeforePercentage)
  const fixedFeeAfter = toDecimal(params.fixedFeeAfterPercentage)
  const quantity = toDecimal(params.baseQuantity)

  const totalRevenue = quantity.times(unitPrice)
  
  // Taxa fixa antes do percentual é subtraída da receita antes de calcular a taxa percentual
  const revenueAfterFixedBefore = totalRevenue.minus(fixedFeeBefore)
  
  // Taxa percentual é aplicada sobre a receita após a taxa fixa inicial
  const percentageFee = revenueAfterFixedBefore.times(platformFeeRate)
  
  // Taxa fixa depois é adicionada ao total de taxas
  const totalFees = fixedFeeBefore.plus(percentageFee).plus(fixedFeeAfter)
  
  const totalCost = quantity.times(unitCost)

  const profit = totalRevenue.minus(totalFees).minus(totalCost)
  return toNumber8(profit)
}

/** Retorna o lucro base (alias para calculateTotalProfit). */
export function calculateBaseProfit(params: SaleParams): number {
  return calculateTotalProfit(params)
}

/** Calcula o lucro se cada unidade fosse vendida separadamente.
 *  Útil para comparar venda em lote vs vendas individuais.
 *  A diferença principal é que as taxas fixas são cobradas por venda.
 */
export function calculateProfitSeparateSales(params: SaleParams): number {
  const unitPrice = toDecimal(params.unitPrice)
  const unitCost = toDecimal(params.unitCost)
  const platformFeeRate = toDecimal(params.platformFeeRate)
  const fixedFeeBefore = toDecimal(params.fixedFeeBeforePercentage)
  const fixedFeeAfter = toDecimal(params.fixedFeeAfterPercentage)
  const quantity = toDecimal(params.baseQuantity)

  // Revenue por unidade
  const revenuePerUnit = unitPrice
  
  // Fees por unidade
  // Taxa fixa antes é subtraída antes do cálculo percentual
  const revenueAfterFixedBefore = revenuePerUnit.minus(fixedFeeBefore)
  
  // Taxa percentual é aplicada sobre a receita após taxa fixa inicial
  const percentageFee = revenueAfterFixedBefore.times(platformFeeRate)
  
  // Total de fees por unidade (ambas taxas fixas + percentual)
  const feesPerUnit = fixedFeeBefore.plus(percentageFee).plus(fixedFeeAfter)
  
  // Custo por unidade
  const costPerUnit = unitCost
  
  // Lucro por unidade
  const profitPerUnit = revenuePerUnit.minus(feesPerUnit).minus(costPerUnit)
  
  // Lucro total
  const totalProfit = profitPerUnit.times(quantity)
  
  return toNumber8(totalProfit)
}

/** Resultado da comparação entre venda única e vendas separadas */
export interface SalesComparison {
  singleSaleProfit: number      // Lucro vendendo tudo numa única venda
  separateSalesProfit: number   // Lucro vendendo cada unidade separadamente
  difference: number            // Diferença (economia ao vender junto)
  percentageDifference: number  // Diferença percentual
}

/** Compara o lucro entre vender tudo junto vs vender separadamente */
export function compareSalesStrategies(params: SaleParams): SalesComparison {
  const singleSale = toDecimal(calculateBaseProfit(params))
  const separateSales = toDecimal(calculateProfitSeparateSales(params))
  
  const difference = singleSale.minus(separateSales)
  const percentageDifference = separateSales.isZero() 
    ? new Decimal(0) 
    : difference.dividedBy(separateSales.abs()).times(100)
  
  return {
    singleSaleProfit: toNumber8(singleSale),
    separateSalesProfit: toNumber8(separateSales),
    difference: toNumber8(difference),
    percentageDifference: toNumber8(percentageDifference)
  }
}

/** Resultado da análise de venda direta (sem plataforma) */
export interface DirectSaleAnalysis {
  directPricePerUnit: number        // Preço sugerido por unidade (sem taxas da plataforma)
  totalDirectPrice: number          // Valor total da venda direta
  platformPricePerUnit: number      // Preço original na plataforma por unidade
  totalPlatformPrice: number        // Valor total na plataforma
  customerSavings: number           // Economia do cliente (desconto em R$)
  customerSavingsPercentage: number // Economia do cliente em %
  sellerProfit: number              // Lucro do vendedor na venda direta
  sellerExtraProfit: number         // Lucro extra comparado à venda na plataforma
}

/** Calcula preço ideal para venda direta (sem plataforma)
 *  mantendo o mesmo lucro do vendedor e dando desconto ao cliente.
 *  A comparação é feita contra vendas separadas (cada unidade vendida individualmente).
 */
export function calculateDirectSalePrice(params: SaleParams): DirectSaleAnalysis {
  const unitPrice = toDecimal(params.unitPrice)
  const unitCost = toDecimal(params.unitCost)
  const quantity = toDecimal(params.baseQuantity)

  // O cliente normalmente compraria cada unidade separadamente na plataforma
  // Preço que o cliente pagaria comprando separadamente
  const totalPlatformPrice = unitPrice.times(quantity)
  
  // Lucro do vendedor se vendesse tudo separadamente (pior cenário - múltiplas taxas fixas)
  const separateSalesProfit = toDecimal(calculateProfitSeparateSales(params))
  
  // Para a venda direta, queremos manter o lucro das vendas separadas
  // mas podemos oferecer um preço melhor ao cliente
  // Lucro = Receita - Custo
  // separateSalesProfit = DirectRevenue - TotalCost
  // DirectRevenue = separateSalesProfit + TotalCost
  const totalCost = unitCost.times(quantity)
  const directRevenue = separateSalesProfit.plus(totalCost)
  
  // Preço por unidade na venda direta
  const directPricePerUnit = directRevenue.dividedBy(quantity)
  
  // Economia do cliente (comparando com comprar separadamente na plataforma)
  const customerSavings = totalPlatformPrice.minus(directRevenue)
  const customerSavingsPercentage = customerSavings.dividedBy(totalPlatformPrice).times(100)
  
  // Lucro do vendedor na venda direta (igual ao lucro de vendas separadas)
  const sellerProfit = separateSalesProfit
  
  // Se o vendedor quisesse, poderia cobrar um pouco mais e ter lucro extra
  // mas vamos manter o foco em dar desconto ao cliente mantendo o lucro básico
  const platformSingleProfit = toDecimal(calculateBaseProfit(params))
  const sellerExtraProfit = sellerProfit.minus(platformSingleProfit)
  
  return {
    directPricePerUnit: toNumber8(directPricePerUnit),
    totalDirectPrice: toNumber8(directRevenue),
    platformPricePerUnit: toNumber8(unitPrice),
    totalPlatformPrice: toNumber8(totalPlatformPrice),
    customerSavings: toNumber8(customerSavings),
    customerSavingsPercentage: toNumber8(customerSavingsPercentage),
    sellerProfit: toNumber8(sellerProfit),
    sellerExtraProfit: toNumber8(sellerExtraProfit)
  }
}
