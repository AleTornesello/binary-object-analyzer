import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hexlify',
  standalone: true
})
export class HexlifyPipe implements PipeTransform {

  transform(value: string | number, addPrefix: boolean = false, length: number = 8, prefix: string = '0x'): string {
    if(addPrefix) {
      return `${prefix}${value.toString(16).padStart(length, '0')}`;
    }

    return value.toString(16).padStart(length, '0');
  }

}
