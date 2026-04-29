import { IRequirement, IProfilingQuestion } from './interfaces';

export const requirementMapping: Record<string, string> = {
  "REQ-01": "PO", "REQ-02": "PO", "REQ-03": "PO", "REQ-04": "PO", "REQ-05": "PO",
  "REQ-06": "PO", "REQ-07": "PO", "REQ-08": "PO", "REQ-09": "PO", "REQ-10": "PO",
  "REQ-11": "PS", "REQ-12": "PS", "REQ-13": "PS", "REQ-14": "PS", "REQ-15": "PS",
  "REQ-16": "PW", "REQ-17": "PW", "REQ-18": "PW", "REQ-19": "PW", "REQ-20": "PW",
  "REQ-21": "PW", "REQ-22": "PW", "REQ-23": "PW", "REQ-24": "PW", "REQ-25": "PW",
  "REQ-26": "RV", "REQ-27": "RV", "REQ-28": "RV", "REQ-29": "RV", "REQ-30": "RV"
};

export const requirementsList: IRequirement[] = [
  { id: "REQ-01", category: "PO", question: "A organização possui processos definidos para documentar e atualizar os requisitos internos de segurança da infraestrutura e do código?", expectedEvidence: "Políticas de segurança documentadas e atualizadas, ou matriz de requisitos de segurança (ex: no Confluence/Wiki interno)." },
  { id: "REQ-02", category: "PO", question: "A plataforma entregue ao cliente permite que o administrador defina e trave regras globais de configuração segura (baselines) para o espaço dele?", expectedEvidence: "Demonstração no painel do SaaS de políticas globais configuráveis pelo administrador do tenant." },
  { id: "REQ-03", category: "PO", question: "A empresa tem um processo estabelecido para exigir e verificar que fornecedores terceiros cumpram requisitos de segurança?", expectedEvidence: "Cláusulas de segurança em contratos de fornecedores ou uso de ferramentas de análise de risco de terceiros (SCA)." },
  { id: "REQ-04", category: "PO", question: "A organização possui papéis de segurança formalmente definidos no time e fornece treinamento contínuo em código seguro?", expectedEvidence: "Matriz RACI do time de desenvolvimento e registros de conclusão de treinamentos de segurança (AppSec)." },
  { id: "REQ-05", category: "PO", question: "A empresa possui controles estabelecidos e padronizados para garantir a segurança das ferramentas de CI/CD contra comprometimentos?", expectedEvidence: "Configurações de segurança ativas na plataforma de CI/CD (ex: restrição de plugins, runners isolados)." },
  { id: "REQ-06", category: "PO", question: "As ferramentas de desenvolvimento geram logs imutáveis e automatizam a checagem de critérios de segurança (ex: Quality Gates) antes de cada release?", expectedEvidence: "Regras de Quality Gate configuradas no pipeline (ex: SonarQube bloqueando builds) e logs de auditoria do pipeline." },
  { id: "REQ-07", category: "PO", question: "O produto final possui mecanismos robustos para exportar logs de auditoria detalhados e imutáveis para os clientes?", expectedEvidence: "Tela do SaaS ou documentação técnica de API/Webhook mostrando a exportação de logs de auditoria do cliente." },
  { id: "REQ-08", category: "PO", question: "A infraestrutura possui separação clara de ambientes e exige controles estritos (MFA/Zero Trust) para o acesso dos engenheiros?", expectedEvidence: "Configurações de rede (VPCs, Security Groups) e painel de IAM interno (ex: AWS IAM) mostrando MFA obrigatório para engenheiros." },
  { id: "REQ-09", category: "PO", question: "A plataforma SaaS permite que o cliente integre seu próprio SSO corporativo e obrigue (force) o uso de MFA para todos os usuários do seu ambiente?", expectedEvidence: "Tela de administração do SaaS mostrando configurações ativas de SSO (SAML/OIDC) e políticas de MFA forçado." },
  { id: "REQ-10", category: "PO", question: "A empresa tem um processo de melhoria contínua implementado para aplicar lições aprendidas após incidentes ou novas ameaças?", expectedEvidence: "Documentação de análises post-mortem ou roadmaps de segurança comprovando a adoção de novas práticas/ferramentas." },
  { id: "REQ-11", category: "PS", question: "O repositório de código possui proteções ativas e configuradas contra adulterações internas e externas, com verificação de assinatura de commits e controle de acesso rigoroso?", expectedEvidence: "Configurações do repositório (ex: GitHub/GitLab) mostrando regras de proteção de branch, RBAC e exigência de commit signing." },
  { id: "REQ-12", category: "PS", question: "Para cada nova versão da plataforma, vocês geram hashes criptográficos e um SBOM (Software Bill of Materials) atualizado e acessível?", expectedEvidence: "Demonstração do artefato SBOM (ex: formato SPDX/CycloneDX) gerado no último release e do mecanismo de assinatura/hash do artefato." },
  { id: "REQ-13", category: "PS", question: "A plataforma permite que o cliente exporte seus dados facilmente e oferece transparência técnica (como o SBOM) sobre as integrações e bibliotecas que processam esses dados?", expectedEvidence: "Tela do SaaS ou portal de documentação mostrando a capacidade de exportação de dados do cliente e o portal de transparência/segurança." },
  { id: "REQ-14", category: "PS", question: "O processo de deploy possui etapas graduais (staged roll-out) e mecanismos testados de reversão automática (rollback) caso a atualização falhe?", expectedEvidence: "Demonstração do pipeline de CD (Continuous Deployment) evidenciando as etapas parciais de deploy e scripts/testes de reversão (rollback)." },
  { id: "REQ-15", category: "PS", question: "Se um administrador do cliente fizer uma alteração drástica nas configurações de segurança do tenant por engano, o SaaS tem um mecanismo de 'rollback' para a configuração anterior?", expectedEvidence: "Demonstração de interface de histórico de alterações de configuração no painel do SaaS com a opção de reversão/restauração." },
  { id: "REQ-16", category: "PW", question: "Antes de iniciar a codificação de uma nova API ou módulo, a equipe realiza modelagem de ameaças (Threat Modeling) e documenta os riscos identificados?", expectedEvidence: "Documento de arquitetura (ou ticket no Jira/Azure DevOps) contendo diagramas de Threat Model (ex: via STRIDE) e matriz de mitigação." },
  { id: "REQ-17", category: "PW", question: "No código da plataforma, vocês utilizam serviços padronizados de mercado para gerenciar logins e logs, e aplicam o privilégio mínimo na arquitetura para não rodar serviços como 'admin'?", expectedEvidence: "Documentação de arquitetura e trechos de código mostrando uso de bibliotecas de identidade estabelecidas (Auth0, Okta, etc) e isolamento de privilégios." },
  { id: "REQ-18", category: "PW", question: "Existe um processo formal onde alguém de segurança ou um Arquiteto (que não participou do desenho inicial) revisa e aprova o design antes do desenvolvimento?", expectedEvidence: "Aprovações (logs) em tickets de arquitetura por revisores designados ou atas de um comitê de arquitetura." },
  { id: "REQ-19", category: "PW", question: "A empresa monitora continuamente as bibliotecas de terceiros (open-source) em busca de vulnerabilidades (CVEs), abandono de projeto ou mudanças suspeitas de donos?", expectedEvidence: "Demonstração de uma ferramenta de Análise de Composição de Software (SCA) (ex: Snyk, Dependabot) rodando no pipeline e gerando alertas de dependência." },
  { id: "REQ-20", category: "PW", question: "A empresa possui práticas de codificação segura (Secure Coding) implementadas no dia a dia? Utilizam-se 'linters' de segurança ou validações obrigatórias de input nas IDEs?", expectedEvidence: "Documento de diretrizes de desenvolvimento seguro interno E tela de configuração do repositório/pipeline com linters de segurança ativos (SAST leve)." },
  { id: "REQ-21", category: "PW", question: "As ferramentas de build e compiladores possuem configurações de segurança endurecidas ativadas (ex: bloqueio por alertas/warnings) para evitar vulnerabilidades? Existe a política de 'clean build' onde avisos de segurança bloqueiam a compilação?", expectedEvidence: "Configurações de compilador/pipeline mostrando flags de segurança ativas (ex: ASLR, DEP) e bloqueio por warnings." },
  { id: "REQ-22", category: "PW", question: "Todo código passa por revisão de pares (Peer Review) obrigatória e por análise estática de segurança (SAST) antes de ir para produção?", expectedEvidence: "Regras do repositório exigindo aprovação de terceiros para Merge/Pull Requests e logs da ferramenta SAST (ex: SonarQube, Checkmarx) rodando no pipeline." },
  { id: "REQ-23", category: "PW", question: "A plataforma passa por testes dinâmicos de vulnerabilidade (DAST) em execução ou testes de intrusão (Pentest) periódicos simulando ataques reais?", expectedEvidence: "Relatórios de Pentest recentes ou painel da ferramenta DAST rodando contra o ambiente de homologação/teste." },
  { id: "REQ-24", category: "PW", question: "O software é entregue com configurações seguras por padrão na instalação? Vocês garantem tecnicamente que não existem senhas padrão ou segredos fixos no código?", expectedEvidence: "Demonstração do primeiro acesso (onboarding) exigindo criação de senha forte e verificação de Secret Scanning no pipeline." },
  { id: "REQ-25", category: "PW", question: "O SaaS fornece aos administradores do cliente painéis ou alertas automáticos caso eles desativem uma configuração de segurança crítica (Configuration Drift)?", expectedEvidence: "Demonstração do painel de segurança (Security Posture) do SaaS mostrando alertas de configurações enfraquecidas." },
  { id: "REQ-26", category: "RV", question: "A empresa possui um canal oficial (VDP) para pesquisadores reportarem falhas e um time (PSIRT) formalmente designado para tratar incidentes de segurança no produto?", expectedEvidence: "Página pública de segurança/VDP no site da empresa e processo documentado de triagem de incidentes (Playbooks)." },
  { id: "REQ-27", category: "RV", question: "Quando uma falha crítica é confirmada, existe um SLA formal para priorização e entrega do patch? Vocês publicam mitigações temporárias (workarounds) para os clientes?", expectedEvidence: "SLA documentado para correção de vulnerabilidades (ex: 48h para Críticas) e avisos de segurança/boletins enviados aos clientes." },
  { id: "REQ-28", category: "RV", question: "A operação SaaS possui automação e SLAs rigorosos para notificar o cliente caso o ambiente dele seja afetado por uma violação?", expectedEvidence: "SLAs de notificação em contrato (ex: notificação em até 24h) e interface de configuração de contatos de emergência no SaaS." },
  { id: "REQ-29", category: "RV", question: "Caso o cliente enfrente um processo judicial ou auditoria forense, o SaaS possui função de Retenção Legal (Legal Hold) para congelar dados e permite a extração de evidências forenses isoladas?", expectedEvidence: "Demonstração no painel de administração da função de Legal Hold ou documentação de extração de evidências via suporte/API." },
  { id: "REQ-30", category: "RV", question: "Após corrigir um incidente, a equipe faz uma análise de causa raiz (Post-mortem) para buscar e erradicar falhas semelhantes em todo o resto do código?", expectedEvidence: "Documento de Análise de Causa Raiz (RCA) de incidentes passados mostrando tarefas criadas para alterar o SDLC ou limpar bibliotecas semelhantes." }
];

export const profilingQuestions: IProfilingQuestion[] = [
  {
    id: "PROFILE-01",
    question: "Qual o tamanho total da empresa (número de funcionários)?",
    options: [
      "1 a 10 funcionários (Micro)",
      "11 a 50 funcionários (Pequena)",
      "51 a 200 funcionários (Média)",
      "Mais de 200 funcionários (Grande)"
    ],
    multiSelect: false
  },
  {
    id: "PROFILE-02",
    question: "Qual o segmento principal de atuação do negócio?",
    options: [
      "Financeiro / Fintech (Alta regulação - Bacen/CVM)",
      "Saúde / Healthtech (Alta regulação - Dados sensíveis)",
      "E-commerce / Varejo / Serviços B2C (Forte exposição à LGPD)",
      "Tecnologia / SaaS B2B (Sistemas de gestão, ERP, CRM)",
      "Outro"
    ],
    multiSelect: false
  },
  {
    id: "PROFILE-03",
    question: "Qual o modelo principal de entrega do software?",
    options: [
      "SaaS na Nuvem (Multi-tenant: vários clientes dividem a mesma infraestrutura/banco de dados)",
      "SaaS na Nuvem (Single-tenant: cada cliente possui sua própria instância isolada)",
      "On-premise (Instalado e operado diretamente nos servidores físicos/locais do cliente)",
      "Misto (Combinação de modelos SaaS e instâncias instaladas localmente)",
      "Outro (Ex: Fornecimento de SDKs, bibliotecas de código ou APIs para integração)"
    ],
    multiSelect: false
  },
  {
    id: "PROFILE-04",
    question: "Em quais regiões a empresa possui atuação ou processa dados de clientes? (Selecione todas as aplicáveis)",
    options: [
      "Brasil (Sujeito à LGPD)",
      "Restante da América Latina",
      "América do Norte - EUA e Canadá (Sujeito a leis federais/estaduais americanas)",
      "Europa (Sujeito à GDPR)",
      "Ásia-Pacífico (APAC) ou outras regiões"
    ],
    multiSelect: true
  },
  {
    id: "PROFILE-05",
    question: "Qual o histórico recente de testes de segurança da empresa?",
    options: [
      "Nunca realizou um teste de intrusão (Pentest) ou auditoria formal.",
      "Já realizou no passado, mas há mais de 12 meses.",
      "Realizou testes ou auditorias formais nos últimos 12 meses.",
      "Realiza testes de forma contínua ou possui certificações ativas (ex: ISO 27001, SOC 2)."
    ],
    multiSelect: false
  },
  {
    id: "PROFILE-06",
    question: "Qual o seu cargo na empresa avaliada?",
    options: [
      "Analista/Técnico",
      "Gerente/Coordenador",
      "Diretor/Superintendente",
      "Consultor/Especialista"
    ],
    multiSelect: false
  }
];
