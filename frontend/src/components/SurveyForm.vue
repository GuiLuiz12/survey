<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { IRequirement, IRadarDataResponse } from '../types'
import { getRequirements, submitSurvey } from '../services/api'

const emit = defineEmits<{
  submitted: [data: IRadarDataResponse, companyName: string]
}>()

const requirements = ref<IRequirement[]>([])
const companyName = ref('')
const answers = ref<Record<string, number>>({})
const loading = ref(true)
const submitting = ref(false)
const error = ref('')
const expandedHints = ref<Set<string>>(new Set())

const scores = [0, 1, 2, 3, 4, 5]

const answeredCount = computed(() => Object.keys(answers.value).length)
const allAnswered = computed(() => answeredCount.value === 30 && companyName.value.trim().length > 0)

function toggleHint(id: string) {
  if (expandedHints.value.has(id)) {
    expandedHints.value.delete(id)
  } else {
    expandedHints.value.add(id)
  }
}

function setAnswer(id: string, value: number) {
  answers.value[id] = value
}

async function handleSubmit() {
  if (!allAnswered.value) return

  submitting.value = true
  error.value = ''

  try {
    const result = await submitSurvey({
      companyName: companyName.value.trim(),
      answers: answers.value,
    })
    emit('submitted', result, companyName.value.trim())
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to submit survey. Please try again.'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    requirements.value = await getRequirements()
  } catch {
    error.value = 'Failed to load requirements. Is the backend running?'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center py-20">
    <div class="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600"></div>
  </div>

  <form v-else @submit.prevent="handleSubmit" class="space-y-8">
    <!-- Company Name -->
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <label for="companyName" class="block text-sm font-semibold text-slate-700 mb-2">
        Company Name
      </label>
      <input
        id="companyName"
        v-model="companyName"
        type="text"
        placeholder="Enter the company name being assessed"
        class="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
      />
    </div>

    <!-- Progress -->
    <div class="sticky top-0 z-10 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur-sm">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-slate-600">Progress</span>
        <span class="text-sm font-semibold text-indigo-600">{{ answeredCount }} / 30</span>
      </div>
      <div class="h-2 w-full rounded-full bg-slate-100">
        <div
          class="h-2 rounded-full bg-indigo-600 transition-all duration-300"
          :style="{ width: `${(answeredCount / 30) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- Questions -->
    <div
      v-for="(req, idx) in requirements"
      :key="req.id"
      class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <div class="flex items-start gap-4">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">
          {{ idx + 1 }}
        </span>
        <div class="flex-1 space-y-4">
          <div>
            <p class="text-sm font-medium text-slate-400 mb-1">{{ req.id }}</p>
            <p class="text-base text-slate-800 leading-relaxed">{{ req.question }}</p>
          </div>

          <!-- Evidence Hint -->
          <button
            type="button"
            @click="toggleHint(req.id)"
            class="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
          >
            <svg
              class="h-4 w-4 transition-transform"
              :class="{ 'rotate-90': expandedHints.has(req.id) }"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            Expected Evidence
          </button>
          <div
            v-if="expandedHints.has(req.id)"
            class="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800"
          >
            {{ req.expectedEvidence }}
          </div>

          <!-- Score Selection -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="score in scores"
              :key="score"
              type="button"
              @click="setAnswer(req.id, score)"
              class="flex h-10 w-10 items-center justify-center rounded-lg border-2 text-sm font-semibold transition"
              :class="answers[req.id] === score
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50'"
            >
              {{ score }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ error }}
    </div>

    <!-- Submit -->
    <div class="flex justify-center pb-8">
      <button
        type="submit"
        :disabled="!allAnswered || submitting"
        class="rounded-xl px-10 py-4 text-lg font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-40"
        :class="allAnswered && !submitting
          ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl'
          : 'bg-slate-400'"
      >
        <span v-if="submitting" class="inline-flex items-center gap-2">
          <div class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
          Submitting...
        </span>
        <span v-else>Submit Assessment</span>
      </button>
    </div>
  </form>
</template>
