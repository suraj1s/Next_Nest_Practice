import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dtos';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.findUsers();
  }

  @Get(':id')
  // ParseIntPipe is a built-in pipe that will parse the id parameter to a number
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUserById(id);
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: CreateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    // eslint-disable-next-line
    const { confirmPassword, ...userDetail } = createUserDto;
    console.log(userDetail, confirmPassword);
    return this.usersService.createUser(userDetail);
  }
}
