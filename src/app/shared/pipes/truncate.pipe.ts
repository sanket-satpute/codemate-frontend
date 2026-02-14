import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 20, completeWords: boolean = false, ellipsis: string = '...'): string {
    if (!value) return '';

    if (value.length <= limit) {
      return value;
    }

    if (completeWords) {
      let truncated = value.slice(0, limit);
      while (truncated.length > 0 && truncated[truncated.length - 1] !== ' ' && !value.startsWith(' ', limit)) {
        truncated = truncated.slice(0, -1);
      }
      return truncated.trim() + ellipsis;
    } else {
      return value.slice(0, limit) + ellipsis;
    }
  }
}
