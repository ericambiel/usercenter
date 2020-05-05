// Configuração necessárias para ambiente de produção
// assim conseguimos eliminar o CORS em backend, para
// ambiente de desenvolvimento habilitar CORS em back end
// desativar esta classe.
const AppConfig = require('./config/app.config.js');

const appConfig = new AppConfig();

const PROXY_CONFIG = [{
  context: [`/${appConfig.REST_API_COMMON_ROUTE}`], // api é a chave de substituição em código para distinguir rotas de URL
  target: appConfig.getRestBaseUrlOnly(), // hots+porta
  secure: false, // caso HTTPS marque true
  logLevel: 'debug',
  //pathRewrite: { '^/api': '' } // Troca api por vazio durante o envio ao rest caso esteja em uma API Rest legado e não pode alterar
}]

module.exports = PROXY_CONFIG;
