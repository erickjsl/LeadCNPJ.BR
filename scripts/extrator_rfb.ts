import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import yauzl from 'yauzl';
import csv from 'csv-parser';
import { Transform } from 'stream';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações
const CITY_TOMBO_CODE = '9289'; // 9289 = Caldas Novas/GO na base da Receita
const YEAR_FILTER = '2026'; // Filtrar apenas aberturas em 2026 (ou deixe em branco para todas)
const DATA_DIR = path.join(__dirname, '..', 'dados_rfb');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'leads_reais.json');

// URL base da Receita Federal (atualizada)
const RFB_BASE_URL = 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/';
const FILE_NAMES = [
  'Estabelecimentos0.zip',
  'Estabelecimentos1.zip',
  'Estabelecimentos2.zip',
  'Estabelecimentos3.zip',
  'Estabelecimentos4.zip',
  'Estabelecimentos5.zip',
  'Estabelecimentos6.zip',
  'Estabelecimentos7.zip',
  'Estabelecimentos8.zip',
  'Estabelecimentos9.zip'
];

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function downloadFile(filename: string): Promise<string> {
  const filepath = path.join(DATA_DIR, filename);
  if (fs.existsSync(filepath)) {
    console.log(`[INFO] Arquivo ${filename} já existe, pulando download.`);
    return filepath;
  }

  console.log(`[DOWNLOAD] Baixando ${filename}... (Isso pode demorar MUITO)`);
  console.log(`           Se travar ou der erro, baixe manualmente em: https://dadosabertos.rfb.gov.br/CNPJ/${filename}`);
  console.log(`           E coloque o arquivo na pasta: ${DATA_DIR}`);

  try {
    const response = await axios({
      method: 'GET',
      url: `${RFB_BASE_URL}${filename}`,
      responseType: 'stream',
      timeout: 60000,
    });

    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(filepath));
      writer.on('error', reject);
    });
  } catch (error: any) {
    console.error(`[ERRO] Falha ao baixar ${filename}: ${error.message}`);
    throw error;
  }
}

async function processZipFile(filepath: string, allLeads: any[]) {
  return new Promise((resolve, reject) => {
    yauzl.open(filepath, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(err);
      
      zipfile.readEntry();
      zipfile.on('entry', (entry) => {
        if (/\/$/.test(entry.fileName)) {
          zipfile.readEntry();
        } else {
          console.log(`[PROCESSANDO] Extraindo CSV de ${path.basename(filepath)}...`);
          zipfile.openReadStream(entry, (err, readStream) => {
            if (err) return reject(err);

            readStream
              .pipe(csv({
                separator: ';',
                headers: [
                  'cnpj_basico', 'cnpj_ordem', 'cnpj_dv', 'identificador_matriz_filial',
                  'nome_fantasia', 'situacao_cadastral', 'data_situacao_cadastral',
                  'motivo_situacao_cadastral', 'nome_cidade_exterior', 'pais',
                  'data_inicio_atividade', 'cnae_fiscal_principal', 'cnae_fiscal_secundaria',
                  'tipo_logradouro', 'logradouro', 'numero', 'complemento', 'bairro',
                  'cep', 'uf', 'municipio', 'ddd_1', 'telefone_1', 'ddd_2', 'telefone_2',
                  'ddd_fax', 'fax', 'correio_eletronico', 'situacao_especial', 'data_situacao_especial'
                ]
              }))
              .on('data', (row) => {
                // municipio = código TOMBO da Receita
                if (row.municipio === CITY_TOMBO_CODE) {
                  // Filtra pela data (formato AAAAMMDD)
                  if (!YEAR_FILTER || row.data_inicio_atividade.startsWith(YEAR_FILTER)) {
                    // Monta o lead
                    allLeads.push({
                      cnpj: `${row.cnpj_basico}${row.cnpj_ordem}${row.cnpj_dv}`,
                      nome_fantasia: row.nome_fantasia || 'NOME NÃO INFORMADO',
                      data_abertura: row.data_inicio_atividade,
                      cnae: row.cnae_fiscal_principal,
                      bairro: row.bairro,
                      cidade: 'Caldas Novas', // Hardcoded pois filtramos pelo TOMBO
                      uf: row.uf
                    });
                  }
                }
              })
              .on('end', () => {
                zipfile.readEntry();
              });
          });
        }
      });

      zipfile.on('end', () => {
        resolve(true);
      });
    });
  });
}

async function runExtractor() {
  console.log('====================================================');
  console.log(' INICIANDO ROBÔ EXTRATOR DA RECEITA FEDERAL (LOCAL)');
  console.log('====================================================');
  console.log(`Filtrando para Código TOMBO: ${CITY_TOMBO_CODE} (Caldas Novas)`);
  console.log(`Filtrando para o Ano: ${YEAR_FILTER}`);
  
  const allLeads: any[] = [];

  for (const filename of FILE_NAMES) {
    try {
      const filepath = await downloadFile(filename);
      await processZipFile(filepath, allLeads);
      console.log(`[SUCESSO] ${filename} processado. Encontrados: ${allLeads.length} leads até agora.`);
    } catch (err: any) {
      console.error(`[FALHA] Pulando ${filename} devido a erro.`);
    }
  }

  console.log('====================================================');
  console.log(`TOTAL DE LEADS REAIS ENCONTRADOS: ${allLeads.length}`);
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allLeads, null, 2));
  console.log(`[SALVO] Dados exportados para ${OUTPUT_FILE}`);
  console.log('====================================================');
  console.log('Agora você pode reiniciar o seu sistema e importar os dados reais!');
}

runExtractor();
