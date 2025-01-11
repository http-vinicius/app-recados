import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Repository } from 'typeorm';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Pessoa } from './entities/pessoa.entity';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private readonly hashingService: HashingService
  ) {}

  async create(createPessoaDto: CreatePessoaDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createPessoaDto.password
      );
      const dadosPessoa = {
        nome: createPessoaDto.nome,
        passwordHash,
        email: createPessoaDto.email,
      };

      const novaPessoa = this.pessoaRepository.create(dadosPessoa);
      await this.pessoaRepository.save(novaPessoa);
      return novaPessoa;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('E-mail já cadastrado');
      }
      throw error;
    }
  }

  async findAll() {
    const pessoas = await this.pessoaRepository.find();
    return pessoas;
  }

  async findOne(id: number) {
    const pessoas = await this.pessoaRepository.findOne({
      where: { id },
    });
    return pessoas;
  }

  async update(
    id: number,
    updatePessoaDto: UpdatePessoaDto,
    tokenPayload: TokenPayloadDto
  ) {
    const dadosPessoa = {
      nome: updatePessoaDto?.nome,
    };

    if (updatePessoaDto?.password) {
      const passwordHash = await this.hashingService.hash(
        updatePessoaDto.password
      );

      dadosPessoa['passwordHash'] = passwordHash;
    }

    const pessoa = await this.pessoaRepository.preload({ id, ...dadosPessoa });

    if (!pessoa) throw new NotFoundException('Pessoa não encontrada');

    if (pessoa.id !== tokenPayload.sub) {
      throw new ForbiddenException('Você não é essa pessoa.');
    }

    return this.pessoaRepository.save(pessoa);
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const pessoa = await this.pessoaRepository.findOneBy({ id });

    if (pessoa.id !== tokenPayload.sub) {
      throw new ForbiddenException('Você não é essa pessoa.');
    }

    if (!pessoa) throw new NotFoundException('Pessoa não encontrada');

    return this.pessoaRepository.remove(pessoa);
  }
}
