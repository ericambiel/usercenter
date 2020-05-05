'use strict';

class AppConfig{
  REST_API_BASE_URL = 'http://localhost';  // https://github.com/angular/angular/tree/master/packages/common/locales
  REST_API_PORT = 3000;
  REST_API_COMMON_ROUTE = 'api';
  //LOCALE_ID = 'pt'; // Necessário descrever classe em app.config.d.ts para ser usado em typeScript

  getLocaleId() {
      return this.LOCALE_ID;
  }

  getRestBaseUrl() {
      return `${this.REST_API_BASE_URL}:${this.REST_API_PORT}/${this.REST_API_COMMON_ROUTE}`;
  }

  getRestBaseUrlOnly() {
      return `${this.REST_API_BASE_URL}:${this.REST_API_PORT}`;
  }
}
module.exports = AppConfig;


