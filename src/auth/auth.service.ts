import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import { Repository } from 'typeorm';
import jwtConfig from './config/jwt.config';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { HashingService } from './hashing/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto) {
    const pessoa = await this.pessoaRepository.findOneBy({
      email: loginDto.email,
    });

    if (!pessoa) {
      throw new UnauthorizedException('Pessoa não existe.');
    }

    const passwordIsValid = await this.hashingService.compare(
      loginDto.password,
      pessoa.passwordHash
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Senha inválida!');
    }

    return this.createTokens(pessoa);
  }

  private async createTokens(pessoa: Pessoa) {
    // Aqui é a forma não performática, pois está gerando os tokens um de cada vez
    // const acessToken = await this.signJwtAsync<Partial<Pessoa>>(
    //   pessoa.id,
    //   Number(this.jwtConfiguration.jwtTtl),
    //   { email: pessoa.email }
    // );

    // const refreshToken = await this.signJwtAsync(
    //   pessoa.id,
    //   this.jwtConfiguration.jwtRefreshTtl
    // );

    // Dessa forma resolvendo as duas Promises de uma vez, não exige tanto processamento quanto da forma anterior
    const acessTokenPromise = this.signJwtAsync<Partial<Pessoa>>(
      pessoa.id,
      Number(this.jwtConfiguration.jwtTtl),
      { email: pessoa.email }
    );

    const refreshTokenPromise = this.signJwtAsync(
      pessoa.id,
      this.jwtConfiguration.jwtRefreshTtl
    );

    const [acessToken, refreshToken] = await Promise.all([
      acessTokenPromise,
      refreshTokenPromise,
    ]);

    return {
      acessToken,
      refreshToken,
    };
  }

  private async signJwtAsync<T>(sub: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      }
    );
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        this.jwtConfiguration
      );
      const pessoa = await this.pessoaRepository.findOneBy({
        id: sub,
      });

      if (!pessoa) {
        throw new Error('Pessoa não encontrada.');
      }

      return this.createTokens(pessoa);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
