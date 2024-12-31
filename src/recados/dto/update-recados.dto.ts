import { PartialType } from '@nestjs/mapped-types';
import { CreateRecadosDto } from './create-recados.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateRecadosDto extends PartialType(CreateRecadosDto) {
  @IsBoolean()
  @IsOptional()
  readonly lido?: boolean;
}
