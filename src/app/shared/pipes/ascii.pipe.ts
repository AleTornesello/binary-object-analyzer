import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'ascii'
})
export class AsciiPipe implements PipeTransform {

  transform(value: number, fallback: string = "."): unknown {
    if (value < 32 || value > 126) {
      return fallback;
    }
    return String.fromCharCode(value);
  }

}
