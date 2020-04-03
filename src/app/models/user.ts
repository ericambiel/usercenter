export class User {
  userName: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  permissionLevel: [string];
  image: string;
  adUser: string;

  public getFullName(): string {
    return `${this.name} ${this.surname}`;
  }
}
