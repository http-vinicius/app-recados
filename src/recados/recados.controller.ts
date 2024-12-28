import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateRecadosDto } from './entities/create-recados.dto';
import { RecadosService } from './recados.service';

@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  // Encontrar todos os recados
  @Get()
  findAll(@Query() pagination: any) {
    const { limit = 10, offset = 0 } = pagination;
    // return `This routes returns all messages. Limit=${limit} and Offset=${offset}`;
    return this.recadosService.findAll();
  }

  // Encontra um recado
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recadosService.findOne(id);
  }

  @Post()
  create(@Body() createRecadoDTO: CreateRecadosDto) {
    return this.recadosService.create(createRecadoDTO);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecadosDto: CreateRecadosDto) {
    this.recadosService.update(id, updateRecadosDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This route delete the message ID ${id}`;
  }
}
