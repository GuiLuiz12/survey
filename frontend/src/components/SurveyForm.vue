<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { IRequirement, IRadarDataResponse, ICompanyProfile } from '../types'
import { getRequirements, submitSurvey } from '../services/api'

const props = defineProps<{
  companyName: string
  profile: ICompanyProfile
}>()

const emit = defineEmits<{
  submitted: [data: IRadarDataResponse, companyName: string]
  back: []
}>()

const requirements = ref<IRequirement[]>([])
const answers = ref<Record<string, number | null>>({})
const loading = ref(true)
const submitting = ref(false)
const error = ref('')
const expandedHints = ref<Set<string>>(new Set())

const scores = [0, 1, 2, 3, 4, 5]

const categoryLabels: Record<string, string> = {
  PO: 'Prepare the Organization (Preparar a Organização)',
  PS: 'Protect the Software (Proteger o Software)',
  PW: 'Produce Well-Secured Software (Produzir Software Bem Protegido)',
  RV: 'Respond to Vulnerabilities (Responder a Vulnerabilidades)',
}

const groupedRequirements = computed(() => {
  const groups: { category: string; label: string; items: IRequirement[] }[] = []
  const seen = new Set<string>()
  for (const req of requirements.value) {
    if (!seen.has(req.category)) {
      seen.add(req.category)
      groups.push({
        category: req.category,
        label: categoryLabels[req.category] || req.category,
        items: [],
      })
    }
    groups.find(g => g.category === req.category)!.items.push(req)
  }
  return groups
})

const answeredCount = computed(() => Object.keys(answers.value).length)
const totalQuestions = computed(() => requirements.value.length)
const allAnswered = computed(() => answeredCount.value === totalQuestions.value && totalQuestions.value > 0)

function toggleHint(id: string) {
  if (expandedHints.value.has(id)) {
    expandedHints.value.delete(id)
  } else {
    expandedHints.value.add(id)
  }
}

function setAnswer(id: string, value: number | null) {
  answers.value[id] = value
}

function isSelected(id: string, value: number | null): boolean {
  return id in answers.value && answers.value[id] === value
}

async function handleSubmit() {
  if (!allAnswered.value) return

  submitting.value = true
  error.value = ''

  try {
    const result = await submitSurvey({
      companyName: props.companyName,
      profile: props.profile,
      answers: answers.value,
    })
    emit('submitted', result, props.companyName)
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
    <!-- Back button -->
    <button
      type="button"
      @click="emit('back')"
      class="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Voltar ao Perfilamento
    </button>

    <!-- Introduction -->
    <div class="rounded-xl border border-indigo-100 bg-indigo-50/50 p-6 space-y-4">
      <h2 class="text-lg font-bold text-slate-800">Avaliação de Maturidade SDLC</h2>
      <p class="text-sm text-slate-600 leading-relaxed">
        Esta avaliação mede a maturidade do Ciclo de Vida de Desenvolvimento Seguro (SDLC) da empresa
        em uma escala CMMI de 0 (Inexistente) a 5 (Otimizado). Os 30 requisitos abaixo foram mapeados
        com base no framework NIST SSDF (Secure Software Development Framework) e divididos em 4 categorias:
      </p>
      <div class="grid gap-3 sm:grid-cols-2">
        <div class="rounded-lg bg-white border border-indigo-100 p-3">
          <p class="text-xs font-bold text-indigo-600 uppercase tracking-wider">PO</p>
          <p class="text-sm text-slate-600 mt-0.5">Prepare the Organization — Políticas, treinamentos, ferramentas e infraestrutura segura.</p>
        </div>
        <div class="rounded-lg bg-white border border-indigo-100 p-3">
          <p class="text-xs font-bold text-indigo-600 uppercase tracking-wider">PS</p>
          <p class="text-sm text-slate-600 mt-0.5">Protect the Software — Integridade do código, SBOM, deployments e rollback.</p>
        </div>
        <div class="rounded-lg bg-white border border-indigo-100 p-3">
          <p class="text-xs font-bold text-indigo-600 uppercase tracking-wider">PW</p>
          <p class="text-sm text-slate-600 mt-0.5">Produce Well-Secured Software — Threat modeling, SAST, DAST, code review e hardening.</p>
        </div>
        <div class="rounded-lg bg-white border border-indigo-100 p-3">
          <p class="text-xs font-bold text-indigo-600 uppercase tracking-wider">RV</p>
          <p class="text-sm text-slate-600 mt-0.5">Respond to Vulnerabilities — VDP, SLAs de patch, notificação e análise post-mortem.</p>
        </div>
      </div>
      <p class="text-sm text-slate-600 leading-relaxed">
        Para cada requisito, atribua uma nota de <strong>0 a 5</strong> ou marque <strong>N/A</strong> caso não se aplique.
        O envio só será habilitado após todos os 30 requisitos serem respondidos.
      </p>
    </div>

    <!-- Progress -->
    <div class="sticky top-0 z-10 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur-sm">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-slate-600">Progresso</span>
        <span class="text-sm font-semibold text-indigo-600">{{ answeredCount }} / {{ totalQuestions }}</span>
      </div>
      <div class="h-2 w-full rounded-full bg-slate-100">
        <div
          class="h-2 rounded-full bg-indigo-600 transition-all duration-300"
          :style="{ width: totalQuestions > 0 ? `${(answeredCount / totalQuestions) * 100}%` : '0%' }"
        ></div>
      </div>
    </div>

    <!-- Questions grouped by category -->
    <div v-for="group in groupedRequirements" :key="group.category" class="space-y-6">
      <!-- Category header -->
      <div class="flex items-center gap-3 pt-4">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
          {{ group.category }}
        </span>
        <h3 class="text-base font-bold text-slate-800">{{ group.label }}</h3>
      </div>

      <div
        v-for="req in group.items"
        :key="req.id"
        class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
      >
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
            Exemplo de Evidência
          </button>
          <div
            v-if="expandedHints.has(req.id)"
            class="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800"
          >
            {{ req.expectedEvidence }}
          </div>

          <!-- Score Selection -->
          <div class="flex flex-wrap items-center gap-2">
            <button
              v-for="score in scores"
              :key="score"
              type="button"
              @click="setAnswer(req.id, score)"
              class="flex h-10 w-10 items-center justify-center rounded-lg border-2 text-sm font-semibold transition"
              :class="isSelected(req.id, score)
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50'"
            >
              {{ score }}
            </button>
            <button
              type="button"
              @click="setAnswer(req.id, null)"
              class="flex h-10 items-center justify-center rounded-lg border-2 px-3 text-sm font-semibold transition"
              :class="isSelected(req.id, null)
                ? 'border-slate-500 bg-slate-500 text-white'
                : 'border-slate-200 bg-white text-slate-400 hover:border-slate-400 hover:bg-slate-50'"
            >
              N/A
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
          Enviando...
        </span>
        <span v-else>Enviar Avaliação</span>
      </button>
    </div>
  </form>
</template>
