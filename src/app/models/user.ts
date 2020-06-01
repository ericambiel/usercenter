class EstabFiscal {
  _id: string;
  escricao: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: number;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
}

class Permission {
  _id: string;
  description: string;
}

export class User {
  _id: string;
  userName: string;
  name: string;
  surname: string;
  email: string;
  phone: number;
  birthDate: Date;
  cpf: number;
  adUser: string;
  password: string;
  image: string;
  isActive: boolean;
  // tslint:disable-next-line: max-line-length
  departments: [{ _id: string, description: string, departResponsible: string }]; // TODO: Verificar model departamento e associar contrato ao usuário
  estabFiscal: EstabFiscal;
  permissions: [ Permission ];
  refreshToken: string;
}
