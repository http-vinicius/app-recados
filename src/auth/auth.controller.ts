import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServie: AuthService) {}

  @Post()
  login(@Body() loginDto: LoginDto) {
    return this.authServie.login(loginDto);
  }
}
