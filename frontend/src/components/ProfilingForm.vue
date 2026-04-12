<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { IProfilingQuestion, ICompanyProfile } from '../types'
import { getProfilingQuestions } from '../services/api'

const emit = defineEmits<{
  completed: [companyName: string, profile: ICompanyProfile]
}>()

const questions = ref<IProfilingQuestion[]>([])
const companyName = ref('')
const answers = ref<ICompanyProfile>({})
const loading = ref(true)
const error = ref('')

const allAnswered = computed(() => {
  if (companyName.value.trim().length === 0) return false
  return questions.value.every(q => {
    const val = answers.value[q.id]
    if (q.multiSelect) return Array.isArray(val) && val.length > 0
    return typeof val === 'string' && val.length > 0
  })
})

function selectSingle(questionId: string, option: string) {
  answers.value[questionId] = option
}

function toggleMulti(questionId: string, option: string) {
  const current = (answers.value[questionId] as string[] | undefined) || []
  const idx = current.indexOf(option)
  if (idx === -1) {
    answers.value[questionId] = [...current, option]
  } else {
    answers.value[questionId] = current.filter((_, i) => i !== idx)
  }
}

function isOptionSelected(questionId: string, option: string): boolean {
  const val = answers.value[questionId]
  if (Array.isArray(val)) return val.includes(option)
  return val === option
}

function handleNext() {
  if (!allAnswered.value) return
  emit('completed', companyName.value.trim(), { ...answers.value })
}

onMounted(async () => {
  try {
    questions.value = await getProfilingQuestions()
  } catch {
    error.value = 'Failed to load profiling questions. Is the backend running?'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center py-20">
    <div class="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600"></div>
  </div>

  <div v-else class="space-y-8">
    <!-- Intro -->
    <div class="rounded-xl border border-indigo-100 bg-indigo-50/50 p-6">
      <h2 class="text-lg font-bold text-slate-800 mb-2">Questionário de Perfilamento Inicial</h2>
      <p class="text-sm text-slate-600 leading-relaxed">
        Antes de iniciar a avaliação de maturidade, precisamos entender o perfil da sua empresa.
        Essas informações ajudarão a contextualizar os resultados.
      </p>
    </div>

    <!-- Company Name -->
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <label for="companyName" class="block text-sm font-semibold text-slate-700 mb-2">
        Nome da Empresa
      </label>
      <input
        id="companyName"
        v-model="companyName"
        type="text"
        placeholder="Digite o nome da empresa avaliada"
        class="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
      />
    </div>

    <!-- Questions -->
    <div
      v-for="(q, idx) in questions"
      :key="q.id"
      class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div class="flex items-start gap-4">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">
          {{ idx + 1 }}
        </span>
        <div class="flex-1 space-y-3">
          <p class="text-base text-slate-800 leading-relaxed">{{ q.question }}</p>
          <div v-if="q.multiSelect" class="text-xs text-slate-400 font-medium">Selecione todas as aplicáveis</div>
          <div class="space-y-2">
            <button
              v-for="option in q.options"
              :key="option"
              type="button"
              @click="q.multiSelect ? toggleMulti(q.id, option) : selectSingle(q.id, option)"
              class="w-full rounded-lg border-2 px-4 py-3 text-left text-sm transition"
              :class="isOptionSelected(q.id, option)
                ? 'border-indigo-600 bg-indigo-50 text-indigo-800 font-medium'
                : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50'"
            >
              <span class="flex items-center gap-3">
                <span
                  class="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition"
                  :class="[
                    q.multiSelect ? 'rounded' : 'rounded-full',
                    isOptionSelected(q.id, option)
                      ? 'border-indigo-600 bg-indigo-600'
                      : 'border-slate-300 bg-white'
                  ]"
                >
                  <svg v-if="isOptionSelected(q.id, option)" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {{ option }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ error }}
    </div>

    <!-- Next -->
    <div class="flex justify-center pb-8">
      <button
        @click="handleNext"
        :disabled="!allAnswered"
        class="rounded-xl px-10 py-4 text-lg font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-40"
        :class="allAnswered
          ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl'
          : 'bg-slate-400'"
      >
        Próximo: Avaliação de Maturidade
      </button>
    </div>
  </div>
</template>
