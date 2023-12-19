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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LocalAuthGuard } from './guard/local-auth-guard';
import { Public } from './decorator/public-decorator';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Oauth2LoginDto } from './dto/oauth2-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    return await this.authService.login(loginAuthDto);
  }
  @Public()
  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refresh(refreshTokenDto);
  }

  @Public()
  @Post('oauth2/login')
  async oauth2Login(@Body() oauth2LoginDto: Oauth2LoginDto) {
    return await this.authService.oauth2Login(oauth2LoginDto);
  }

  @Public()
  @Get('getUpdateAccountTokenByOTP')
  async getUpdateAccountTokenByOTP(
    @Query('email') email: string,
    @Query('otp') otp: string,
  ) {
    return await this.authService.getUpdateAccountTokenByOTP(email, otp);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return await this.authService.update(+id, updateAuthDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
