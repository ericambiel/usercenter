import { Departamento } from './departamento';
import { Documento } from './documento';

export class Contrato {
  id: number;
  estab_fiscal: string;
  parceiro: string;
  cnpj: number;
  title: string; //Mudar para objeto
  state: string; //Mudar para status
  situacao:string;
  ind_reajuste: string;
  d_antecedencia: number; //Dias de antecedencia
  ana_juridico: boolean; //Analise juridica
  val_total: number; //Valor toral
  created_at: string; // Mudar data_inicio
  updated_at: string; // Mudara data_fim
  depto_part: [Departamento]; //Departamentos Participantes
  obs: string;
  historico: string;

  documento: [Documento]; //Mudar diretorio
}
