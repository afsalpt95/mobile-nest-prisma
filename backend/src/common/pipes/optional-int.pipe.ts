import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class OptionalIntPipe implements PipeTransform {
  transform(value: string | undefined) {
    if (!value) return undefined;

    const parsed = Number(value);

    if (isNaN(parsed)) return undefined;

    return parsed;
  }
}