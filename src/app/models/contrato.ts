import { Departamento } from './departamento';
import { Documento } from './documento';

export class Contrato {
  // Dados exibido quando Mostar/Deletar
  _id: string;
  idSecondary: number;
  objeto: string;               // Mudar para objeto
  estabFiscal: string;
  parceiro: string;
  cnpj: number;
  status: string;               // Mudar para status
  situacao: string;
  deptoResponsavel: string;
  valTotal: number;             // Valor total
  valMensal: number;            //Add ao Rest e BD Não existe
  dataInicio: Date;
  dataFim: Date;
  deptoPartList: [Departamento]; // Lista de Departamentos associados
  // Dados exibidos quando Inserir/Modificar
  indReajuste: string;
  diaAntecedencia: number;      // Dias de antecedencia
  obs: string;
  historico: string;
  anaJuridico: boolean;         // Analise juridica
  documentoList: [Documento];   // Mudar diretorio

  /**
   * Formata CNPJ.
   *
   * @returns CNPJ formatado.
   */
  public getCNPJFormatado() {
    return this.cnpj.toString().replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
      (grupo1, grupo2, grupo3, grupo4, grupo5) => {
        return `${grupo1}.${grupo2}.${grupo3}/${grupo4}-${grupo5}`;
    });
  }
}
