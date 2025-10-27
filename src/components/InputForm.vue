<template>
  <div class="form">
    <div class="form-header">
      <Settings :size="24" :stroke-width="2" />
      <h2>Parâmetros do Negócio</h2>
    </div>
    <p class="description">Configure os valores para calcular o desconto máximo que mantém seu lucro.</p>

    <div class="field" v-for="input in inputs" :key="input.key">
      <label :for="input.key">
        <component :is="input.icon" :size="16" :stroke-width="2" class="label-icon" />
        <span class="label-text">
          {{ input.label }}
          <span class="hint" v-if="input.hint">{{ input.hint }}</span>
        </span>
      </label>
      <input
        :id="input.key"
        type="number"
        :step="input.step"
        v-model="input.value"
        @input="emitUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { DollarSign, Factory, CreditCard, FileText, Package, Settings } from 'lucide-vue-next'
import type { SaleParams } from '../utils/calculations'

const emit = defineEmits<{
  (e: 'update', params: SaleParams): void
}>()

interface InputField {
  key: string
  label: string
  value: string | number
  step: string
  hint?: string
  icon: any
}

// Estado interno reativo
const inputs = reactive<InputField[]>([
  { key: 'unitPrice', label: 'Preço de venda', value: '19.90000000', step: '0.00000001', hint: 'Preço por unidade', icon: DollarSign },
  { key: 'unitCost', label: 'Custo unitário', value: '3.35490000', step: '0.00000001', hint: 'Quanto custa produzir/comprar', icon: Factory },
  { key: 'fixedFeeBeforePercentage', label: 'Taxa fixa inicial', value: '0.00000000', step: '0.00000001', hint: 'Taxa fixa antes do percentual', icon: FileText },
  { key: 'platformFeeRate', label: 'Taxa da plataforma (%)', value: '20.00000000', step: '0.00000001', hint: 'Ex: Mercado Livre, iFood', icon: CreditCard },
  { key: 'fixedFeeAfterPercentage', label: 'Taxa fixa final', value: '4.00000000', step: '0.00000001', hint: 'Taxa fixa após o percentual', icon: FileText },
  { key: 'baseQuantity', label: 'Quantidade', value: 1, step: '1', hint: 'Quantidade de unidades', icon: Package }
])

function emitUpdate() {
  const params: SaleParams = {
    unitPrice: inputs.find(i => i.key === 'unitPrice')!.value,
    unitCost: inputs.find(i => i.key === 'unitCost')!.value,
    fixedFeeBeforePercentage: inputs.find(i => i.key === 'fixedFeeBeforePercentage')!.value,
    platformFeeRate: Number(inputs.find(i => i.key === 'platformFeeRate')!.value) / 100,
    fixedFeeAfterPercentage: inputs.find(i => i.key === 'fixedFeeAfterPercentage')!.value,
    baseQuantity: Number(inputs.find(i => i.key === 'baseQuantity')!.value)
  }
  emit('update', params)
}

emitUpdate()
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
  background: #1a2332;
  padding: 28px;
  border-radius: 16px;
  border: 1px solid #334155;
}
.form-header {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #60a5fa;
  margin-bottom: -8px;
}
.form-header h2 {
  margin: 0;
  font-size: 20px;
  color: #f1f5f9;
}
.description {
  color: #94a3b8;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #e2e8f0;
  font-weight: 600;
  font-size: 14px;
}
.label-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: #60a5fa;
}
.label-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.hint {
  display: block;
  color: #64748b;
  font-size: 12px;
  font-weight: 400;
  margin-top: 4px;
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
  border-color: #60a5fa;
}
</style>
