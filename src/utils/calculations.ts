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
  platformFeeRate: number           // taxa percentual da plataforma (0.20 = 20%)
  fixedFee: number | string         // taxa fixa da plataforma por venda (aceita number ou string)
  baseQuantity: number              // quantidade padrão vendida (antes do desconto)
  extraQuantity: number             // unidades adicionais vendidas após o desconto
}

/** Resultado de cálculo de desconto máximo */
export interface DiscountResult {
  absolute: number    // desconto máximo em reais por unidade (8 decimais)
  percentage: number  // desconto máximo em porcentagem (8 decimais)
}

function toDecimal(v: number | string): Decimal {
  return new Decimal(v)
}

function toNumber8(d: Decimal): number {
  // Retorna um number com até 8 casas decimais (representação numérica final).
  // Usamos toFixed(8) para garantir 8 casas decimais e evitar imprecisão floats interm.
  return Number(d.toFixed(8))
}

/** Calcula o desconto máximo possível por unidade adicional (Caso A)
 *  sem alterar o lucro total da venda base.
 */
export function calculateMaxDiscountPerExtraUnit(params: SaleParams): DiscountResult {
  const unitPrice = toDecimal(params.unitPrice)
  const unitCost = toDecimal(params.unitCost)
  const platformFeeRate = toDecimal(params.platformFeeRate)

  const maxDiscount = unitPrice.minus(unitCost.dividedBy(new Decimal(1).minus(platformFeeRate)))
  const percentage = maxDiscount.dividedBy(unitPrice).times(100)

  return {
    absolute: toNumber8(maxDiscount),
    percentage: toNumber8(percentage)
  }
}

/** Calcula o desconto máximo uniforme (Caso B)
 *  que pode ser aplicado a todas as unidades da venda
 *  sem reduzir o lucro total.
 */
export function calculateUniformDiscount(params: SaleParams): DiscountResult {
  const unitPrice = toDecimal(params.unitPrice)
  const unitCost = toDecimal(params.unitCost)
  const platformFeeRate = toDecimal(params.platformFeeRate)
  const baseQuantity = toDecimal(params.baseQuantity)
  const extraQuantity = toDecimal(params.extraQuantity)

  const numerator = extraQuantity.times(new Decimal(1).minus(platformFeeRate).times(unitPrice).minus(unitCost))
  const denominator = new Decimal(1).minus(platformFeeRate).times(unitPrice).times(baseQuantity.plus(extraQuantity))

  const discountRate = numerator.dividedBy(denominator)
  const percentage = discountRate.times(100)

  return {
    absolute: toNumber8(discountRate.times(unitPrice)),
    percentage: toNumber8(percentage)
  }
}

/** Calcula o lucro total com base nos parâmetros e desconto aplicado. */
export function calculateTotalProfit(
  params: SaleParams,
  discountRate: number, // fração decimal, ex: 0.10 = 10%
  isUniformDiscount: boolean = true
): number {
  const unitPrice = toDecimal(params.unitPrice)
  const unitCost = toDecimal(params.unitCost)
  const platformFeeRate = toDecimal(params.platformFeeRate)
  const fixedFee = toDecimal(params.fixedFee)
  const baseQuantity = toDecimal(params.baseQuantity)
  const extraQuantity = toDecimal(params.extraQuantity)

  const totalQuantity = baseQuantity.plus(extraQuantity)
  const dr = toDecimal(discountRate)

  const totalRevenue = isUniformDiscount
    ? totalQuantity.times(unitPrice).times(new Decimal(1).minus(dr))
    : baseQuantity.times(unitPrice).plus(extraQuantity.times(unitPrice).times(new Decimal(1).minus(dr)))

  const totalFees = totalRevenue.times(platformFeeRate).plus(fixedFee)
  const totalCost = totalQuantity.times(unitCost)

  const profit = totalRevenue.minus(totalFees).minus(totalCost)
  return toNumber8(profit)
}

/** Retorna o lucro base sem desconto (para referência). */
export function calculateBaseProfit(params: SaleParams): number {
  return calculateTotalProfit(params, 0, true)
}

/** Calcula o lucro se cada unidade fosse vendida separadamente.
 *  Útil para comparar venda em lote vs vendas individuais.
 *  A diferença principal é que a taxa fixa é cobrada por venda.
 */
export function calculateProfitSeparateSales(params: SaleParams): number {
  const unitPrice = toDecimal(params.unitPrice)
  const unitCost = toDecimal(params.unitCost)
  const platformFeeRate = toDecimal(params.platformFeeRate)
  const fixedFee = toDecimal(params.fixedFee)
  const totalQuantity = toDecimal(params.baseQuantity + params.extraQuantity)

  // Revenue por unidade
  const revenuePerUnit = unitPrice
  
  // Fees por unidade (taxa percentual + taxa fixa por cada venda)
  const feesPerUnit = revenuePerUnit.times(platformFeeRate).plus(fixedFee)
  
  // Custo por unidade
  const costPerUnit = unitCost
  
  // Lucro por unidade
  const profitPerUnit = revenuePerUnit.minus(feesPerUnit).minus(costPerUnit)
  
  // Lucro total
  const totalProfit = profitPerUnit.times(totalQuantity)
  
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
  const totalQuantity = toDecimal(params.baseQuantity + params.extraQuantity)

  // O cliente normalmente compraria cada unidade separadamente na plataforma
  // Preço que o cliente pagaria comprando separadamente
  const totalPlatformPrice = unitPrice.times(totalQuantity)
  
  // Lucro do vendedor se vendesse tudo separadamente (pior cenário - múltiplas taxas fixas)
  const separateSalesProfit = toDecimal(calculateProfitSeparateSales(params))
  
  // Para a venda direta, queremos manter o lucro das vendas separadas
  // mas podemos oferecer um preço melhor ao cliente
  // Lucro = Receita - Custo
  // separateSalesProfit = DirectRevenue - TotalCost
  // DirectRevenue = separateSalesProfit + TotalCost
  const totalCost = unitCost.times(totalQuantity)
  const directRevenue = separateSalesProfit.plus(totalCost)
  
  // Preço por unidade na venda direta
  const directPricePerUnit = directRevenue.dividedBy(totalQuantity)
  
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
