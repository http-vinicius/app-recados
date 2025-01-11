import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';
import { CreateRecadosDto } from './dto/create-recados.dto';
import { UpdateRecadosDto } from './dto/update-recados.dto';
import { RecadosService } from './recados.service';

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

  @UseGuards(AuthTokenGuard)
  @Post()
  create(
    @Body() createRecadoDTO: CreateRecadosDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto
  ) {
    return this.recadosService.create(createRecadoDTO, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateRecadosDto: UpdateRecadosDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto
  ) {
    return this.recadosService.update(id, updateRecadosDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(
    @Param('id') id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto
  ) {
    return this.recadosService.remove(id, tokenPayload);
  }
}
