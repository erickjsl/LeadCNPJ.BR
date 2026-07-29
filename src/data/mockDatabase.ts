import { CompanyLead, UserProfileService, ProcessStatus, CompanyPorte } from '../types';

const LOCAL_STORAGE_KEY_LEADS = 'leadcnpj_leads_v1';
const LOCAL_STORAGE_KEY_PROFILE = 'leadcnpj_user_profile_v1';

export const INITIAL_USER_PROFILE: UserProfileService = {
  userName: 'Seu Nome / Atendimento',
  companyName: 'Minha Empresa de Serviços',
  serviceType: 'Contabilidade & Alvarás de Funcionamento',
  differentials: 'Atendimento prioritário em Caxias do Sul e região, abertura ágil de inscrições estaduais e emissão de alvará municipal sem burocracia.',
  phoneWhatsApp: '54999887766'
};

const CAXIAS_DO_SUL_BAIRROS = [
  'Centro',
  'Lurdes',
  'Sanvitto',
  'Villagio Iguatemi',
  'Panazzolo',
  'Pio X',
  'Desvio Rizzo',
  'Forqueta',
  'Ana Rech',
  'Interlagos',
  'Exposição',
  'São Pelegrino',
  'Cinquentenário',
  'Kayser'
];

const SECTORS_CNAES = [
  {
    setor: 'Serviços' as const,
    cnae: '6920-6/01',
    desc: 'Atividades de contabilidade e consultoria fiscal',
    opps: ['Software de Gestão Financeira', 'Certificado Digital', 'Marketing de Prospecção']
  },
  {
    setor: 'Serviços' as const,
    cnae: '8630-5/03',
    desc: 'Atividade médica ambulatorial restrita a consultas',
    opps: ['Alvará Sanitário Vigilância', 'Software de Prontuário', 'Contabilidade Médica Especializada']
  },
  {
    setor: 'Alimentação' as const,
    cnae: '5611-2/01',
    desc: 'Restaurantes e similares - Gastronomia',
    opps: ['Alvará de Bombeiros (PPCI)', 'Licença Sanitária', 'Sistema de PDV e Caixa', 'Identidade Visual']
  },
  {
    setor: 'Comércio' as const,
    cnae: '4781-4/00',
    desc: 'Comércio varejista de artigos do vestuário e acessórios',
    opps: ['Inscrição Estadual (TEF)', 'Site E-commerce', 'Decoração/Móveis de Loja', 'Controle de Estoque']
  },
  {
    setor: 'Tecnologia' as const,
    cnae: '6201-5/01',
    desc: 'Desenvolvimento de programas de computador sob encomenda',
    opps: ['Assessoria Jurídica de Contratos', 'Suporte Contábil Simples Nacional', 'Consultoria de Nuvem']
  },
  {
    setor: 'Indústria' as const,
    cnae: '2539-0/01',
    desc: 'Serviços de usinagem, solda e caldeiraria mecânica',
    opps: ['Licenciamento Ambiental (FEPAM)', 'Segurança do Trabalho (PPRA/LTCAT)', 'Gestão Tributária Industrial']
  },
  {
    setor: 'Construção' as const,
    cnae: '4120-4/00',
    desc: 'Construção de edifícios e obras residenciais',
    opps: ['Matrícula CEI/CNO INSS', 'Seguro de Engenharia', 'Contabilidade de SPE/RETI']
  },
  {
    setor: 'Saúde' as const,
    cnae: '8650-0/04',
    desc: 'Atividades de fisioterapia e estética corporal',
    opps: ['Alvará Sanitário', 'Móveis & Macas Profissionais', 'Sistema de Agendamento Online']
  }
];

// Helper to format date relative to today (YYYY-MM-DD)
function getDateDaysAgo(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export const SEED_LEADS_CAXIAS: CompanyLead[] = [
  {
    id: 'caxias-001',
    cnpj: '58.492.102/0001-88',
    razaoSocial: 'Serra Gaúcha Soluções Industriais Ltda',
    nomeFantasia: 'SerraTech Usinagem',
    uf: 'RS',
    municipio: 'Caxias do Sul',
    bairro: 'Sanvitto',
    logradouro: 'Rua Jacob Luchesi',
    numero: '1240',
    cep: '95032-000',
    dataAbertura: getDateDaysAgo(1),
    statusAbertura: 'EM_PROCESSO',
    cnaeCodigo: '2539-0/01',
    cnaeDescricao: 'Serviços de usinagem, solda e caldeiraria mecânica',
    setor: 'Indústria',
    capitalSocial: 150000,
    porte: 'EPP',
    socioAdministrador: {
      nome: 'Marcelo Roberto Rossi',
      qualificacao: 'Sócio-Administrador',
      telefone: '54991823344',
      email: 'contato@serratechusinagem.com.br'
    },
    scoreLead: 95,
    pipelineStatus: 'NOVO',
    notas: 'Empresa em protocolo de abertura na JUCERS. Precisa de licenciamento ambiental e planejamento contábil.',
    oportunidadesDetectadas: [
      'PPCI / Licença de Bombeiros Caxias do Sul',
      'Contabilidade para Lucro Presumido/Simples',
      'Plano de Segurança do Trabalho (eSocial)'
    ]
  },
  {
    id: 'caxias-002',
    cnpj: '58.481.009/0001-42',
    razaoSocial: 'Lurdes Café e Bistro Eireli',
    nomeFantasia: 'Bistrô da Lurdes',
    uf: 'RS',
    municipio: 'Caxias do Sul',
    bairro: 'Lurdes',
    logradouro: 'Avenida Júlio de Castilhos',
    numero: '850',
    cep: '95010-001',
    dataAbertura: getDateDaysAgo(2),
    statusAbertura: 'ALVARA_PENDENTE',
    cnaeCodigo: '5611-2/01',
    cnaeDescricao: 'Restaurantes e similares - Gastronomia',
    setor: 'Alimentação',
    capitalSocial: 80000,
    porte: 'ME',
    socioAdministrador: {
      nome: 'Juliana Zanotto',
      qualificacao: 'Titular EIRELI',
      telefone: '54996451234',
      email: 'juliana.zanotto@bistro.com.br'
    },
    scoreLead: 92,
    pipelineStatus: 'NOVO',
    notas: 'Ponto comercial em reforma no Bairro Lurdes. Alvará de saúde pendente na Prefeitura de Caxias.',
    oportunidadesDetectadas: [
      'Alvará Sanitário de Caxias do Sul',
      'Sistema de Faturamento PDV / Cupom Fiscal',
      'Criação de Cardápio Digital e Redes Sociais'
    ]
  },
  {
    id: 'caxias-003',
    cnpj: '58.460.880/0001-15',
    razaoSocial: 'Caxias Cloud & Telecomunicações Ltda',
    nomeFantasia: 'CaxiasCloud IT',
    uf: 'RS',
    municipio: 'Caxias do Sul',
    bairro: 'Centro',
    logradouro: 'Rua Sinimbu',
    numero: '2010',
    cep: '95020-002',
    dataAbertura: getDateDaysAgo(3),
    statusAbertura: 'CNPJ_EMITIDO',
    cnaeCodigo: '6201-5/01',
    cnaeDescricao: 'Desenvolvimento de programas de computador sob encomenda',
    setor: 'Tecnologia',
    capitalSocial: 50000,
    porte: 'ME',
    socioAdministrador: {
      nome: 'Lucas Gabriel Finkler',
      qualificacao: 'Sócio-Administrador',
      telefone: '54984112233',
      email: 'lucas@caxiascloud.com.br'
    },
    scoreLead: 88,
    pipelineStatus: 'CONTATADO',
    contatadoEm: getDateDaysAgo(1),
    notas: 'Primeira abordagem feita por WhatsApp. Demonstrou interesse em assessoria tributária para exportação de software.',
    oportunidadesDetectadas: [
      'Isenção de ISS/PIS/COFINS em Exportação de Software',
      'Contratos de Prestação de Serviços de TI',
      'Plano de Saúde Empresarial para Equipe'
    ]
  },
  {
    id: 'caxias-004',
    cnpj: '58.433.910/0001-90',
    razaoSocial: 'VitiSerra Comércio de Bebidas e Vinhos Ltda',
    nomeFantasia: 'Adega VitiSerra',
    uf: 'RS',
    municipio: 'Caxias do Sul',
    bairro: 'Forqueta',
    logradouro: 'Rua Luiz Michielon',
    numero: '450',
    cep: '95034-000',
    dataAbertura: getDateDaysAgo(5),
    statusAbertura: 'CNPJ_EMITIDO',
    cnaeCodigo: '4781-4/00',
    cnaeDescricao: 'Comércio varejista de bebidas e vinhos finos',
    setor: 'Comércio',
    capitalSocial: 120000,
    porte: 'EPP',
    socioAdministrador: {
      nome: 'Eduardo Antonio Varaschin',
      qualificacao: 'Sócio',
      telefone: '54992334455',
      email: 'vendas@vitiserra.com.br'
    },
    scoreLead: 85,
    pipelineStatus: 'NOVO',
    oportunidadesDetectadas: [
      'Inscrição Estadual com Substituição Tributária (ST)',
      'Plataforma E-commerce integrada com ERP',
      'Certificado Digital e-CNPJ A1'
    ]
  },
  {
    id: 'caxias-005',
    cnpj: '58.411.002/0001-30',
    razaoSocial: 'Clínica Integrada Villagio Saúde Ltda',
    nomeFantasia: 'Villagio Health Center',
    uf: 'RS',
    municipio: 'Caxias do Sul',
    bairro: 'Villagio Iguatemi',
    logradouro: 'Rua Guerino Sanvitto',
    numero: '780',
    cep: '95013-000',
    dataAbertura: getDateDaysAgo(6),
    statusAbertura: 'EM_PROCESSO',
    cnaeCodigo: '8630-5/03',
    cnaeDescricao: 'Atividade médica ambulatorial restrita a consultas',
    setor: 'Saúde',
    capitalSocial: 200000,
    porte: 'Demais',
    socioAdministrador: {
      nome: 'Dra. Patricia Basso',
      qualificacao: 'Sócio-Gerente',
      telefone: '54998776655',
      email: 'patricia@villagiohealth.com.br'
    },
    scoreLead: 96,
    pipelineStatus: 'REUNIAO',
    notas: 'Reunião agendada para quinta-feira sobre fator R do Simples Nacional.',
    oportunidadesDetectadas: [
      'Planejamento Tributário Fator R (Redução de Imposto)',
      'Alvará de Vigilância Sanitária Municipal',
      'Seguro de Responsabilidade Civil Médica'
    ]
  },
  {
    id: 'caxias-006',
    cnpj: '58.390.111/0001-77',
    razaoSocial: 'Pio X Engenharia e Construtora Ltda',
    nomeFantasia: 'Pio X Construções',
    uf: 'RS',
    municipio: 'Caxias do Sul',
    bairro: 'Pio X',
    logradouro: 'Rua Feijó Júnior',
    numero: '920',
    cep: '95034-100',
    dataAbertura: getDateDaysAgo(8),
    statusAbertura: 'CNPJ_EMITIDO',
    cnaeCodigo: '4120-4/00',
    cnaeDescricao: 'Construção de edifícios e obras residenciais',
    setor: 'Construção',
    capitalSocial: 300000,
    porte: 'Demais',
    socioAdministrador: {
      nome: 'Eng. Fernando Scola',
      qualificacao: 'Sócio-Administrador',
      telefone: '54981223344',
      email: 'fernando@pioxconstrutora.com.br'
    },
    scoreLead: 90,
    pipelineStatus: 'PROPOSTA',
    notas: 'Enviada proposta para gerenciamento de matriculas CNO e contabilidade de obra.',
    oportunidadesDetectadas: [
      'Abertura de Cadastro CNO / Receita Federal',
      'Planejamento RET (Regime Especial de Tributação 4%)',
      'Licenciamento Ambiental de Obras'
    ]
  }
];

// Helper to auto-generate realistic leads for ANY given city in Brazil
export function generateLeadsForCity(uf: string, municipio: string): CompanyLead[] {
  if (uf === 'RS' && municipio === 'Caxias do Sul') {
    return SEED_LEADS_CAXIAS;
  }

  const result: CompanyLead[] = [];
  const bairros = ['Centro', 'Jardim América', 'Bairro Novo', 'Vila Nova', 'Industrial', 'São José', 'Planalto', 'Comercial'];
  const statusList: ProcessStatus[] = ['EM_PROCESSO', 'CNPJ_EMITIDO', 'ALVARA_PENDENTE'];
  const portes: CompanyPorte[] = ['MEI', 'ME', 'EPP', 'Demais'];

  for (let i = 1; i <= 10; i++) {
    const sec = SECTORS_CNAES[i % SECTORS_CNAES.length];
    const status = statusList[i % statusList.length];
    const porte = portes[i % portes.length];
    const daysAgo = (i % 12) + 1;
    const capital = (i * 25000) + 10000;
    const cnpjNum = `${Math.floor(10 + Math.random() * 89)}.${Math.floor(100 + Math.random() * 899)}.${Math.floor(100 + Math.random() * 899)}/0001-${Math.floor(10 + Math.random() * 89)}`;

    const id = `${uf.toLowerCase()}-${municipio.toLowerCase().replace(/\s+/g, '')}-${i}`;
    const nameBase = `${municipio} ${sec.setor} ${i}`;

    result.push({
      id,
      cnpj: cnpjNum,
      razaoSocial: `${nameBase} Ltda`,
      nomeFantasia: `${municipio} ${sec.setor}`,
      uf,
      municipio,
      bairro: bairros[i % bairros.length],
      logradouro: `Avenida Principal`,
      numero: `${100 * i}`,
      cep: '00000-000',
      dataAbertura: getDateDaysAgo(daysAgo),
      statusAbertura: status,
      cnaeCodigo: sec.cnae,
      cnaeDescricao: sec.desc,
      setor: sec.setor,
      capitalSocial: capital,
      porte: porte,
      socioAdministrador: {
        nome: `Sócio ${i} - ${municipio}`,
        qualificacao: 'Sócio-Administrador',
        telefone: '55999001122',
        email: `contato@empresa${i}.${uf.toLowerCase()}.com.br`
      },
      scoreLead: 80 + (i % 18),
      pipelineStatus: i === 1 ? 'CONTATADO' : 'NOVO',
      notas: `Empresa recém-identificada nos registros de abertura de ${municipio} - ${uf}.`,
      oportunidadesDetectadas: sec.opps
    });
  }

  return result;
}

// LocalStorage Persistence Handlers
export function getStoredLeads(uf: string, municipio: string): CompanyLead[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_LEADS);
    if (!raw) {
      const initial = generateLeadsForCity(uf, municipio);
      localStorage.setItem(LOCAL_STORAGE_KEY_LEADS, JSON.stringify(initial));
      return initial;
    }
    const parsed: CompanyLead[] = JSON.parse(raw);
    const cityLeads = parsed.filter(l => l.uf === uf && l.municipio.toLowerCase() === municipio.toLowerCase());
    if (cityLeads.length === 0) {
      const generated = generateLeadsForCity(uf, municipio);
      const combined = [...parsed, ...generated];
      localStorage.setItem(LOCAL_STORAGE_KEY_LEADS, JSON.stringify(combined));
      return generated;
    }
    return cityLeads;
  } catch (e) {
    console.error('Erro ao ler leads do localStorage:', e);
    return generateLeadsForCity(uf, municipio);
  }
}

export function saveStoredLeads(leads: CompanyLead[]) {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_LEADS);
    let currentAll: CompanyLead[] = raw ? JSON.parse(raw) : [];
    
    // Map existing IDs to replace with updated items
    const leadsMap = new Map(leads.map(l => [l.id, l]));
    currentAll = currentAll.map(l => leadsMap.get(l.id) || l);
    
    // Append any new leads that weren't in currentAll
    const existingIds = new Set(currentAll.map(l => l.id));
    for (const lead of leads) {
      if (!existingIds.has(lead.id)) {
        currentAll.push(lead);
      }
    }

    localStorage.setItem(LOCAL_STORAGE_KEY_LEADS, JSON.stringify(currentAll));
  } catch (e) {
    console.error('Erro ao salvar leads:', e);
  }
}

export function updateLeadStatusInStorage(leadId: string, status: CompanyLead['pipelineStatus'], notes?: string): void {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_LEADS);
    let all: CompanyLead[] = raw ? JSON.parse(raw) : [];
    all = all.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          pipelineStatus: status,
          contatadoEm: status !== 'NOVO' ? new Date().toISOString() : l.contatadoEm,
          notas: notes !== undefined ? notes : l.notas
        };
      }
      return l;
    });
    localStorage.setItem(LOCAL_STORAGE_KEY_LEADS, JSON.stringify(all));
  } catch (e) {
    console.error('Erro ao atualizar status do lead:', e);
  }
}

export function getStoredProfile(): UserProfileService {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
    if (!raw) return INITIAL_USER_PROFILE;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_USER_PROFILE;
  }
}

export function saveStoredProfile(profile: UserProfileService): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Erro ao salvar perfil:', e);
  }
}
