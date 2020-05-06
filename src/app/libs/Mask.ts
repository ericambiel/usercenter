import { conformToMask } from 'angular2-text-mask';

class Mask {
  constructor() {}

  /**
   * Descobre qual mascara a ser usada para campos CNPJ ou CPF.
   * @param cnpjCpf Numero do CNPJ ou CPF.
   * @returns Array contendo mascara a ser utilizado em conjunto com
   * angular2-text-mask
   */
  maskCnpjCpf(cnpjCpf: number) {
    const cpfMask = [ /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/ ];
    const cnpjMask = [ '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/ ];

    if (cnpjCpf.toString().length <= 11 ) {
      return Array.prototype
        .concat(this.cnpjCpfNormalizer(cnpjCpf), cpfMask);
    } else {
      return Array.prototype
        .concat(this.cnpjCpfNormalizer(cnpjCpf), cnpjMask);
    }
  }

  /**
   * Converte numero para CNPJ ou CPJ já mascarado.
   * @param cnpjCpf Numero do CNPJ ou CPF.
   * @return String com CNPJ ou CPF já formatados.
   */
  cnpjCpfConformed(cnpjCpf: number): string {
    return conformToMask(
      cnpjCpf.toString(),
      this.maskCnpjCpf(cnpjCpf),
      {guide: false}).conformedValue;
  }

  /**
   * Remove todos os caracteres de um string deixando
   * somente números.
   * @param fieldConformed Valor mascarado.
   */
  unmask(fieldConformed): string {
    return fieldConformed.toString().replace(/\D+/g, ''); // remove caracteres
  }
  /**
   * Normaliza números CNPJ ou CPF
   * @param cnpjCpf Numero do CNPJ ou CPF.
   */
  private cnpjCpfNormalizer(cnpjCpf): Array<any> {
    this.unmask(cnpjCpf);
    switch (cnpjCpf.toString().length) {
      case 10:
        return ['0', /\d/];
      case 12:
        return ['0'];
      case 13:
        return ['0', /\d/];
      default:
        return [ /\d/, /\d/];
    }
  }
}

const mask = new Mask();

export { mask };
