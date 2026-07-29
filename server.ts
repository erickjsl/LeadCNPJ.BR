import express from 'express';
import path from 'path';

import { createServer as createViteServer } from 'vite';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import * as cheerio from 'cheerio';

dotenv.config();


async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Função auxiliar de scraping (Web Spy)
  async function duckDuckGoSearch(query: string): Promise<string> {
    try {
      console.log(`[Web Spy] Pesquisando: ${query}`);
      const response = await fetch('https://html.duckduckgo.com/html/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ q: query }).toString()
      });
      if (!response.ok) return 'Nenhum resultado encontrado (Erro na busca).';
      const html = await response.text();
      const $ = cheerio.load(html);
      let resultsText = '';
      $('.result__body').slice(0, 4).each((_i, el) => {
        const title = $(el).find('.result__title').text().trim();
        const snippet = $(el).find('.result__snippet').text().trim();
        if (title && snippet) {
          resultsText += `\n- Título: ${title}\n  Resumo: ${snippet}\n`;
        }
      });
      return resultsText || 'Nenhum resumo útil encontrado.';
    } catch (e) {
      console.error('[Web Spy] Erro na busca:', e);
      return 'Erro ao tentar pesquisar na internet.';
    }
  }

  // AI Pitch & Commercial Outreach Generator using Gemini SDK
  app.post('/api/generate-pitch', async (req, res) => {
    try {
      const {
        companyName,
        tradeName,
        cnae,
        sector,
        city,
        uf,
        status,
        capitalSocial,
        porte,
        socio,
        userProfile,
        channel = 'whatsapp',
        tone = 'consultative',
        customNotes = '',
        useWebSpy = false
      } = req.body;

      if (!companyName) {
        return res.status(400).json({ error: 'Nome da empresa é obrigatório.' });
      }

      const apiKey = userProfile?.groqApiKey || process.env.GROQ_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'Chave API da Groq não encontrada. Configure-a no seu Perfil na interface ou no arquivo .env.'
        });
      }

      const groq = new Groq({ apiKey });

      let prompt = `
Você é um especialista em Vendas B2B e Prospecção de Clientes no Brasil.
Gere uma mensagem de abordagem comercial para uma empresa recém-criada / em processo de abertura.

DADOS DA NOVA EMPRESA (LEAD):
- Razão Social / Nome: ${companyName} ${tradeName ? `(Nome Fantasia: ${tradeName})` : ''}
- Cidade/UF: ${city || 'Caxias do Sul'} - ${uf || 'RS'}
- Atividade / CNAE: ${cnae || sector || 'Não especificado'}
- Setor: ${sector || 'Geral'}
- Porte / Capital Social: ${porte || 'ME/EPP'} | ${capitalSocial ? `R$ ${capitalSocial}` : 'Capital Inicial'}
- Status de Abertura: ${status || 'Em processo de abertura / CNPJ recente'}
- Sócio / Contato: ${socio || 'Empresário / Sócio-Administrador'}

PERFIL DO PROSPECTOR (SERVIÇO OFERECIDO):
- Tipo de Serviço: ${userProfile?.serviceType || 'Serviços Profissionais / Assessoria Empresarial'}
- Diferenciais do Serviço: ${userProfile?.differentials || 'Atendimento rápido, focado em empresas recém-abertas, soluções sob medida'}
- Nome/Empresa do Prospector: ${userProfile?.userName || 'Sua Empresa'}

PARÂMETROS DA MENSAGEM:
- Canal de Envio: ${channel} (Ex: whatsapp = mensagem curta e direta com emojis adequados; email = assunto impactante + e-mail profissional; call = script para ligação telefônica de 60s; proposal = apresentação executiva)
- Tom de Voz: ${tone} (consultivo, direto, amigável ou formal)
- Observações adicionais: ${customNotes || 'Nenhuma'}`;

      if (useWebSpy) {
        const searchTerm = `"${tradeName || companyName}" ${city} ${uf}`;
        const searchResults = await duckDuckGoSearch(searchTerm);
        prompt += `

CONTEXTO ADICIONAL DA INTERNET (WEB SPY RESULTADOS):
Use essas informações (se forem relevantes para a empresa) para criar uma abordagem extremamente personalizada que mostre que você pesquisou sobre eles:
${searchResults}
`;
      }

      prompt += `

INSTRUÇÕES DE RESPOSTA:
Forneça a resposta em formato JSON válido com a seguinte estrutura:
{
  "subject": "Título / Assunto (se aplicável)",
  "pitch": "Texto principal completo da abordagem",
  "openingHooks": ["2 ou 3 opções de frases de abertura matadoras para chamar atenção"],
  "keyBenefitsToHighlight": ["3 benefícios principais para esta empresa específica"],
  "followUpTip": "Dica estratégica de acompanhamento pós-envio"
}
Retorne estritamente o JSON sem marcações extras de markdown ou formatação fora do JSON.
`;

      const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const text = response.choices[0]?.message?.content || '';
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        parsed = {
          subject: `Parabéns pela abertura da ${tradeName || companyName}!`,
          pitch: text,
          openingHooks: ['Olá! Vi que vocês estão iniciando as atividades em ' + (city || 'sua cidade') + '.'],
          keyBenefitsToHighlight: ['Agilidade no atendimento', 'Solução sob medida para o seu setor'],
          followUpTip: 'Envie uma mensagem curta 48h após a primeira tentativa caso não obtenha resposta.'
        };
      }

      return res.json(parsed);
    } catch (error: any) {
      console.error('Erro no /api/generate-pitch:', error);
      return res.status(500).json({
        error: 'Falha ao gerar abordagem comercial com IA: ' + (error?.message || 'Erro desconhecido')
      });
    }
  });

  // Public CNPJ Lookup endpoint (proxies to BrasilAPI with fallback)
  app.get('/api/cnpj-lookup/:cnpj', async (req, res) => {
    try {
      const cnpjClean = req.params.cnpj.replace(/\D/g, '');
      if (cnpjClean.length !== 14) {
        return res.status(400).json({ error: 'CNPJ deve conter 14 dígitos.' });
      }

      // Função helper para buscar no publica.cnpj.ws e mapear os dados
      const fetchCnpjWsFallback = async () => {
        const fallbackResponse = await fetch(`https://publica.cnpj.ws/cnpj/${cnpjClean}`);
        if (fallbackResponse.ok) {
          const wsData = await fallbackResponse.json();
          return {
            cnpj: wsData.estabelecimento.cnpj,
            razao_social: wsData.razao_social,
            nome_fantasia: wsData.estabelecimento.nome_fantasia || wsData.razao_social,
            cnae_fiscal: wsData.estabelecimento.atividade_principal.id,
            cnae_fiscal_descricao: wsData.estabelecimento.atividade_principal.descricao,
            data_inicio_atividade: wsData.estabelecimento.data_inicio_atividade,
            descricao_situacao_cadastral: wsData.estabelecimento.situacao_cadastral?.toUpperCase(),
            porte: wsData.porte?.descricao || '',
            capital_social: wsData.capital_social,
            natureza_juridica: wsData.natureza_juridica?.descricao || '',
            email: wsData.estabelecimento.email,
            ddd_telefone_1: wsData.estabelecimento.ddd1 && wsData.estabelecimento.telefone1 ? `${wsData.estabelecimento.ddd1}${wsData.estabelecimento.telefone1}` : '',
            ddd_telefone_2: wsData.estabelecimento.ddd2 && wsData.estabelecimento.telefone2 ? `${wsData.estabelecimento.ddd2}${wsData.estabelecimento.telefone2}` : '',
            descricao_tipo_de_logradouro: wsData.estabelecimento.tipo_logradouro,
            logradouro: wsData.estabelecimento.logradouro,
            numero: wsData.estabelecimento.numero,
            bairro: wsData.estabelecimento.bairro,
            municipio: wsData.estabelecimento.cidade?.nome,
            uf: wsData.estabelecimento.estado?.sigla,
            cep: wsData.estabelecimento.cep,
            qsa: (wsData.socios || []).map((s: any) => ({
              nome_socio: s.nome,
              qualificacao_socio: s.qualificacao_socio?.descricao || 'Sócio'
            }))
          };
        }
        return null;
      };

      let response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjClean}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });
      
      if (!response.ok) {
        // Se a BrasilAPI der Too Many Requests (429) ou Forbbiden (403), tenta o fallback
        if (response.status === 429 || response.status === 403) {
          console.log(`[CNPJ Lookup] BrasilAPI falhou com ${response.status}. Tentando publica.cnpj.ws como fallback...`);
          const fallbackData = await fetchCnpjWsFallback();
          if (fallbackData) {
            return res.json(fallbackData);
          }
        }
        
        if (response.status === 404) {
          return res.status(404).json({ error: 'CNPJ não encontrado na Receita Federal.' });
        }
        
        return res.status(response.status).json({ error: 'Erro ao consultar serviço público da Receita Federal.' });
      }

      const data = await response.json();
      
      // Se a BrasilAPI retornou os dados, mas sem telefone, tentamos enriquecer com o CNPJ.ws
      if (!data.ddd_telefone_1 && !data.ddd_telefone_2) {
        console.log(`[CNPJ Lookup] BrasilAPI retornou sem telefone. Tentando enriquecer via publica.cnpj.ws...`);
        const fallbackData = await fetchCnpjWsFallback();
        if (fallbackData) {
          // Mescla os dados, priorizando os dados do fallback para campos vazios
          return res.json({
            ...data,
            ddd_telefone_1: fallbackData.ddd_telefone_1 || data.ddd_telefone_1,
            ddd_telefone_2: fallbackData.ddd_telefone_2 || data.ddd_telefone_2,
            email: fallbackData.email || data.email,
            natureza_juridica: fallbackData.natureza_juridica || data.natureza_juridica
          });
        }
      }

      return res.json(data);
    } catch (error: any) {
      console.error('Erro na consulta CNPJ:', error);
      return res.status(500).json({ error: 'Erro de conexão ao buscar CNPJ.' });
    }
  });

  // Serve static or Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor LeadCNPJ Brasil rodando em http://0.0.0.0:${PORT}`);
  });
}

startServer();
