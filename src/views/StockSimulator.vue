<template>
  <div id="stock-simulator">
    <header class="header">
      <div class="header-icon">
        <Package :size="48" :stroke-width="2" />
      </div>
      <h1>Simulador de Estoque</h1>
      <p class="subtitle">
        Gerencie seu estoque e acompanhe <strong>custos e valores totais</strong>
      </p>
    </header>

    <div class="layout">
      <div class="left-column">
        <div class="form-container">
          <div class="form">
            <div class="form-header">
              <PackagePlus :size="24" :stroke-width="2" />
              <h2>Adicionar Produto</h2>
            </div>
            
            <div class="field">
              <label for="productName">
                <Tag :size="16" :stroke-width="2" class="label-icon" />
                <span class="label-text">Nome do Produto</span>
              </label>
              <input
                id="productName"
                type="text"
                v-model="newProduct.name"
                placeholder="Ex: Camiseta Básica"
              />
            </div>

            <div class="field">
              <label for="quantity">
                <Hash :size="16" :stroke-width="2" class="label-icon" />
                <span class="label-text">Quantidade</span>
              </label>
              <input
                id="quantity"
                type="number"
                step="1"
                min="1"
                v-model.number="newProduct.quantity"
              />
            </div>

            <div class="field">
              <label for="cost">
                <DollarSign :size="16" :stroke-width="2" class="label-icon" />
                <span class="label-text">Custo Unitário</span>
              </label>
              <input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                v-model="newProduct.cost"
                placeholder="0.00"
              />
            </div>

            <div class="field">
              <label for="price">
                <TrendingUp :size="16" :stroke-width="2" class="label-icon" />
                <span class="label-text">Preço de Venda</span>
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                v-model="newProduct.price"
                placeholder="0.00"
              />
            </div>

            <button @click="addProduct" class="add-button" :disabled="!isFormValid">
              <Plus :size="20" :stroke-width="2" />
              Adicionar ao Estoque
            </button>
          </div>
        </div>

        <div class="form-container">
          <div class="form operational-costs-form">
            <div class="form-header">
              <Receipt :size="24" :stroke-width="2" />
              <h2>Custos Operacionais</h2>
            </div>
            <p class="form-description">Cadastre custos fixos e variáveis do seu negócio</p>
            
            <div class="field">
              <label for="costName">
                <FileText :size="16" :stroke-width="2" class="label-icon" />
                <span class="label-text">Nome do Custo</span>
              </label>
              <input
                id="costName"
                type="text"
                v-model="newOperationalCost.name"
                placeholder="Ex: Aluguel, Energia, Internet"
              />
            </div>

            <div class="field">
              <label for="costValue">
                <DollarSign :size="16" :stroke-width="2" class="label-icon" />
                <span class="label-text">Valor do Custo</span>
              </label>
              <input
                id="costValue"
                type="number"
                step="0.01"
                min="0"
                v-model="newOperationalCost.value"
                placeholder="0.00"
              />
            </div>

            <button @click="addOperationalCost" class="add-button secondary" :disabled="!isOperationalCostFormValid">
              <Plus :size="20" :stroke-width="2" />
              Adicionar Custo
            </button>

            <div v-if="operationalCosts.length > 0" class="costs-list">
              <div class="costs-header">
                <h3>Custos Cadastrados</h3>
                <span class="total-costs">Total: R$ {{ totalOperationalCosts.toFixed(2) }}</span>
              </div>
              <div v-for="(cost, index) in operationalCosts" :key="index" class="cost-item">
                <div class="cost-info">
                  <span class="cost-name">{{ cost.name }}</span>
                  <span class="cost-value">R$ {{ Number(cost.value).toFixed(2) }}</span>
                </div>
                <button @click="removeOperationalCost(index)" class="remove-cost-button" title="Remover custo">
                  <Trash2 :size="16" :stroke-width="2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="stock-container">
        <div class="summary-cards">
          <div class="summary-card cost">
            <div class="card-header">
              <ShoppingCart :size="20" :stroke-width="2" />
              <h3>Custo Total do Estoque</h3>
            </div>
            <p class="value">R$ {{ totalCost.toFixed(2) }}</p>
            <p class="description">Quanto você investiu</p>
          </div>

          <div class="summary-card value">
            <div class="card-header">
              <Wallet :size="20" :stroke-width="2" />
              <h3>Valor Total do Estoque</h3>
            </div>
            <p class="value">R$ {{ totalValue.toFixed(2) }}</p>
            <p class="description">Valor de venda total</p>
          </div>

          <div class="summary-card profit">
            <div class="card-header">
              <TrendingUp :size="20" :stroke-width="2" />
              <h3>Lucro Potencial</h3>
            </div>
            <p class="value">R$ {{ potentialProfit.toFixed(2) }}</p>
            <p class="description">{{ profitMargin.toFixed(2) }}% de margem</p>
            <div v-if="totalOperationalCosts > 0" class="operational-impact">
              <div class="divider"></div>
              <p class="impact-label">Com Custos Operacionais:</p>
              <p class="impact-value">R$ {{ potentialProfitWithOperationalCosts.toFixed(2) }}</p>
              <p class="impact-margin">{{ profitMarginWithOperationalCosts.toFixed(2) }}% de margem</p>
            </div>
          </div>
        </div>

        <div class="products-list">
          <div class="list-header">
            <Boxes :size="24" :stroke-width="2" />
            <h2>Produtos em Estoque</h2>
            <span class="count">{{ products.length }} {{ products.length === 1 ? 'produto' : 'produtos' }}</span>
          </div>

          <div v-if="products.length === 0" class="empty-state">
            <Package :size="64" :stroke-width="1.5" class="empty-icon" />
            <p>Nenhum produto no estoque</p>
            <p class="hint">Adicione produtos usando o formulário ao lado</p>
          </div>

          <div v-else class="product-items">
            <div v-for="(product, index) in products" :key="index" class="product-card">
              <div class="product-header">
                <h4 v-if="editingIndex !== index">{{ product.name }}</h4>
                <input 
                  v-else 
                  type="text" 
                  v-model="editForm.name" 
                  class="edit-input title"
                  @keyup.enter="saveEdit"
                  @keyup.esc="cancelEdit"
                />
                <div class="action-buttons">
                  <button 
                    v-if="editingIndex !== index"
                    @click="startEdit(index)" 
                    class="edit-button" 
                    title="Editar produto"
                  >
                    <Edit2 :size="18" :stroke-width="2" />
                  </button>
                  <template v-else>
                    <button @click="saveEdit" class="save-button" title="Salvar">
                      <Check :size="18" :stroke-width="2" />
                    </button>
                    <button @click="cancelEdit" class="cancel-button" title="Cancelar">
                      <X :size="18" :stroke-width="2" />
                    </button>
                  </template>
                  <button @click="removeProduct(index)" class="remove-button" title="Remover produto">
                    <Trash2 :size="18" :stroke-width="2" />
                  </button>
                </div>
              </div>
              
              <div class="product-details">
                <div class="detail-item">
                  <Hash :size="16" :stroke-width="2" />
                  <span class="label">Quantidade:</span>
                  <span v-if="editingIndex !== index" class="value">{{ product.quantity }}</span>
                  <input 
                    v-else 
                    type="number" 
                    step="1"
                    min="1"
                    v-model.number="editForm.quantity" 
                    class="edit-input small"
                    @keyup.enter="saveEdit"
                    @keyup.esc="cancelEdit"
                  />
                </div>
                
                <div class="detail-item">
                  <DollarSign :size="16" :stroke-width="2" />
                  <span class="label">Custo Unit.:</span>
                  <span v-if="editingIndex !== index" class="value">R$ {{ Number(product.cost).toFixed(2) }}</span>
                  <input 
                    v-else 
                    type="number" 
                    step="0.01"
                    min="0"
                    v-model="editForm.cost" 
                    class="edit-input small"
                    @keyup.enter="saveEdit"
                    @keyup.esc="cancelEdit"
                  />
                </div>
                
                <div class="detail-item">
                  <TrendingUp :size="16" :stroke-width="2" />
                  <span class="label">Preço Venda:</span>
                  <span v-if="editingIndex !== index" class="value">R$ {{ Number(product.price).toFixed(2) }}</span>
                  <input 
                    v-else 
                    type="number" 
                    step="0.01"
                    min="0"
                    v-model="editForm.price" 
                    class="edit-input small"
                    @keyup.enter="saveEdit"
                    @keyup.esc="cancelEdit"
                  />
                </div>
              </div>

              <div class="product-totals">
                <div class="total-item cost-total">
                  <span class="label">Custo Total:</span>
                  <span class="value">R$ {{ (product.quantity * Number(product.cost)).toFixed(2) }}</span>
                </div>
                <div class="total-item value-total">
                  <span class="label">Valor Total:</span>
                  <span class="value">R$ {{ (product.quantity * Number(product.price)).toFixed(2) }}</span>
                </div>
                <div class="total-item profit-total">
                  <span class="label">Lucro:</span>
                  <span class="value">R$ {{ (product.quantity * (Number(product.price) - Number(product.cost))).toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="products.length > 0 && totalOperationalCosts > 0" class="simulations-section">
          <div class="section-header">
            <Calculator :size="24" :stroke-width="2" />
            <h2>Simulações de Diluição dos Custos Operacionais</h2>
          </div>
          <p class="section-description">
            Compare como os custos operacionais (R$ {{ totalOperationalCosts.toFixed(2) }}) 
            podem ser distribuídos entre os produtos usando diferentes métodos
          </p>

          <div class="simulations-grid">
            <!-- Simulação 1: Igual por Unidade -->
            <div class="simulation-card">
              <div class="simulation-header">
                <div class="simulation-icon equal">
                  <Equal :size="24" :stroke-width="2" />
                </div>
                <div>
                  <h3>Diluição Igual</h3>
                  <p class="simulation-subtitle">
                    R$ {{ (totalOperationalCosts / totalUnits).toFixed(4) }} por unidade
                  </p>
                </div>
              </div>
              <p class="simulation-description">
                Divide os custos igualmente entre todas as {{ totalUnits }} unidades em estoque
              </p>
              
              <div class="products-simulation">
                <div v-for="item in equalDistribution" :key="item.name" class="sim-product">
                  <div class="sim-product-header">
                    <span class="sim-product-name">{{ item.name }}</span>
                    <span class="sim-product-qty">{{ item.quantity }}un</span>
                  </div>
                  <div class="sim-values">
                    <div class="sim-value-item">
                      <span class="sim-label">Custo Original:</span>
                      <span class="sim-data">R$ {{ item.originalCost.toFixed(2) }}</span>
                    </div>
                    <div class="sim-value-item add">
                      <span class="sim-label">+ Custo Operacional:</span>
                      <span class="sim-data">R$ {{ item.additionalCost.toFixed(4) }}</span>
                    </div>
                    <div class="sim-value-item total">
                      <span class="sim-label">Novo Custo Unit.:</span>
                      <span class="sim-data">R$ {{ item.newCost.toFixed(2) }}</span>
                    </div>
                    <div class="sim-value-item current-price">
                      <span class="sim-label">Preço Atual:</span>
                      <span class="sim-data">R$ {{ item.originalPrice.toFixed(2) }}</span>
                    </div>
                    <div class="sim-value-item profit">
                      <span class="sim-label">Lucro com Preço Atual:</span>
                      <span class="sim-data">R$ {{ item.profit.toFixed(2) }} ({{ item.profitPercentage.toFixed(1) }}%)</span>
                    </div>
                    <div class="sim-value-item suggested">
                      <span class="sim-label">💡 Preço Sugerido (margem {{ item.originalMargin.toFixed(1) }}%):</span>
                      <span class="sim-data">R$ {{ item.suggestedPrice.toFixed(2) }}</span>
                    </div>
                    <div class="sim-value-item total-profit">
                      <span class="sim-label">Lucro Total (preço atual):</span>
                      <span class="sim-data">R$ {{ item.totalProfit.toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Simulação 2: Proporcional ao Custo -->
            <div class="simulation-card">
              <div class="simulation-header">
                <div class="simulation-icon cost">
                  <PieChart :size="24" :stroke-width="2" />
                </div>
                <div>
                  <h3>Proporcional ao Custo</h3>
                  <p class="simulation-subtitle">Baseado no custo de cada produto</p>
                </div>
              </div>
              <p class="simulation-description">
                Produtos com maior custo absorvem mais custos operacionais
              </p>
              
              <div class="products-simulation">
                <div v-for="item in costProportionalDistribution" :key="item.name" class="sim-product">
                  <div class="sim-product-header">
                    <span class="sim-product-name">{{ item.name }}</span>
                    <span class="sim-product-qty">{{ item.quantity }}un ({{ item.proportion.toFixed(1) }}%)</span>
                  </div>
                  <div class="sim-values">
                    <div class="sim-value-item">
                      <span class="sim-label">Custo Original:</span>
                      <span class="sim-data">R$ {{ item.originalCost.toFixed(2) }}</span>
                    </div>
                    <div class="sim-value-item add">
                      <span class="sim-label">+ Custo Operacional:</span>
                      <span class="sim-data">R$ {{ item.additionalCost.toFixed(4) }}</span>
                    </div>
                    <div class="sim-value-item total">
                      <span class="sim-label">Novo Custo Unit.:</span>
                      <span class="sim-data">R$ {{ item.newCost.toFixed(2) }}</span>
                    </div>
                    <div class="sim-value-item current-price">
                      <span class="sim-label">Preço Atual:</span>
                      <span class="sim-data">R$ {{ item.originalPrice.toFixed(2) }}</span>
                    </div>
                    <div class="sim-value-item profit">
                      <span class="sim-label">Lucro com Preço Atual:</span>
                      <span class="sim-data">R$ {{ item.profit.toFixed(2) }} ({{ item.profitPercentage.toFixed(1) }}%)</span>
                    </div>
                    <div class="sim-value-item suggested">
                      <span class="sim-label">💡 Preço Sugerido (margem {{ item.originalMargin.toFixed(1) }}%):</span>
                      <span class="sim-data">R$ {{ item.suggestedPrice.toFixed(2) }}</span>
                    </div>
                    <div class="sim-value-item total-profit">
                      <span class="sim-label">Lucro Total (preço atual):</span>
                      <span class="sim-data">R$ {{ item.totalProfit.toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Simulação 3: Proporcional ao Preço -->
            <div class="simulation-card">
              <div class="simulation-header">
                <div class="simulation-icon price">
                  <BarChart3 :size="24" :stroke-width="2" />
                </div>
                <div>
                  <h3>Proporcional ao Preço</h3>
                  <p class="simulation-subtitle">Baseado no preço de venda</p>
                </div>
              </div>
              <p class="simulation-description">
                Produtos com maior preço absorvem mais custos operacionais
              </p>
              
              <div class="products-simulation">
                <div v-for="item in priceProportionalDistribution" :key="item.name" class="sim-product">
                  <div class="sim-product-header">
                    <span class="sim-product-name">{{ item.name }}</span>
                    <span class="sim-product-qty">{{ item.quantity }}un ({{ item.proportion.toFixed(1) }}%)</span>
                  </div>
                  <div class="sim-values">
                    <div class="sim-value-item">
                      <span class="sim-label">Custo Original:</span>
                      <span class="sim-data">R$ {{ item.originalCost.toFixed(2) }}</span>
                    </div>
                    <div class="sim-value-item add">
                      <span class="sim-label">+ Custo Operacional:</span>
                      <span class="sim-data">R$ {{ item.additionalCost.toFixed(4) }}</span>
                    </div>
                    <div class="sim-value-item total">
                      <span class="sim-label">Novo Custo Unit.:</span>
                      <span class="sim-data">R$ {{ item.newCost.toFixed(2) }}</span>
                    </div>
                    <div class="sim-value-item current-price">
                      <span class="sim-label">Preço Atual:</span>
                      <span class="sim-data">R$ {{ item.originalPrice.toFixed(2) }}</span>
                    </div>
                    <div class="sim-value-item profit">
                      <span class="sim-label">Lucro com Preço Atual:</span>
                      <span class="sim-data">R$ {{ item.profit.toFixed(2) }} ({{ item.profitPercentage.toFixed(1) }}%)</span>
                    </div>
                    <div class="sim-value-item suggested">
                      <span class="sim-label">💡 Preço Sugerido (margem {{ item.originalMargin.toFixed(1) }}%):</span>
                      <span class="sim-data">R$ {{ item.suggestedPrice.toFixed(2) }}</span>
                    </div>
                    <div class="sim-value-item total-profit">
                      <span class="sim-label">Lucro Total (preço atual):</span>
                      <span class="sim-data">R$ {{ item.totalProfit.toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { 
  Package, 
  PackagePlus, 
  Tag, 
  Hash, 
  DollarSign, 
  TrendingUp, 
  Plus,
  ShoppingCart,
  Wallet,
  Boxes,
  Trash2,
  Edit2,
  Check,
  X,
  Receipt,
  FileText,
  Calculator,
  Equal,
  PieChart,
  BarChart3
} from 'lucide-vue-next'

interface Product {
  name: string
  quantity: number
  cost: string | number
  price: string | number
}

interface OperationalCost {
  name: string
  value: string | number
}

const products = ref<Product[]>([])
const operationalCosts = ref<OperationalCost[]>([])
const editingIndex = ref<number | null>(null)

const newProduct = reactive<Product>({
  name: '',
  quantity: 1,
  cost: '',
  price: ''
})

const newOperationalCost = reactive<OperationalCost>({
  name: '',
  value: ''
})

const editForm = reactive<Product>({
  name: '',
  quantity: 1,
  cost: '',
  price: ''
})

const isFormValid = computed(() => {
  return newProduct.name.trim() !== '' &&
         newProduct.quantity > 0 &&
         Number(newProduct.cost) >= 0 &&
         Number(newProduct.price) >= 0
})

const isOperationalCostFormValid = computed(() => {
  return newOperationalCost.name.trim() !== '' &&
         Number(newOperationalCost.value) > 0
})

const totalCost = computed(() => {
  return products.value.reduce((sum, product) => {
    return sum + (product.quantity * Number(product.cost))
  }, 0)
})

const totalValue = computed(() => {
  return products.value.reduce((sum, product) => {
    return sum + (product.quantity * Number(product.price))
  }, 0)
})

const totalOperationalCosts = computed(() => {
  return operationalCosts.value.reduce((sum, cost) => {
    return sum + Number(cost.value)
  }, 0)
})

const totalUnits = computed(() => {
  return products.value.reduce((sum, product) => {
    return sum + product.quantity
  }, 0)
})

const potentialProfit = computed(() => {
  return totalValue.value - totalCost.value
})

const potentialProfitWithOperationalCosts = computed(() => {
  return totalValue.value - totalCost.value - totalOperationalCosts.value
})

const profitMargin = computed(() => {
  if (totalCost.value === 0) return 0
  return (potentialProfit.value / totalCost.value) * 100
})

const profitMarginWithOperationalCosts = computed(() => {
  const totalCostWithOp = totalCost.value + totalOperationalCosts.value
  if (totalCostWithOp === 0) return 0
  return (potentialProfitWithOperationalCosts.value / totalCostWithOp) * 100
})

// Simulação 1: Diluição Igual por Unidade
const equalDistribution = computed(() => {
  if (totalUnits.value === 0 || products.value.length === 0) return []
  
  const costPerUnit = totalOperationalCosts.value / totalUnits.value
  
  return products.value.map(product => {
    const originalCost = Number(product.cost)
    const originalPrice = Number(product.price)
    const originalProfit = originalPrice - originalCost
    const originalMargin = originalCost > 0 ? (originalProfit / originalCost) * 100 : 0
    
    const additionalCostPerUnit = costPerUnit
    const newCost = originalCost + additionalCostPerUnit
    const profit = originalPrice - newCost
    const profitPercentage = newCost > 0 ? (profit / newCost) * 100 : 0
    
    // Novo preço sugerido mantendo a margem original
    const suggestedPrice = newCost * (1 + (originalMargin / 100))
    const totalProfit = profit * product.quantity
    
    return {
      name: product.name,
      quantity: product.quantity,
      originalCost,
      originalPrice,
      originalMargin,
      additionalCost: additionalCostPerUnit,
      newCost,
      price: originalPrice,
      profit,
      profitPercentage,
      totalProfit,
      suggestedPrice
    }
  })
})

// Simulação 2: Diluição Proporcional ao Custo
const costProportionalDistribution = computed(() => {
  if (totalCost.value === 0 || products.value.length === 0) return []
  
  return products.value.map(product => {
    const originalCost = Number(product.cost)
    const originalPrice = Number(product.price)
    const originalProfit = originalPrice - originalCost
    const originalMargin = originalCost > 0 ? (originalProfit / originalCost) * 100 : 0
    
    const productTotalCost = product.quantity * originalCost
    const proportion = productTotalCost / totalCost.value
    const additionalCost = totalOperationalCosts.value * proportion
    const additionalCostPerUnit = additionalCost / product.quantity
    const newCost = originalCost + additionalCostPerUnit
    const profit = originalPrice - newCost
    const profitPercentage = newCost > 0 ? (profit / newCost) * 100 : 0
    
    // Novo preço sugerido mantendo a margem original
    const suggestedPrice = newCost * (1 + (originalMargin / 100))
    const totalProfit = profit * product.quantity
    
    return {
      name: product.name,
      quantity: product.quantity,
      originalCost,
      originalPrice,
      originalMargin,
      additionalCost: additionalCostPerUnit,
      newCost,
      price: originalPrice,
      profit,
      profitPercentage,
      totalProfit,
      proportion: proportion * 100,
      suggestedPrice
    }
  })
})

// Simulação 3: Diluição Proporcional ao Preço de Venda
const priceProportionalDistribution = computed(() => {
  if (totalValue.value === 0 || products.value.length === 0) return []
  
  return products.value.map(product => {
    const originalCost = Number(product.cost)
    const originalPrice = Number(product.price)
    const originalProfit = originalPrice - originalCost
    const originalMargin = originalCost > 0 ? (originalProfit / originalCost) * 100 : 0
    
    const productTotalValue = product.quantity * originalPrice
    const proportion = productTotalValue / totalValue.value
    const additionalCost = totalOperationalCosts.value * proportion
    const additionalCostPerUnit = additionalCost / product.quantity
    const newCost = originalCost + additionalCostPerUnit
    const profit = originalPrice - newCost
    const profitPercentage = newCost > 0 ? (profit / newCost) * 100 : 0
    
    // Novo preço sugerido mantendo a margem original
    const suggestedPrice = newCost * (1 + (originalMargin / 100))
    const totalProfit = profit * product.quantity
    
    return {
      name: product.name,
      quantity: product.quantity,
      originalCost,
      originalPrice,
      originalMargin,
      additionalCost: additionalCostPerUnit,
      newCost,
      price: originalPrice,
      profit,
      profitPercentage,
      totalProfit,
      proportion: proportion * 100,
      suggestedPrice
    }
  })
})

function addProduct() {
  if (!isFormValid.value) return
  
  products.value.push({
    name: newProduct.name,
    quantity: newProduct.quantity,
    cost: newProduct.cost,
    price: newProduct.price
  })

  // Limpar formulário
  newProduct.name = ''
  newProduct.quantity = 1
  newProduct.cost = ''
  newProduct.price = ''
}

function addOperationalCost() {
  if (!isOperationalCostFormValid.value) return
  
  operationalCosts.value.push({
    name: newOperationalCost.name,
    value: newOperationalCost.value
  })

  // Limpar formulário
  newOperationalCost.name = ''
  newOperationalCost.value = ''
}

function removeProduct(index: number) {
  if (editingIndex.value === index) {
    editingIndex.value = null
  }
  products.value.splice(index, 1)
}

function removeOperationalCost(index: number) {
  operationalCosts.value.splice(index, 1)
}

function startEdit(index: number) {
  const product = products.value[index]
  if (!product) return
  
  editForm.name = product.name
  editForm.quantity = product.quantity
  editForm.cost = product.cost
  editForm.price = product.price
  editingIndex.value = index
}

function saveEdit() {
  if (editingIndex.value === null) return
  
  if (editForm.name.trim() === '' || 
      editForm.quantity <= 0 || 
      Number(editForm.cost) < 0 || 
      Number(editForm.price) < 0) {
    return
  }
  
  products.value[editingIndex.value] = {
    name: editForm.name,
    quantity: editForm.quantity,
    cost: editForm.cost,
    price: editForm.price
  }
  
  editingIndex.value = null
}

function cancelEdit() {
  editingIndex.value = null
}
</script>

<style scoped>
#stock-simulator {
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  max-width: 1400px;
  margin: 0 auto;
  background: #0f172a;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 48px;
}

.header-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  border-radius: 20px;
  margin-bottom: 24px;
  color: white;
}

.header h1 {
  font-size: 42px;
  margin: 0 0 16px 0;
  color: #f1f5f9;
  font-weight: 700;
}

.subtitle {
  font-size: 18px;
  color: #94a3b8;
  margin: 0;
  line-height: 1.6;
}

.subtitle strong {
  color: #a78bfa;
}

.layout {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-container {
  flex: 0 0 auto;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 400px;
  background: #1a2332;
  padding: 28px;
  border-radius: 16px;
  border: 1px solid #334155;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #a78bfa;
  margin-bottom: -8px;
}

.form-header h2 {
  margin: 0;
  font-size: 20px;
  color: #f1f5f9;
}

.form-description {
  color: #94a3b8;
  font-size: 13px;
  margin: -8px 0 8px 0;
  line-height: 1.5;
}

.operational-costs-form .form-header {
  color: #f59e0b;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e2e8f0;
  font-weight: 600;
  font-size: 14px;
}

.label-icon {
  color: #a78bfa;
}

.label-text {
  flex: 1;
}

input {
  padding: 10px 12px;
  font-size: 15px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
  color: #f1f5f9;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #a78bfa;
}

.add-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 8px;
}

.add-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

.add-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-button.secondary {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.add-button.secondary:hover:not(:disabled) {
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.costs-list {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #334155;
}

.costs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.costs-header h3 {
  margin: 0;
  font-size: 16px;
  color: #e2e8f0;
  font-weight: 600;
}

.total-costs {
  background: #f59e0b;
  color: #0f172a;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
}

.cost-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #1a2332;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: border-color 0.2s;
  border: 1px solid transparent;
}

.cost-item:hover {
  border-color: #475569;
}

.cost-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.cost-name {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 14px;
}

.cost-value {
  color: #f59e0b;
  font-size: 16px;
  font-weight: 700;
}

.remove-cost-button {
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.remove-cost-button:hover {
  background: rgba(239, 68, 68, 0.1);
}

.stock-container {
  flex: 1;
  min-width: 500px;
  max-width: 800px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.summary-card {
  background: #1a2332;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #334155;
}

.summary-card .card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.summary-card.cost .card-header {
  color: #f59e0b;
}

.summary-card.value .card-header {
  color: #60a5fa;
}

.summary-card.profit .card-header {
  color: #34d399;
}

.summary-card h3 {
  margin: 0;
  font-size: 14px;
  color: #e2e8f0;
  font-weight: 600;
}

.summary-card .value {
  font-size: 32px;
  font-weight: 700;
  margin: 8px 0;
  color: #f1f5f9;
}

.summary-card .description {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.operational-impact {
  margin-top: 12px;
}

.divider {
  height: 1px;
  background: #334155;
  margin: 12px 0;
}

.impact-label {
  font-size: 12px;
  color: #94a3b8;
  margin: 0 0 6px 0;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.impact-value {
  font-size: 24px;
  font-weight: 700;
  margin: 4px 0;
  color: #f59e0b;
}

.impact-margin {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.products-list {
  background: #1a2332;
  padding: 28px;
  border-radius: 16px;
  border: 1px solid #334155;
}

.list-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  color: #a78bfa;
}

.list-header h2 {
  margin: 0;
  font-size: 20px;
  color: #f1f5f9;
  flex: 1;
}

.count {
  background: #334155;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  color: #cbd5e1;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
}

.empty-icon {
  color: #334155;
  margin-bottom: 16px;
}

.empty-state p {
  margin: 8px 0;
}

.hint {
  font-size: 14px;
  color: #475569;
}

.product-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-card {
  background: #0f172a;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #334155;
  transition: border-color 0.2s;
}

.product-card:hover {
  border-color: #475569;
}

.product-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #334155;
}

.product-header h4 {
  margin: 0;
  color: #f1f5f9;
  font-size: 18px;
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.edit-button,
.save-button,
.cancel-button,
.remove-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.edit-button {
  color: #60a5fa;
}

.edit-button:hover {
  background: rgba(96, 165, 250, 0.1);
}

.save-button {
  color: #34d399;
}

.save-button:hover {
  background: rgba(52, 211, 153, 0.1);
}

.cancel-button {
  color: #f59e0b;
}

.cancel-button:hover {
  background: rgba(245, 158, 11, 0.1);
}

.remove-button {
  color: #ef4444;
}

.remove-button:hover {
  background: rgba(239, 68, 68, 0.1);
}

.edit-input {
  background: #1a2332;
  border: 2px solid #60a5fa;
  border-radius: 6px;
  color: #f1f5f9;
  font-size: 14px;
  transition: border-color 0.2s;
  font-family: inherit;
}

.edit-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.edit-input.title {
  padding: 6px 10px;
  font-size: 18px;
  font-weight: 600;
  flex: 1;
}

.edit-input.small {
  padding: 4px 8px;
  width: 100px;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #cbd5e1;
  font-size: 14px;
}

.detail-item svg {
  color: #64748b;
}

.detail-item .label {
  color: #94a3b8;
  min-width: 100px;
}

.detail-item .value {
  color: #e2e8f0;
  font-weight: 600;
}

.product-totals {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #334155;
}

.total-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.total-item .label {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.total-item .value {
  font-size: 16px;
  font-weight: 700;
}

.cost-total .value {
  color: #f59e0b;
}

.value-total .value {
  color: #60a5fa;
}

.profit-total .value {
  color: #34d399;
}

.simulations-section {
  margin-top: 48px;
  padding-top: 48px;
  border-top: 2px solid #334155;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  color: #60a5fa;
}

.section-header h2 {
  margin: 0;
  font-size: 28px;
  color: #f1f5f9;
  font-weight: 700;
}

.section-description {
  font-size: 16px;
  color: #94a3b8;
  margin: 0 0 32px 0;
  line-height: 1.6;
}

.simulations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.simulation-card {
  background: #1a2332;
  padding: 24px;
  border-radius: 16px;
  border: 2px solid #334155;
}

.simulation-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
}

.simulation-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  flex-shrink: 0;
}

.simulation-icon.equal {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  color: white;
}

.simulation-icon.cost {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  color: white;
}

.simulation-icon.price {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
}

.simulation-header h3 {
  margin: 0 0 4px 0;
  font-size: 20px;
  color: #f1f5f9;
  font-weight: 700;
}

.simulation-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.simulation-description {
  font-size: 14px;
  color: #94a3b8;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.products-simulation {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sim-product {
  background: #0f172a;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #334155;
}

.sim-product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #334155;
}

.sim-product-name {
  font-weight: 700;
  color: #f1f5f9;
  font-size: 15px;
}

.sim-product-qty {
  font-size: 13px;
  color: #64748b;
  background: #1a2332;
  padding: 4px 10px;
  border-radius: 6px;
}

.sim-values {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sim-value-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.sim-label {
  color: #94a3b8;
}

.sim-data {
  color: #e2e8f0;
  font-weight: 600;
}

.sim-value-item.add {
  padding-left: 12px;
  border-left: 3px solid #f59e0b;
}

.sim-value-item.add .sim-data {
  color: #f59e0b;
}

.sim-value-item.current-price {
  padding: 6px 8px;
  background: rgba(96, 165, 250, 0.1);
  border-radius: 6px;
  margin-top: 4px;
}

.sim-value-item.current-price .sim-data {
  color: #60a5fa;
  font-weight: 700;
}

.sim-value-item.suggested {
  padding: 8px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(234, 179, 8, 0.15) 100%);
  border-radius: 6px;
  margin-top: 4px;
  border: 1px solid rgba(245, 158, 11, 0.3);
  font-weight: 600;
}

.sim-value-item.suggested .sim-label {
  color: #fbbf24;
}

.sim-value-item.suggested .sim-data {
  color: #fbbf24;
  font-size: 15px;
  font-weight: 700;
}

.sim-value-item.total {
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px solid #334155;
  font-size: 14px;
}

.sim-value-item.total .sim-data {
  color: #60a5fa;
  font-size: 15px;
}

.sim-value-item.profit .sim-data {
  color: #34d399;
}

.sim-value-item.total-profit {
  margin-top: 4px;
  padding: 8px;
  background: rgba(52, 211, 153, 0.1);
  border-radius: 6px;
  font-weight: 700;
}

.sim-value-item.total-profit .sim-data {
  color: #34d399;
  font-size: 15px;
}
</style>
