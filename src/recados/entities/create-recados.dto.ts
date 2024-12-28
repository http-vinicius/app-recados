import { IsString } from 'class-validator';

export class CreateRecadosDto {
  
  @IsString()
  readonly texto: string;

  readonly de: string;

  readonly para: string;
}
