import { PartialType } from '@nestjs/mapped-types';
import { CreateRecadosDto } from './create-recados.dto';

export class UpdateRecadosDto extends PartialType(CreateRecadosDto) {}
