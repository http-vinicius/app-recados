import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateRecadosDto } from './dto/create-recados.dto';
import { UpdateRecadosDto } from './dto/update-recados.dto';
import { RecadosService } from './recados.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  // Encontrar todos os recados
  @Get()
  findAll(@Query() paginatioDto: PaginationDto) {
    const recados = this.recadosService.findAll(paginatioDto);
    return this.recadosService.findAll();
  }

  // Encontra um recado
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.recadosService.findOne(id);
  }

  @Post()
  create(@Body() createRecadoDTO: CreateRecadosDto) {
    return this.recadosService.create(createRecadoDTO);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecadosDto: UpdateRecadosDto
  ) {
    return this.recadosService.update(id, updateRecadosDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recadosService.remove(id);
  }
}
