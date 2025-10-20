<template>
  <div id="app">
    <header class="header">
      <div class="header-icon">
        <TrendingUp :size="48" :stroke-width="2" />
      </div>
      <h1>Atacarejo Precificador</h1>
      <p class="subtitle">
        Descubra quanto desconto você pode dar para vender mais unidades 
        <strong>sem reduzir sua margem de lucro</strong>
      </p>
      <div class="example">
        <div class="example-icon">
          <Lightbulb :size="28" :stroke-width="2" />
        </div>
        <div>
          <strong>Exemplo:</strong> Se você vende 100 unidades a R$ 10,00 com lucro de R$ 200,00, 
          quanto pode descontar se vender 1001 unidades mantendo os mesmos R$ 200,00 de lucro?
        </div>
      </div>
    </header>

    <div class="layout">
      <InputForm @update="updateParams" />
      <div class="results-container">
        <ResultDisplay
          :baseProfit="baseProfit"
          :maxExtraDiscount="maxExtraDiscount"
          :maxUniformDiscount="maxUniformDiscount"
          :salesComparison="salesComparison"
          :directSale="directSale"
        />
        <ProfitChart :params="params" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { TrendingUp, Lightbulb } from 'lucide-vue-next'
import InputForm from './components/InputForm.vue'
import ResultDisplay from './components/ResultDisplay.vue'
import ProfitChart from './components/ProfitChart.vue'
import {
  calculateBaseProfit,
  calculateMaxDiscountPerExtraUnit,
  calculateUniformDiscount,
  compareSalesStrategies,
  calculateDirectSalePrice,
  type SaleParams
} from './utils/calculations'

const params = ref<SaleParams>({
  unitPrice: '19.90000000',
  unitCost: '3.35490000',
  platformFeeRate: 0.2,
  fixedFee: '4.00000000',
  baseQuantity: 1,
  extraQuantity: 1
})

function updateParams(newParams: SaleParams) {
  params.value = newParams
}

const baseProfit = computed(() => calculateBaseProfit(params.value))
const maxExtraDiscount = computed(() => calculateMaxDiscountPerExtraUnit(params.value))
const maxUniformDiscount = computed(() => calculateUniformDiscount(params.value))
const salesComparison = computed(() => compareSalesStrategies(params.value))
const directSale = computed(() => calculateDirectSalePrice(params.value))
</script>

<style scoped>
#app {
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
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
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
  margin: 0 0 24px 0;
  line-height: 1.6;
}
.subtitle strong {
  color: #34d399;
}
.example {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  background: #1a2332;
  padding: 20px 24px;
  border-radius: 12px;
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
  border: 1px solid #334155;
}
.example-icon {
  font-size: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #3b82f6;
  border-radius: 8px;
  color: white;
}
.example {
  font-size: 15px;
  color: #cbd5e1;
  line-height: 1.6;
}
.example strong {
  color: #60a5fa;
}
.layout {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
}
.results-container {
  flex: 1;
  min-width: 500px;
  max-width: 700px;
}
</style>
