import { conformToMask } from 'angular2-text-mask';

// TODO: verificar meio para usar somente uma mascara tanto para pipe quanto formulários.
class Mask {
  constructor() {}

  /**
   * Remove todos os caracteres de um string deixando
   * somente números.
   * @param fieldConformed Valor mascarado.
   */
  unmask(fieldConformed) {
    fieldConformed = fieldConformed.toString().replace(/\D+/g, ''); // remove caracteres
    // fieldConformed = fieldConformed.toString().replace(/^0+/, ''); // remove zeros a esquerda
    return fieldConformed;
  }

  /**
   * Converte numero para CNPJ ou CPJ já mascarado.
   * @param cnpjCpf Numero do CNPJ ou CPF.
   * @return String com CNPJ ou CPF já formatados.
   */
  cnpjCpfConformed(cnpjCpf: number): string {
    return conformToMask(
      cnpjCpf.toString(),
      this.maskCnpjCpfPipe(cnpjCpf),
      {guide: false}).conformedValue;
  }

  /**
   * Descobre qual mascara a ser usada para campos CNPJ ou CPF.
   * @param cnpjCpf Numero do CNPJ ou CPF.
   * @returns Array contendo mascara a ser utilizado em conjunto com
   * angular2-text-mask
   */
  maskCnpjCpf = (cnpjCpf: number) => {
    const cnpjCpfUnmasked = cnpjCpf.toString().replace(/[^0-9]+/g, '');
    if (cnpjCpfUnmasked.length <=  11 ) {
      return [ /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/ ];
    } else {
      return [ /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/ ];
    }
  }

  /**
   * Descobre qual mascara a ser usada para campos CNPJ ou CPF.
   * Usado pelo PIPE
   * @param cnpjCpf Numero do CNPJ ou CPF.
   * @returns Array contendo mascara a ser utilizado em conjunto com
   * angular2-text-mask
   */
  private maskCnpjCpfPipe(cnpjCpf: number) {
    const cnpjCpfUnmasked = this.unmask(cnpjCpf.toString());
    if (cnpjCpfUnmasked.length <= 11 ) {
      return this.cpfNormalizer(cnpjCpfUnmasked);
    } else {
      return this.cnpjNormalizer(cnpjCpfUnmasked);
    }
  }

  /**
   * Normaliza números CNPJ ou CPF
   * @param cnpjCpfUnmasked Numero do CNPJ ou CPF.
   */
  private cpfNormalizer(cnpjCpfUnmasked: string): Array<any> {
    // cnpjCpfUnmasked = cnpjCpfUnmasked.toString().replace(/^0+/, ''); // remove zeros a esquerda
    if (cnpjCpfUnmasked.length === 10) {
      return [0, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
    } else {
      return [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
    }
  }

  /**
   * Normaliza números CNPJ ou CPF
   * @param cnpjCpfUnmasked Numero do CNPJ ou CPF.
   */
  private cnpjNormalizer(cnpjCpfUnmasked: string): Array<any> {
    // cnpjCpfUnmasked = cnpjCpfUnmasked.toString().replace(/^0+/, ''); // remove zeros a esquerda
    if (cnpjCpfUnmasked.length === 12) {
       // TODO: ['0', '0', '.', ...] sobrepõem números subsequentes caso iguais
      return ['O', 'O' , '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
    } else if (cnpjCpfUnmasked.length === 13) {
      return [ 0, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
    } else {
      return [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]; // /^[0|\D]*/
    }
  }
}

const mask = new Mask();

export { mask };
