import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'ascii'
})
export class AsciiPipe implements PipeTransform {

  transform(value: number, fallback: string = "."): string {
    if (value < 33 || value > 126) {
      return fallback;
    }
    return String.fromCharCode(value);
  }

}
