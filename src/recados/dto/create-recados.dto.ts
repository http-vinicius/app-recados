import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRecadosDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  readonly texto: string;
}
