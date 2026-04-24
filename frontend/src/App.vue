<script setup lang="ts">
import { ref } from 'vue'
import ProfilingForm from './components/ProfilingForm.vue'
import SurveyForm from './components/SurveyForm.vue'
import RadarChart from './components/RadarChart.vue'
import SiteFooter from './components/SiteFooter.vue'
import type { IRadarDataResponse, ISurveyContext } from './types'

type Step = 'profiling' | 'assessment' | 'results'

const step = ref<Step>('profiling')
const surveyContext = ref<ISurveyContext>({
  companyName: undefined,
  contactEmail: undefined,
  profile: {},
})
const submissionResult = ref<IRadarDataResponse | null>(null)

function handleProfilingCompleted(context: ISurveyContext) {
  surveyContext.value = context
  step.value = 'assessment'
}

function handleSubmitted(data: IRadarDataResponse) {
  submissionResult.value = data
  step.value = 'results'
}

function handleBack() {
  step.value = 'profiling'
}

function handleReset() {
  submissionResult.value = null
  surveyContext.value = {
    companyName: undefined,
    contactEmail: undefined,
    profile: {},
  }
  step.value = 'profiling'
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-50">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <div class="flex items-start gap-3 sm:gap-4">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 sm:h-11 sm:w-11">
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-xl font-bold text-slate-900 sm:text-2xl">SDLC Maturity Assessment</h1>
            <p class="mt-2 text-sm leading-relaxed text-slate-600 sm:mt-2.5 sm:text-[15px] sm:leading-7">
              Avaliação de Maturidade do Ciclo de Vida de Desenvolvimento Seguro (Secure SDLC) baseada no Framework
              NIST SSDF (Secure Software Development Framework).
            </p>
          </div>
        </div>
      </div>
    </header>

    <main class="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
      <ProfilingForm
        v-if="step === 'profiling'"
        @completed="handleProfilingCompleted"
      />
      <SurveyForm
        v-else-if="step === 'assessment'"
        :survey-context="surveyContext"
        @submitted="handleSubmitted"
        @back="handleBack"
      />
      <RadarChart
        v-else-if="step === 'results' && submissionResult"
        :categories="submissionResult.radarData.categories"
        :scores="submissionResult.radarData.scores"
        :coverage="submissionResult.radarData.coverage"
        :display-name="submissionResult.displayName"
        :submission-reference="submissionResult.submissionReference"
        @reset="handleReset"
      />
    </main>
    <SiteFooter />
  </div>
</template>
