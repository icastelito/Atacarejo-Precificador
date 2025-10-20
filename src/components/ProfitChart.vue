<template>
  <div class="chart-container">
    <div class="chart-header">
      <LineChart :size="24" :stroke-width="2" />
      <h3>Simulação de Lucro x Desconto</h3>
    </div>
    <p class="chart-description">
      Veja como diferentes percentuais de desconto afetam seu lucro total
    </p>
    <apexchart
      width="100%"
      height="400"
      type="line"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { LineChart } from 'lucide-vue-next'
import { calculateTotalProfit, type SaleParams } from '../utils/calculations'

const props = defineProps<{
  params: SaleParams
}>()

const chartOptions = ref({
    chart: { id: 'profit-chart', toolbar: { show: false }, background: '#0b1220' },
    theme: { mode: 'dark' },
    colors: ['#34D399', '#60A5FA'],
    xaxis: {
      categories: [] as string[],
      title: { text: 'Desconto (%)' },
      labels: { style: { colors: '#cbd5e1' } }
    },
    yaxis: { title: { text: 'Lucro total (R$)' }, labels: { style: { colors: '#cbd5e1' } } },
    tooltip: { theme: 'dark' },
    stroke: { curve: 'smooth' }
  })

  const series = ref<{ name: string; data: number[] }[]>([])

  function updateChart() {
    const xs = Array.from({ length: 51 }, (_, i) => i) // 0%..50%
    chartOptions.value.xaxis.categories = xs.map(x => `${x}%`)

    const caseA = xs.map(x => calculateTotalProfit(props.params, x / 100, false))
    const caseB = xs.map(x => calculateTotalProfit(props.params, x / 100, true))

    series.value = [
      { name: 'Caso A (extra)', data: caseA },
      { name: 'Caso B (uniforme)', data: caseB }
    ]
  }


  watch(() => props.params, updateChart, { deep: true, immediate: true })
</script>

<style scoped>
.chart-container {
  background: #1a2332;
  padding: 28px;
  border-radius: 16px;
  margin-top: 24px;
  border: 1px solid #334155;
}
.chart-header {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #60a5fa;
  margin-bottom: 8px;
}
.chart-container h3 {
  margin: 0;
  font-size: 18px;
  color: #f1f5f9;
}
.chart-description {
  color: #94a3b8;
  font-size: 14px;
  margin: 0 0 24px 0;
  line-height: 1.5;
}
</style>
