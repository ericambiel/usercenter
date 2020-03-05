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
  valMensal: number;
  dataInicio: string;           // Mudar para tipo Date
  dataFim: string;              // Mudar para tipo Date
  deptoPartList: [Departamento]; // Lista de Departamentos associados
  // Dados exibidos quando Inserir/Modificar
  indReajuste: string;
  diaAntecedencia: number;      // Dias de antecedencia
  obs: string;
  historico: string;
  anaJuridico: boolean;         // Analise juridica
  documentoList: [Documento];   // Mudar diretorio
}
