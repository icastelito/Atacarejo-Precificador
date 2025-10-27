<template>
  <div class="results">
    <div class="results-header">
      <TrendingUp :size="24" :stroke-width="2" />
      <h2>Análise de Descontos</h2>
    </div>
    
    <div class="profit-card">
      <div class="card-header">
        <DollarSign :size="20" :stroke-width="2" />
        <h3>Lucro Atual (sem desconto)</h3>
      </div>
      <p class="value">R$ {{ baseProfit.toFixed(8) }}</p>
      <p class="description">Este é seu lucro base mantendo o preço normal</p>
    </div>

    <div class="comparison-card">
      <div class="card-header">
        <GitCompare :size="20" :stroke-width="2" />
        <h3>Comparativo: Venda Única vs Vendas Separadas</h3>
      </div>
      <p class="info-text">
        Veja a diferença entre vender tudo numa única venda ou cada unidade separadamente
      </p>
      
      <div class="comparison-grid">
        <div class="comparison-item single">
          <div class="icon-wrapper">
            <Package :size="24" :stroke-width="2" />
          </div>
          <div class="content">
            <h4>Venda Única</h4>
            <p class="detail">Todas as unidades numa só venda</p>
            <p class="profit-value">R$ {{ salesComparison.singleSaleProfit.toFixed(8) }}</p>
          </div>
        </div>
        
        <div class="comparison-item separate">
          <div class="icon-wrapper">
            <Layers :size="24" :stroke-width="2" />
          </div>
          <div class="content">
            <h4>Vendas Separadas</h4>
            <p class="detail">Cada unidade em venda separada</p>
            <p class="profit-value">R$ {{ salesComparison.separateSalesProfit.toFixed(8) }}</p>
          </div>
        </div>
      </div>

      <div class="savings-highlight" v-if="salesComparison.difference > 0">
        <div class="savings-icon">
          <TrendingUp :size="28" :stroke-width="2" />
        </div>
        <div class="savings-content">
          <h4>Economia vendendo tudo junto</h4>
          <p class="savings-amount">R$ {{ salesComparison.difference.toFixed(8) }}</p>
          <p class="savings-percent">{{ salesComparison.percentageDifference.toFixed(2) }}% a mais de lucro</p>
          <p class="savings-explanation">
            Você economiza nas taxas fixas ao consolidar a venda. 
            Em vendas separadas, você pagaria a taxa fixa múltiplas vezes.
          </p>
        </div>
      </div>

      <div class="warning-highlight" v-else-if="salesComparison.difference < 0">
        <div class="warning-icon">
          <AlertTriangle :size="28" :stroke-width="2" />
        </div>
        <div class="warning-content">
          <h4>Vendas separadas são mais lucrativas</h4>
          <p class="warning-amount">R$ {{ Math.abs(salesComparison.difference).toFixed(8) }}</p>
          <p class="warning-explanation">
            Neste cenário específico, vendas separadas geram mais lucro.
          </p>
        </div>
      </div>
    </div>

    <div class="direct-sale-card">
      <div class="card-header">
        <Handshake :size="20" :stroke-width="2" />
        <h3>Venda Direta (Sem Plataforma)</h3>
      </div>
      <p class="info-text">
        Preço sugerido para vender direto, comparado com o cliente comprando cada unidade separadamente na plataforma
      </p>

      <div class="direct-sale-grid">
        <div class="price-comparison">
          <div class="price-box platform">
            <div class="price-box-header">
              <Store :size="18" :stroke-width="2" />
              <span class="price-label">Vendas Separadas na Plataforma</span>
            </div>
            <div class="price-details">
              <span class="unit-price">R$ {{ directSale.platformPricePerUnit.toFixed(8) }}/un</span>
              <span class="total-price">Total: R$ {{ directSale.totalPlatformPrice.toFixed(8) }}</span>
              <span class="detail-note">Cliente pagaria isso comprando cada unidade separada</span>
            </div>
          </div>

          <div class="arrow">
            <ArrowRight :size="32" :stroke-width="2" />
          </div>

          <div class="price-box direct">
            <div class="price-box-header">
              <Wallet :size="18" :stroke-width="2" />
              <span class="price-label">Venda Direta (Tudo Junto)</span>
            </div>
            <div class="price-details">
              <span class="unit-price highlight">R$ {{ directSale.directPricePerUnit.toFixed(8) }}/un</span>
              <span class="total-price highlight">Total: R$ {{ directSale.totalDirectPrice.toFixed(8) }}</span>
              <span class="detail-note">Preço direto sem taxas da plataforma</span>
            </div>
          </div>
        </div>

        <div class="benefits-grid">
          <div class="benefit-card customer">
            <div class="benefit-icon">
              <SmilePlus :size="28" :stroke-width="2" />
            </div>
            <div class="benefit-content">
              <h4>Cliente Economiza</h4>
              <p class="benefit-value">R$ {{ directSale.customerSavings.toFixed(8) }}</p>
              <p class="benefit-percent">{{ directSale.customerSavingsPercentage.toFixed(2) }}% de desconto</p>
              <p class="benefit-desc">O cliente paga menos que na plataforma</p>
            </div>
          </div>

          <div class="benefit-card seller">
            <div class="benefit-icon">
              <Target :size="28" :stroke-width="2" />
            </div>
            <div class="benefit-content">
              <h4>Você Mantém o Lucro</h4>
              <p class="benefit-value">R$ {{ directSale.sellerProfit.toFixed(8) }}</p>
              <p class="benefit-desc">Mesmo lucro da plataforma, mas sem pagar taxas!</p>
            </div>
          </div>
        </div>

        <div class="direct-sale-summary">
          <div class="summary-icon">
            <Sparkles :size="28" :stroke-width="2" />
          </div>
          <div class="summary-content">
            <h4>Vantagens da Venda Direta</h4>
            <ul>
              <li><strong>Cliente ganha:</strong> Paga {{ directSale.customerSavingsPercentage.toFixed(2) }}% menos (R$ {{ directSale.customerSavings.toFixed(2) }}) vs comprar separado</li>
              <li><strong>Você ganha:</strong> Lucro de R$ {{ directSale.sellerProfit.toFixed(2) }} sem pagar taxas múltiplas</li>
              <li><strong>Win-Win:</strong> Cliente economiza nas taxas e você mantém seu lucro</li>
              <li><strong>Consolidação:</strong> Vender tudo junto elimina custos de múltiplas transações</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  TrendingUp, 
  DollarSign, 
  GitCompare, 
  Package, 
  Layers, 
  AlertTriangle, 
  Handshake, 
  Store, 
  ArrowRight, 
  Wallet,
  SmilePlus
} from 'lucide-vue-next'
import type { SalesComparison, DirectSaleAnalysis } from '../utils/calculations'

defineProps<{
  baseProfit: number
  salesComparison: SalesComparison
  directSale: DirectSaleAnalysis
}>()
</script>

<style scoped>
.results {
  font-family: sans-serif;
  color: #e2e8f0;
}
.results-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  color: #60a5fa;
}
.results-header h2 {
  margin: 0;
  font-size: 24px;
  color: #f1f5f9;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  color: #60a5fa;
}
.card-header h3 {
  margin: 0;
  font-size: 16px;
  color: #f1f5f9;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  color: #60a5fa;
}
.section-header h3 {
  margin: 0;
  font-size: 18px;
  color: #f1f5f9;
}
.profit-card {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
}
.profit-card .value {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #ffffff;
}
.profit-card .description {
  margin: 0;
  font-size: 14px;
  color: #bfdbfe;
}
.comparison-card {
  background: #1a2332;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid #334155;
}
.info-text {
  color: #94a3b8;
  font-size: 14px;
  margin: 0 0 20px 0;
}
.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}
.comparison-item {
  background: #0f172a;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: border-color 0.3s;
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.comparison-item.single {
  border-color: #34d399;
}
.comparison-item.separate {
  border-color: #f59e0b;
}
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(96, 165, 250, 0.1);
  border-radius: 8px;
  color: #60a5fa;
  flex-shrink: 0;
}
.comparison-item h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #f1f5f9;
}
.comparison-item .detail {
  color: #64748b;
  font-size: 13px;
  margin: 0 0 12px 0;
}
.comparison-item .profit-value {
  font-size: 22px;
  font-weight: 700;
  color: #34d399;
  margin: 0;
}
.savings-highlight {
  display: flex;
  gap: 16px;
  background: linear-gradient(135deg, #065f46 0%, #059669 100%);
  padding: 20px;
  border-radius: 8px;
  align-items: flex-start;
}
.savings-icon {
  font-size: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #6ee7b7;
}
.savings-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #d1fae5;
}
.savings-amount {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px 0;
}
.savings-percent {
  font-size: 16px;
  color: #6ee7b7;
  margin: 0 0 12px 0;
  font-weight: 600;
}
.savings-explanation {
  font-size: 14px;
  color: #d1fae5;
  margin: 0;
  line-height: 1.5;
}
.warning-highlight {
  display: flex;
  gap: 16px;
  background: linear-gradient(135deg, #b45309 0%, #f59e0b 100%);
  padding: 20px;
  border-radius: 8px;
  align-items: flex-start;
}
.warning-icon {
  font-size: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fbbf24;
}
.warning-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #fef3c7;
}
.warning-amount {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}
.warning-explanation {
  font-size: 14px;
  color: #fef3c7;
  margin: 0;
  line-height: 1.5;
}
.direct-sale-card {
  background: linear-gradient(135deg, #312e81 0%, #4c1d95 100%);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 2px solid #6366f1;
}
.direct-sale-card h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #f1f5f9;
}
.direct-sale-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.price-comparison {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 8px;
}
.price-box {
  flex: 1;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}
.price-box.platform {
  background: rgba(248, 113, 113, 0.2);
  border: 2px solid #ef4444;
}
.price-box.direct {
  background: rgba(52, 211, 153, 0.2);
  border: 2px solid #34d399;
}
.price-box-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.price-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.price-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.unit-price {
  font-size: 20px;
  font-weight: 700;
  color: #f1f5f9;
}
.unit-price.highlight {
  color: #34d399;
}
.total-price {
  font-size: 14px;
  color: #94a3b8;
}
.total-price.highlight {
  color: #6ee7b7;
  font-weight: 600;
}
.detail-note {
  font-size: 11px;
  color: #64748b;
  margin-top: 4px;
  font-style: italic;
}
.arrow {
  font-size: 32px;
  color: #60a5fa;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.benefits-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.benefit-card {
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 8px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.benefit-card.customer {
  border-left: 4px solid #60a5fa;
}
.benefit-card.seller {
  border-left: 4px solid #34d399;
}
.benefit-icon {
  font-size: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(96, 165, 250, 0.1);
  border-radius: 8px;
  color: #60a5fa;
}
.benefit-content h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #f1f5f9;
}
.benefit-value {
  font-size: 24px;
  font-weight: 700;
  color: #34d399;
  margin: 0 0 4px 0;
}
.benefit-percent {
  font-size: 14px;
  color: #60a5fa;
  font-weight: 600;
  margin: 0 0 8px 0;
}
.benefit-desc {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
  line-height: 1.4;
}
.direct-sale-summary {
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 8px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.summary-icon {
  font-size: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(139, 92, 246, 0.2);
  border-radius: 8px;
  color: #a78bfa;
}
.summary-content h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #f1f5f9;
}
.summary-content ul {
  margin: 0;
  padding-left: 20px;
  color: #cbd5e1;
}
.summary-content li {
  margin-bottom: 8px;
  line-height: 1.5;
  font-size: 14px;
}
.summary-content li strong {
  color: #34d399;
}
.strategy-section {
  margin-top: 24px;
}
.strategy-section h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
}
.info {
  color: #94a3b8;
  font-size: 14px;
  margin: 0 0 20px 0;
}
.strategy-card {
  background: #1a2332;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  border-left: 4px solid;
}
.strategy-card.case-a {
  border-left-color: #34d399;
}
.strategy-card.case-b {
  border-left-color: #60a5fa;
}
.strategy-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.badge {
  background: #334155;
  color: #94a3b8;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}
.strategy-card h4 {
  margin: 0;
  font-size: 16px;
  color: #f1f5f9;
}
.explanation {
  color: #94a3b8;
  font-size: 14px;
  margin: 0 0 16px 0;
  line-height: 1.5;
}
.discount-info {
  background: #0f172a;
  padding: 16px;
  border-radius: 8px;
}
.discount-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.discount-value .label {
  color: #cbd5e1;
  font-size: 14px;
}
.discount-value .amount {
  color: #34d399;
  font-size: 20px;
  font-weight: 700;
}
.discount-percent {
  color: #60a5fa;
  font-size: 18px;
  font-weight: 600;
  text-align: right;
}
</style>
