export type CRMStatus = 'NOVO' | 'CONTATADO' | 'REUNIAO' | 'PROPOSTA' | 'CLIENTE' | 'IGNORADO';

export type ProcessStatus = 
  | 'EM_PROCESSO'          // Em registro na Junta Comercial / REGIN
  | 'CNPJ_EMITIDO'         // CNPJ Ativo recém-emitido (últimos 30 dias)
  | 'ALVARA_PENDENTE';     // Alvará em fase de liberação municipal

export type CompanyPorte = 'MEI' | 'ME' | 'EPP' | 'Demais';

export interface CompanyLead {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  uf: string; // Ex: 'RS'
  municipio: string; // Ex: 'Caxias do Sul'
  bairro: string;
  logradouro: string;
  numero: string;
  cep: string;
  dataAbertura: string; // YYYY-MM-DD
  statusAbertura: ProcessStatus;
  cnaeCodigo: string;
  cnaeDescricao: string;
  setor: 'Comércio' | 'Serviços' | 'Indústria' | 'Tecnologia' | 'Alimentação' | 'Construção' | 'Saúde' | 'Outros';
  capitalSocial: number; // Em R$
  porte: CompanyPorte;
  socioAdministrador: {
    nome: string;
    qualificacao: string;
    telefone?: string;
    email?: string;
  };
  scoreLead: number; // 0-100 (Oportunidade B2B)
  pipelineStatus: CRMStatus;
  notas?: string;
  contatadoEm?: string;
  oportunidadesDetectadas: string[]; // ex: ["Precisa de Alvará Municipal", "Precisa de Website e Redes", "Contabilidade para Simples"]
}

export interface StateUF {
  uf: string;
  nome: string;
  regiao: string;
}

export interface CityInfo {
  nome: string;
  uf: string;
  populacaoAproximada?: number;
  destaque?: boolean; // ex: Caxias do Sul - RS
  empresasAbertasMesAtual: number;
  processosAndamento: number;
}

export interface UserProfileService {
  userName: string;
  companyName: string;
  serviceType: string; // e.g., 'Contabilidade & Planejamento Tributário', 'Criação de Sites & Marketing Digital', 'Sistemas de TI e Redes', etc.
  differentials: string;
  phoneWhatsApp: string;
  groqApiKey?: string;
}

export interface FilterState {
  uf: string;
  municipio: string;
  searchQuery: string;
  statusAbertura: string; // 'TODOS' | ProcessStatus
  setor: string; // 'TODOS' | Setor
  porte: string; // 'TODOS' | CompanyPorte
  pipelineStatus: string; // 'TODOS' | CRMStatus
  periodoDias: number; // 1, 7, 15, 30, 90
  minCapitalSocial: number;
}

export interface PitchResult {
  subject?: string;
  pitch: string;
  openingHooks: string[];
  keyBenefitsToHighlight: string[];
  followUpTip: string;
}

export interface MarketStats {
  totalNovasEmpresas: number;
  totalEmProcesso: number;
  capitalSocialMedio: number;
  topSectores: { setor: string; cantidad: number }[];
  topBairros: { bairro: string; cantidad: number }[];
  historicoMensal: { mes: string; aberturas: number }[];
}
