import { Pipe, PipeTransform } from '@angular/core';
import { mask } from '../libs/Mask';

@Pipe({ name: 'cnpjCpfMask' })
export class CnpjCpfMaskPipe implements PipeTransform {
  transform(cnpjCpf: number): string {
    return mask.cnpjCpfConformed(cnpjCpf);
  }
}
