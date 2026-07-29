# LeadCNPJ.BR

Plataforma inteligente para prospecção B2B (Business-to-Business) utilizando dados abertos de CNPJs recém-abertos ou existentes no Brasil.

## 🚀 Funcionalidades

- **Dashboard de Prospecção**: Visualização de empresas divididas por setores, porte e localização.
- **Busca Avançada & Filtros**: Filtros por status de abertura (Em processo, Emitido, Alvará), setor de atuação, porte da empresa, status no funil de vendas (CRM) e por data (últimos 7, 15, 30, 90 dias).
- **Consulta Real de CNPJ**: Integração com a BrasilAPI para buscar dados reais de empresas através do CNPJ em tempo real, permitindo a importação direta para o seu funil.
- **Web Spy (Modo Espião)**: Utiliza a API do Groq (LLM) conectada ao DuckDuckGo para fazer varreduras profundas na web sobre as empresas, gerando um dossiê, insights de mercado e um pitch de vendas ultra-personalizado.
- **Pipeline de Vendas (CRM)**: Gestão de negociações em formato funil com os status: Novo, Contatado, Reunião Agendada, Proposta Enviada, Cliente.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Vite, TailwindCSS, Lucide-React (Ícones).
- **Backend**: Node.js, Express, Cheerio.
- **APIs**: 
  - BrasilAPI (Busca de CNPJs).
  - DuckDuckGo (Raspagem web no backend via Cheerio).
  - Groq (Processamento de linguagem natural).

## 📦 Como rodar localmente

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Configuração de Variáveis de Ambiente**:
   Crie um arquivo `.env` na raiz do projeto contendo a sua chave da Groq:
   ```env
   GROQ_API_KEY=gsk_sua_chave_aqui
   ```

3. **Inicie o servidor de desenvolvimento**:
   O Vite iniciará o frontend e o backend (`server.ts`) juntos.
   ```bash
   npm run dev
   ```

4. **Acesse no navegador**:
   Geralmente em `http://localhost:3000` (verifique a porta indicada no terminal).

## 📄 Estrutura Principal

- `/src/components`: Componentes da interface de usuário em React.
- `/src/data`: Lógica de gerenciamento de estado (Mock/Local Storage) e scripts para manipulação da base da RFB.
- `/src/utils`: Funções utilitárias como formatação de data para o padrão Brasileiro (DD/MM/AAAA).
- `server.ts`: Servidor Node responsável pelas requisições CORS seguras e geração de IA.
