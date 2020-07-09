export class Departamento {
  _id: string;
  departResponsible: [string];
  description: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  departamento: string; // TODO: Refatorar, trocar em classes por description.
}
