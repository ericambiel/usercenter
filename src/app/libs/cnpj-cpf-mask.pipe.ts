import { Pipe, PipeTransform } from '@angular/core';
import { conformToMask } from 'angular2-text-mask';

@Pipe({ name: 'cnpjCpfMask' })
export class CnpjCpfMaskPipe implements PipeTransform {
  transform(cnpjCpf: number): string {
    let cpfCnpjConformed;
    let mask;

    cpfCnpjConformed = conformToMask(
      cnpjCpf.toString(),
      mask = () => {
        // const fildWithoutMask = cnpjCpf.toString().replace(/[^0-9]+/g, '');
        if (cnpjCpf.toString().length <=  11 ) {
          return [ /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/ ];
        } else {
          return [ /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/ ];
        }
      },
      {guide: false}
    );

    return cpfCnpjConformed.conformedValue;
  }
}
