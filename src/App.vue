<template>
  <div id="app">
    <nav class="navbar" v-if="currentView !== 'home'">
      <button @click="currentView = 'home'" class="nav-button home">
        <Home :size="20" :stroke-width="2" />
        <span>Início</span>
      </button>
      <div class="nav-links">
        <button 
          @click="currentView = 'pricing'" 
          class="nav-button"
          :class="{ active: currentView === 'pricing' }"
        >
          <TrendingUp :size="20" :stroke-width="2" />
          <span>Precificador</span>
        </button>
        <button 
          @click="currentView = 'stock'" 
          class="nav-button"
          :class="{ active: currentView === 'stock' }"
        >
          <Package :size="20" :stroke-width="2" />
          <span>Estoque</span>
        </button>
      </div>
    </nav>

    <component :is="currentComponent" @navigate="handleNavigate" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { TrendingUp, Package, Home } from 'lucide-vue-next'
import HomeView from './views/Home.vue'
import Pricing from './views/Pricing.vue'
import StockSimulator from './views/StockSimulator.vue'

const currentView = ref<'home' | 'pricing' | 'stock'>('home')

const currentComponent = computed(() => {
  switch (currentView.value) {
    case 'pricing':
      return Pricing
    case 'stock':
      return StockSimulator
    default:
      return HomeView
  }
})

function handleNavigate(path: string) {
  if (path === '/pricing') {
    currentView.value = 'pricing'
  } else if (path === '/stock') {
    currentView.value = 'stock'
  } else {
    currentView.value = 'home'
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background: #0f172a;
}

#app {
  min-height: 100vh;
}

.navbar {
  background: #1a2332;
  border-bottom: 1px solid #334155;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  color: #94a3b8;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.nav-button:hover {
  background: #0f172a;
  color: #e2e8f0;
}

.nav-button.home {
  margin-right: auto;
  color: #60a5fa;
}

.nav-button.home:hover {
  background: rgba(96, 165, 250, 0.1);
}

.nav-button.active {
  background: #0f172a;
  border-color: #60a5fa;
  color: #60a5fa;
}

.nav-links {
  display: flex;
  gap: 12px;
}
</style>
