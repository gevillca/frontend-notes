import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string | number | null | undefined): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleDateString('en', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
