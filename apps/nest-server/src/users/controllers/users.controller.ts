import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CreateUserDto,
  CreateUserProfileDto,
  CreateUserPostDto,
} from 'src/users/dtos/CreateUser.dtos';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dtos';
import { UsersService } from 'src/users/services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
    @Body() updateUserDto: UpdateUserDto,
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

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

  @Post(':id/profile')
  createProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserProfileDto: CreateUserProfileDto,
  ) {
    // eslint-disable-next-line
    return this.usersService.createUserProfile( id , createUserProfileDto);
  }

  @Post(':id/posts')
  createPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserPostDto: CreateUserPostDto,
  ) {
    // eslint-disable-next-line
    return this.usersService.createUserPost( id , createUserPostDto);
  }

  @Get(':id/posts')
  getUserPosts(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUserPosts(id);
  }
}
