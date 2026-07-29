import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

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
        customNotes = ''
      } = req.body;

      if (!companyName) {
        return res.status(400).json({ error: 'Nome da empresa é obrigatório.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'Chave GEMINI_API_KEY não configurada no servidor. Por favor, verifique as configurações em Secrets.'
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const prompt = `
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
- Observações adicionais: ${customNotes || 'Nenhuma'}

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

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      });

      const text = response.text || '';
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

  // Public CNPJ Lookup endpoint (proxies to BrasilAPI)
  app.get('/api/cnpj-lookup/:cnpj', async (req, res) => {
    try {
      const cnpjClean = req.params.cnpj.replace(/\D/g, '');
      if (cnpjClean.length !== 14) {
        return res.status(400).json({ error: 'CNPJ deve conter 14 dígitos.' });
      }

      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjClean}`);
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: 'CNPJ não encontrado na Receita Federal.' });
        }
        return res.status(response.status).json({ error: 'Erro ao consultar serviço público da Receita Federal.' });
      }

      const data = await response.json();
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
