import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Public } from '../auth/decorator/public-decorator';
import { RolesGuard } from 'src/auth/guard/role-auth-guard';
import { Roles } from 'src/auth/decorator/roles-decorator';
import { UpdateAccountByAdminDto } from './dto/update-account-byAdmin.dto';
import { FindAllAccountDto } from './dto/findAll-account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @Public()
  async create(@Body() createAccountDto: CreateAccountDto) {
    return await this.accountService.create(createAccountDto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get()
  async findAll(@Query() findAllAccountDto: FindAllAccountDto) {
    return this.accountService.findAll(findAllAccountDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  @Public()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return await this.accountService.update(+id, updateAccountDto);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch('updateByAdmin/:id')
  async updateByAdmin(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountByAdminDto,
  ) {
    return await this.accountService.updateByAdmin(+id, updateAccountDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.accountService.remove(+id);
  }
}
