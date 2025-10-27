<template>
  <div id="home">
    <header class="header">
      <div class="header-icon">
        <Sparkles :size="48" :stroke-width="2" />
      </div>
      <h1>Atacarejo Tools</h1>
      <p class="subtitle">
        Ferramentas profissionais para <strong>gestão e precificação</strong> do seu negócio
      </p>
    </header>

    <div class="tools-grid">
      <div class="tool-card" @click="navigateTo('/pricing')">
        <div class="tool-icon pricing">
          <TrendingUp :size="40" :stroke-width="2" />
        </div>
        <h2>Precificador</h2>
        <p>Compare estratégias de venda e encontre o melhor preço para maximizar seu lucro</p>
        <div class="features">
          <div class="feature">
            <Check :size="16" :stroke-width="2" />
            <span>Comparação de vendas</span>
          </div>
          <div class="feature">
            <Check :size="16" :stroke-width="2" />
            <span>Cálculo de taxas</span>
          </div>
          <div class="feature">
            <Check :size="16" :stroke-width="2" />
            <span>Venda direta</span>
          </div>
        </div>
        <button class="access-button">
          <span>Acessar Precificador</span>
          <ArrowRight :size="20" :stroke-width="2" />
        </button>
      </div>

      <div class="tool-card" @click="navigateTo('/stock')">
        <div class="tool-icon stock">
          <Package :size="40" :stroke-width="2" />
        </div>
        <h2>Simulador de Estoque</h2>
        <p>Gerencie seu estoque e acompanhe custos e valores totais em tempo real</p>
        <div class="features">
          <div class="feature">
            <Check :size="16" :stroke-width="2" />
            <span>Controle de produtos</span>
          </div>
          <div class="feature">
            <Check :size="16" :stroke-width="2" />
            <span>Custo vs Valor</span>
          </div>
          <div class="feature">
            <Check :size="16" :stroke-width="2" />
            <span>Lucro potencial</span>
          </div>
        </div>
        <button class="access-button">
          <span>Acessar Simulador</span>
          <ArrowRight :size="20" :stroke-width="2" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Sparkles, TrendingUp, Package, Check, ArrowRight } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'navigate', path: string): void
}>()

function navigateTo(path: string) {
  emit('navigate', path)
}
</script>

<style scoped>
#home {
  padding: 60px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  background: #0f172a;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 64px;
}

.header-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 24px;
  margin-bottom: 32px;
  color: white;
}

.header h1 {
  font-size: 52px;
  margin: 0 0 20px 0;
  color: #f1f5f9;
  font-weight: 700;
}

.subtitle {
  font-size: 20px;
  color: #94a3b8;
  margin: 0;
  line-height: 1.6;
}

.subtitle strong {
  color: #60a5fa;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 32px;
  max-width: 900px;
  margin: 0 auto;
}

.tool-card {
  background: #1a2332;
  padding: 36px;
  border-radius: 20px;
  border: 2px solid #334155;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.tool-card:hover {
  border-color: #60a5fa;
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(96, 165, 250, 0.2);
}

.tool-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 16px;
  margin-bottom: 24px;
  color: white;
}

.tool-icon.pricing {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
}

.tool-icon.stock {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
}

.tool-card h2 {
  font-size: 28px;
  margin: 0 0 12px 0;
  color: #f1f5f9;
  font-weight: 700;
}

.tool-card > p {
  font-size: 16px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0 0 24px 0;
  flex: 1;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #cbd5e1;
  font-size: 14px;
}

.feature svg {
  color: #34d399;
  flex-shrink: 0;
}

.access-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.tool-card:hover .access-button {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  transform: translateX(4px);
}
</style>
