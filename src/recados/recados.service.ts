import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Repository } from 'typeorm';
import { PessoasService } from './../pessoas/pessoas.service';
import { CreateRecadosDto } from './dto/create-recados.dto';
import { UpdateRecadosDto } from './dto/update-recados.dto';
import { Recado } from './entities/recado.entity';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
    private readonly pessoasService: PessoasService
  ) {}

  throwNotFoundError() {
    throw new NotFoundException('Recado não encontrado');
  }

  async findAll(paginationDto?: PaginationDto) {
    // console.log('RecadosService findAll executado');
    const { limit = 10, offset = 0 } = paginationDto;

    const recados = await this.recadoRepository.find({
      take: limit, // limite a ser exibido
      skip: offset, // quantos registros pular
      relations: ['de', 'para'],
      order: {
        id: 'desc',
      },
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });
    return recados;
  }

  async findOne(id: number) {
    const recado = await this.recadoRepository.findOne({
      where: {
        id,
      },
      relations: ['de', 'para'],
      order: {
        id: 'desc',
      },
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });

    if (recado) return recado;
    this.throwNotFoundError();
  }

  async create(createRecado: CreateRecadosDto, tokenPayload: TokenPayloadDto) {
    const { paraId } = createRecado;
    // Encontrar a pessoa que está criando o recado
    const de = await this.pessoasService.findOne(tokenPayload.sub);
    // Encontrar a pessoa para quem o recado está sendo enviado
    const para = await this.pessoasService.findOne(paraId);

    const novoRecado = {
      texto: createRecado.texto,
      de,
      para,
      lido: false,
      data: new Date(),
    };

    const recado = await this.recadoRepository.create(novoRecado);
    await this.recadoRepository.save(recado);

    return {
      ...recado,
      de: {
        id: recado.de.id,
        nome: recado.de.nome,
      },
      para: {
        id: recado.para.id,
        nome: recado.para.nome,
      },
    };
  }

  async update(
    id: number,
    updateRecadosDto: UpdateRecadosDto,
    tokenPayload: TokenPayloadDto
  ) {
    const recado = await this.findOne(id);

    if (recado.de.id !== tokenPayload.sub) {
      throw new ForbiddenException('Esse recado não é seu');
    }

    recado.texto = updateRecadosDto?.texto ?? recado.texto;
    recado.lido = updateRecadosDto?.lido ?? recado.lido;
    if (!recado) return this.throwNotFoundError();

    await this.recadoRepository.save(recado);
    return recado;
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const recado = await this.findOne(id);

    if (recado.de.id !== tokenPayload.sub) {
      throw new ForbiddenException('Esse recado não é seu');
    }

    if (!recado) return this.throwNotFoundError();

    return this.recadoRepository.remove(recado);
  }
}
