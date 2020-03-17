import { Departamento } from './departamento';
import { Documento } from './documento';

export class Contrato {
  // Dados exibido quando Mostar/Deletar
  _id: string;
  idSecondary: number;
  objeto: string;
  estabFiscal: string;
  parceiro: string;
  cnpj: number;
  status: string;               // Mudar para status
  situacao: string;
  deptoResponsavel: string;
  valTotal: number;             // Valor total
  valMensal: number;
  dataInicio: Date;
  dataFim: Date;
  deptoPartList: [Departamento]; // Lista de Departamentos associados
  indReajuste: string;
  diaAntecedencia: number;      // Dias de antecedencia
  obs: string;
  historico: string;
  anaJuridico: boolean;         // Analise juridica
  documentoList: [Documento];   // Mudar diretorio
  natureza: string;
}
