import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import jwtConfig from './config/jwt.config';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Pessoa]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [
    { provide: HashingService, useClass: BcryptService },
    AuthService,
  ],
  exports: [HashingService, JwtModule, ConfigModule],
  controllers: [AuthController],
})
export class AuthModule {}
