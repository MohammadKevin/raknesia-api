import { Controller, Get, Param, Put, Delete, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.usersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.usersService.findById(id);
  }

  @Put(':id')
  async updateProfile(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      username?: string;
      email?: string;
    },
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.usersService.updateProfile(id, body);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.usersService.deleteUser(id);
  }
}
