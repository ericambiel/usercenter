export class AppConfig {
  // https://github.com/angular/angular/tree/master/packages/common/locales
  private LOCALE_ID = 'pt';

  public getLocaleId(): string {
    return this.LOCALE_ID;
  }
}
