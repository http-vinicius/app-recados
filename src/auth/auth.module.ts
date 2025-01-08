import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Pessoa])],
  providers: [
    { provide: HashingService, useClass: BcryptService },
    AuthService,
  ],
  exports: [HashingService],
  controllers: [AuthController],
})
export class AuthModule {}
