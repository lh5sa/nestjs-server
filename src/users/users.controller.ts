import { Controller, Get, Post, Body, Patch, Param, Delete, Injectable, UsePipes, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginateDataDto } from './dto/paginate-data.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { PaginateData } from './decorators/paginate-data.decorator';
import { SearchData } from './decorators/search-data.decorator';
import { ValidationPipe } from 'src/global/validation/validation.pipe';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { UserModel } from 'src/models/user.model';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';

@Injectable()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('/update_password')
  async updatePassword(@AuthUser() authUser: UserModel, @Body() updateUserDto: UpdatePasswordDto) {
    const data: UpdateUserDto = {
      password: updateUserDto.new_password,
    };
    return await this.usersService.update(authUser.id, data);
  }

  @Post('/userroles')
  async assignRoles(@Body() assignRoles: AssignRolesDto) {
    return await this.usersService.assignRoles(assignRoles);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  async findAll(@PaginateData() paginateData: PaginateDataDto, @SearchData() searchData: SearchUserDto) {
    // 注: PaginateData 和 SearchData 是参数装饰器, 而参数装饰器默认
    // 不会执行管道, 所以要手动使用管道, 否则不会使用 dto 验证参数
    return await this.usersService.getUserInfos(paginateData, searchData, {
      getRoles: true,
    });
  }

  @Patch('/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
