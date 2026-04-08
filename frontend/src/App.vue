<script setup lang="ts">
import { ref } from 'vue'
import SurveyForm from './components/SurveyForm.vue'
import RadarChart from './components/RadarChart.vue'
import type { IRadarDataResponse } from './types'

const radarData = ref<IRadarDataResponse | null>(null)
const companyName = ref('')

function handleSubmitted(data: IRadarDataResponse, name: string) {
  radarData.value = data
  companyName.value = name
}

function handleReset() {
  radarData.value = null
  companyName.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-slate-900">SDLC Maturity Assessment</h1>
            <p class="text-sm text-slate-500">Secure Development Lifecycle evaluation based on NIST SSDF</p>
          </div>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <RadarChart
        v-if="radarData"
        :categories="radarData.radarData.categories"
        :scores="radarData.radarData.scores"
        :company-name="companyName"
        @reset="handleReset"
      />
      <SurveyForm v-else @submitted="handleSubmitted" />
    </main>
  </div>
</template>
