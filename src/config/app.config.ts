export class AppConfig {
  // https://github.com/angular/angular/tree/master/packages/common/locales
  private readonly LOCALE_ID = 'pt';
  private readonly REST_API_BASE_URL = 'http://localhost';
  private readonly REST_API_PORT = 3000;

  public getLocaleId(): string {
    return this.LOCALE_ID;
  }

  public getRestBaseUrl(): string {
    return `${this.REST_API_BASE_URL}:${this.REST_API_PORT}`;
  }
}
