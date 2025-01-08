import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';
import { AuthTokenInterceptor } from 'src/common/interceptors/auth-token.interceptor';
import { CreateRecadosDto } from './dto/create-recados.dto';
import { UpdateRecadosDto } from './dto/update-recados.dto';
import { RecadosService } from './recados.service';

@UseInterceptors(AuthTokenInterceptor)
@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  // Encontrar todos os recados
  @Get()
  async findAll(@Query() paginatioDto: PaginationDto) {
    // console.log('RecadosController findAll executado');
    const recados = this.recadosService.findAll(paginatioDto);
    return recados;
  }

  // Encontra um recado
  @UseInterceptors(AddHeaderInterceptor)
  @Get(':id')
  findOne(@Param('id') id: number) {
    console.log(id, typeof id);
    return this.recadosService.findOne(id);
  }

  @Post()
  create(@Body() createRecadoDTO: CreateRecadosDto) {
    return this.recadosService.create(createRecadoDTO);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRecadosDto: UpdateRecadosDto) {
    return this.recadosService.update(id, updateRecadosDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.recadosService.remove(id);
  }
}
