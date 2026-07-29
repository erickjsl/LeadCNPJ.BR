import { CompanyLead } from '../types';
import { formatDateBR } from './formatters';

export const printCompanyPDF = (company: CompanyLead | any, isRawBrasilApi: boolean = false) => {
  // Extract data depending on whether it's our CRM CompanyLead or raw BrasilAPI data
  const razaoSocial = isRawBrasilApi ? company.razao_social : company.razaoSocial;
  const nomeFantasia = isRawBrasilApi ? company.nome_fantasia : company.nomeFantasia;
  const cnpj = isRawBrasilApi ? company.cnpj : company.cnpj;
  const dataAbertura = isRawBrasilApi ? formatDateBR(company.data_inicio_atividade) : formatDateBR(company.dataAbertura);
  const status = isRawBrasilApi ? company.descricao_situacao_cadastral : company.statusAbertura;
  const cnaeCodigo = isRawBrasilApi ? company.cnae_fiscal : company.cnaeCodigo;
  const cnaeDescricao = isRawBrasilApi ? company.cnae_fiscal_descricao : company.cnaeDescricao;
  const porte = isRawBrasilApi ? company.porte : company.porte;
  const capital = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(isRawBrasilApi ? (company.capital_social || 0) : (company.capitalSocial || 0));
  const endereco = isRawBrasilApi 
    ? `${company.descricao_tipo_de_logradouro || ''} ${company.logradouro || ''}, ${company.numero || 'S/N'} - ${company.bairro || ''}, ${company.municipio || ''} - ${company.uf || ''}`
    : `${company.logradouro}, ${company.numero} - ${company.bairro}, ${company.municipio} - ${company.uf}`;
  
  const cep = isRawBrasilApi ? company.cep : company.cep;
  const email = isRawBrasilApi ? company.email : company.socioAdministrador?.email;
  const telefone = isRawBrasilApi 
    ? [company.ddd_telefone_1, company.ddd_telefone_2].filter(Boolean).join(' / ') 
    : company.socioAdministrador?.telefone;
    
  const qsa = isRawBrasilApi 
    ? (company.qsa || []).map((s: any) => `${s.nome_socio} (${s.qualificacao_socio})`)
    : [`${company.socioAdministrador?.nome} (${company.socioAdministrador?.qualificacao})`];

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Ficha da Empresa - ${razaoSocial}</title>
      <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; margin: 40px; }
        h1 { color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; font-size: 24px; }
        h2 { color: #2563eb; font-size: 18px; margin-top: 30px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .field { margin-bottom: 12px; }
        .label { font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase; display: block; }
        .value { font-size: 15px; font-weight: 500; }
        .footer { margin-top: 50px; font-size: 11px; color: #9ca3af; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 10px; }
        @media print {
          body { margin: 0; padding: 20px; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>${razaoSocial}</h1>
      ${nomeFantasia ? `<p style="font-size: 16px; margin-top: -10px; color: #4b5563;"><strong>Fantasia:</strong> ${nomeFantasia}</p>` : ''}
      
      <div class="grid">
        <div class="field"><span class="label">CNPJ</span><span class="value">${cnpj}</span></div>
        <div class="field"><span class="label">Status</span><span class="value">${status}</span></div>
        <div class="field"><span class="label">Data de Abertura</span><span class="value">${dataAbertura}</span></div>
        <div class="field"><span class="label">Porte / Capital Social</span><span class="value">${porte} | ${capital}</span></div>
      </div>

      <h2>Atividade (CNAE)</h2>
      <div class="field"><span class="label">CNAE Principal</span><span class="value">${cnaeCodigo} - ${cnaeDescricao}</span></div>

      <h2>Contato e Endereço</h2>
      <div class="field"><span class="label">Endereço</span><span class="value">${endereco} - CEP: ${cep}</span></div>
      <div class="grid">
        <div class="field"><span class="label">Telefone</span><span class="value">${telefone || 'Não informado'}</span></div>
        <div class="field"><span class="label">E-mail</span><span class="value">${email || 'Não informado'}</span></div>
      </div>

      <h2>Quadro de Sócios / Responsáveis</h2>
      <ul>
        ${qsa.map((s: string) => `<li><span class="value">${s}</span></li>`).join('')}
      </ul>

      <div class="footer">
        Gerado por LeadCNPJ.BR em ${new Date().toLocaleString('pt-BR')}
      </div>
      
      <script>
        window.onload = () => { window.print(); }
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  } else {
    alert("Por favor, permita pop-ups para gerar o PDF/Impressão.");
  }
};
