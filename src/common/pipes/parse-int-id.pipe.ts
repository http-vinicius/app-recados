import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // throw new Error("Method not implemented.");
    if (metadata.type !== 'param' || metadata.data !== 'id') {
      return value;
    }
    const parsedValue = Number(value);

    if (isNaN(parsedValue)) {
      throw new BadRequestException(
        'ParceIntIdPipe espera uma string numérica'
      );
    }

    if (parsedValue <= 0) {
      throw new BadRequestException(
        'ParceIntIdPipe espera um número maior que zero'
      );
    }

    return value;
  }
}
