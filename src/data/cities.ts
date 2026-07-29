import { CityInfo, StateUF } from '../types';

export const ESTADOS_BRASIL: StateUF[] = [
  { uf: 'RS', nome: 'Rio Grande do Sul', regiao: 'Sul' },
  { uf: 'SP', nome: 'São Paulo', regiao: 'Sudeste' },
  { uf: 'SC', nome: 'Santa Catarina', regiao: 'Sul' },
  { uf: 'PR', nome: 'Paraná', regiao: 'Sul' },
  { uf: 'RJ', nome: 'Rio de Janeiro', regiao: 'Sudeste' },
  { uf: 'MG', nome: 'Minas Gerais', regiao: 'Sudeste' },
  { uf: 'BA', nome: 'Bahia', regiao: 'Nordeste' },
  { uf: 'GO', nome: 'Goiás', regiao: 'Centro-Oeste' },
  { uf: 'PE', nome: 'Pernambuco', regiao: 'Nordeste' },
  { uf: 'CE', nome: 'Ceará', regiao: 'Nordeste' },
  { uf: 'DF', nome: 'Distrito Federal', regiao: 'Centro-Oeste' },
  { uf: 'ES', nome: 'Espírito Santo', regiao: 'Sudeste' },
  { uf: 'MS', nome: 'Mato Grosso do Sul', regiao: 'Centro-Oeste' },
  { uf: 'MT', nome: 'Mato Grosso', regiao: 'Centro-Oeste' },
  { uf: 'AM', nome: 'Amazonas', regiao: 'Norte' },
  { uf: 'PA', nome: 'Pará', regiao: 'Norte' },
  { uf: 'MA', nome: 'Maranhão', regiao: 'Nordeste' },
  { uf: 'PB', nome: 'Paraíba', regiao: 'Nordeste' },
  { uf: 'RN', nome: 'Rio Grande do Norte', regiao: 'Nordeste' },
  { uf: 'AL', nome: 'Alagoas', regiao: 'Nordeste' },
  { uf: 'SE', nome: 'Sergipe', regiao: 'Nordeste' },
  { uf: 'PI', nome: 'Piauí', regiao: 'Nordeste' },
  { uf: 'TO', nome: 'Tocantins', regiao: 'Norte' },
  { uf: 'RO', nome: 'Rondônia', regiao: 'Norte' },
  { uf: 'AC', nome: 'Acre', regiao: 'Norte' },
  { uf: 'RR', nome: 'Roraima', regiao: 'Norte' },
  { uf: 'AP', nome: 'Amapá', regiao: 'Norte' }
];

export const CIDADES_POR_ESTADO: Record<string, CityInfo[]> = {
  RS: [
    { nome: 'Caxias do Sul', uf: 'RS', destaque: true, empresasAbertasMesAtual: 342, processosAndamento: 89, populacaoAproximada: 520000 },
    { nome: 'Porto Alegre', uf: 'RS', empresasAbertasMesAtual: 1120, processosAndamento: 260, populacaoAproximada: 1400000 },
    { nome: 'Bento Gonçalves', uf: 'RS', empresasAbertasMesAtual: 145, processosAndamento: 38, populacaoAproximada: 123000 },
    { nome: 'Farroupilha', uf: 'RS', empresasAbertasMesAtual: 92, processosAndamento: 22, populacaoAproximada: 73000 },
    { nome: 'Novo Hamburgo', uf: 'RS', empresasAbertasMesAtual: 210, processosAndamento: 54, populacaoAproximada: 247000 },
    { nome: 'Canoas', uf: 'RS', empresasAbertasMesAtual: 380, processosAndamento: 95, populacaoAproximada: 348000 },
    { nome: 'Pelotas', uf: 'RS', empresasAbertasMesAtual: 185, processosAndamento: 41, populacaoAproximada: 343000 },
    { nome: 'Santa Maria', uf: 'RS', empresasAbertasMesAtual: 215, processosAndamento: 58, populacaoAproximada: 285000 },
    { nome: 'Passo Fundo', uf: 'RS', empresasAbertasMesAtual: 195, processosAndamento: 49, populacaoAproximada: 206000 },
    { nome: 'Gramado', uf: 'RS', empresasAbertasMesAtual: 88, processosAndamento: 29, populacaoAproximada: 36000 },
    { nome: 'Flores da Cunha', uf: 'RS', empresasAbertasMesAtual: 45, processosAndamento: 12, populacaoAproximada: 31000 },
    { nome: 'Erechim', uf: 'RS', empresasAbertasMesAtual: 110, processosAndamento: 28, populacaoAproximada: 106000 }
  ],
  SP: [
    { nome: 'São Paulo', uf: 'SP', empresasAbertasMesAtual: 9850, processosAndamento: 2100, populacaoAproximada: 12300000 },
    { nome: 'Campinas', uf: 'SP', empresasAbertasMesAtual: 890, processosAndamento: 210, populacaoAproximada: 1220000 },
    { nome: 'São José dos Campos', uf: 'SP', empresasAbertasMesAtual: 520, processosAndamento: 120, populacaoAproximada: 730000 },
    { nome: 'Ribeirão Preto', uf: 'SP', empresasAbertasMesAtual: 610, processosAndamento: 140, populacaoAproximada: 710000 },
    { nome: 'Sorocaba', uf: 'SP', empresasAbertasMesAtual: 540, processosAndamento: 125, populacaoAproximada: 680000 },
    { nome: 'Santos', uf: 'SP', empresasAbertasMesAtual: 390, processosAndamento: 88, populacaoAproximada: 433000 }
  ],
  SC: [
    { nome: 'Florianópolis', uf: 'SC', empresasAbertasMesAtual: 620, processosAndamento: 145, populacaoAproximada: 516000 },
    { nome: 'Joinville', uf: 'SC', empresasAbertasMesAtual: 680, processosAndamento: 160, populacaoAproximada: 604000 },
    { nome: 'Blumenau', uf: 'SC', empresasAbertasMesAtual: 410, processosAndamento: 98, populacaoAproximada: 366000 },
    { nome: 'Balneário Camboriú', uf: 'SC', empresasAbertasMesAtual: 340, processosAndamento: 82, populacaoAproximada: 145000 },
    { nome: 'Chapecó', uf: 'SC', empresasAbertasMesAtual: 290, processosAndamento: 71, populacaoAproximada: 224000 },
    { nome: 'Criciúma', uf: 'SC', empresasAbertasMesAtual: 240, processosAndamento: 55, populacaoAproximada: 217000 }
  ],
  PR: [
    { nome: 'Curitiba', uf: 'PR', empresasAbertasMesAtual: 1850, processosAndamento: 420, populacaoAproximada: 1960000 },
    { nome: 'Londrina', uf: 'PR', empresasAbertasMesAtual: 520, processosAndamento: 115, populacaoAproximada: 575000 },
    { nome: 'Maringá', uf: 'PR', empresasAbertasMesAtual: 490, processosAndamento: 108, populacaoAproximada: 436000 },
    { nome: 'Cascavel', uf: 'PR', empresasAbertasMesAtual: 380, processosAndamento: 85, populacaoAproximada: 332000 },
    { nome: 'Foz do Iguaçu', uf: 'PR', empresasAbertasMesAtual: 290, processosAndamento: 64, populacaoAproximada: 258000 }
  ],
  RJ: [
    { nome: 'Rio de Janeiro', uf: 'RJ', empresasAbertasMesAtual: 4200, processosAndamento: 980, populacaoAproximada: 6770000 },
    { nome: 'Niterói', uf: 'RJ', empresasAbertasMesAtual: 410, processosAndamento: 92, populacaoAproximada: 515000 },
    { nome: 'Duque de Caxias', uf: 'RJ', empresasAbertasMesAtual: 380, processosAndamento: 88, populacaoAproximada: 920000 }
  ],
  MG: [
    { nome: 'Belo Horizonte', uf: 'MG', empresasAbertasMesAtual: 2400, processosAndamento: 550, populacaoAproximada: 2500000 },
    { nome: 'Uberlândia', uf: 'MG', empresasAbertasMesAtual: 680, processosAndamento: 140, populacaoAproximada: 699000 },
    { nome: 'Juiz de Fora', uf: 'MG', empresasAbertasMesAtual: 390, processosAndamento: 85, populacaoAproximada: 573000 }
  ],
  GO: [
    { nome: 'Goiânia', uf: 'GO', empresasAbertasMesAtual: 1850, processosAndamento: 410, populacaoAproximada: 1530000 },
    { nome: 'Caldas Novas', uf: 'GO', destaque: true, empresasAbertasMesAtual: 140, processosAndamento: 35, populacaoAproximada: 95000 },
    { nome: 'Aparecida de Goiânia', uf: 'GO', empresasAbertasMesAtual: 610, processosAndamento: 130, populacaoAproximada: 527000 },
    { nome: 'Anápolis', uf: 'GO', empresasAbertasMesAtual: 420, processosAndamento: 95, populacaoAproximada: 398000 }
  ]
};

// Default fallback generator for any unspecified municipality in Brazil
export function getCitiesForState(uf: string): CityInfo[] {
  if (CIDADES_POR_ESTADO[uf]) {
    return CIDADES_POR_ESTADO[uf];
  }
  const estado = ESTADOS_BRASIL.find(e => e.uf === uf);
  const nomeEstado = estado ? estado.nome : uf;
  return [
    { nome: `Capital de ${nomeEstado}`, uf, empresasAbertasMesAtual: 450, processosAndamento: 110 },
    { nome: `Polo Regional ${uf}`, uf, empresasAbertasMesAtual: 180, processosAndamento: 42 }
  ];
}
