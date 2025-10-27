<template>
  <div id="pricing">
    <header class="header">
      <div class="header-icon">
        <TrendingUp :size="48" :stroke-width="2" />
      </div>
      <h1>Atacarejo Precificador</h1>
      <p class="subtitle">
        Compare estratégias de venda e encontre o melhor preço 
        <strong>maximizando seu lucro</strong>
      </p>
      <div class="example">
        <div class="example-icon">
          <Lightbulb :size="28" :stroke-width="2" />
        </div>
        <div>
          <strong>Exemplo:</strong> Compare o lucro vendendo tudo junto vs vendendo cada unidade separadamente,
          e descubra o preço ideal para vendas diretas (fora da plataforma).
        </div>
      </div>
    </header>

    <div class="layout">
      <InputForm @update="updateParams" />
      <ResultDisplay
        :baseProfit="baseProfit"
        :salesComparison="salesComparison"
        :directSale="directSale"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { TrendingUp, Lightbulb } from 'lucide-vue-next'
import InputForm from '../components/InputForm.vue'
import ResultDisplay from '../components/ResultDisplay.vue'
import {
  calculateBaseProfit,
  compareSalesStrategies,
  calculateDirectSalePrice,
  type SaleParams
} from '../utils/calculations'

const params = ref<SaleParams>({
  unitPrice: '19.90000000',
  unitCost: '3.35490000',
  fixedFeeBeforePercentage: '0.00000000',
  platformFeeRate: 0.2,
  fixedFeeAfterPercentage: '4.00000000',
  baseQuantity: 1
})

function updateParams(newParams: SaleParams) {
  params.value = newParams
}

const baseProfit = computed(() => calculateBaseProfit(params.value))
const salesComparison = computed(() => compareSalesStrategies(params.value))
const directSale = computed(() => calculateDirectSalePrice(params.value))
</script>

<style scoped>
#pricing {
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
</style>
