import { IsNotEmpty, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRecadosDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  readonly texto: string;

  @IsPositive()
  deId: number;

  @IsPositive()
  paraId: number;
}
