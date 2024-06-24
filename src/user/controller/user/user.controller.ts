import { Controller, Post, Body, Get, Param, Put, Delete, Res, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from 'src/user/service/user/user.service';
import { User } from 'src/user/model/user/user.model';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() user: User, @Res() res: Response) {
    try {
      const newUser = this.userService.createUser(user);
      return res.status(HttpStatus.CREATED).json({
        success: true,
        error: false,
        message: 'User added successfully',
        data: newUser,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        const response = error.getResponse();
        const status = error.getStatus();
        return res.status(status).json(response);
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: true,
        message: 'Internal server error',
      });
    }
  }

  @Get()
  async findAllUsers(@Res() res: Response) {
    const users = this.userService.findAllUsers();
    return res.status(HttpStatus.OK).json(users);
  }

  @Get(':id')
  async findUserById(@Param('id') id: string, @Res() res: Response) {
    const user = this.userService.findUserById(parseInt(id, 10));
    if (user) {
      return res.status(HttpStatus.OK).json(user);
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        error: true,
        message: 'User not found',
      });
    }
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updatedUser: User, @Res() res: Response) {
    const user = this.userService.updateUser(parseInt(id, 10), updatedUser);
    if (user) {
      return res.status(HttpStatus.OK).json({
        success: true,
        error: false,
        message: 'User updated successfully',
        data: user,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        error: true,
        message: 'User not found',
      });
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    const user = this.userService.deleteUser(parseInt(id, 10));
    if (user) {
      return res.status(HttpStatus.OK).json({
        success: true,
        error: false,
        message: 'User deleted successfully',
        data: user,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        error: true,
        message: 'User not found',
      });
    }
  }
}
