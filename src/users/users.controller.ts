import { AuthUser } from "src/auth/decorators/auth-user.decorator";
import { PaginateData } from "src/common/decorators/paginate-data.decorator";
import { SearchData } from "src/common/decorators/search-data.decorator";
import { PaginateDataDto } from "src/common/dto/paginate-data.dto";
import { ValidationPipe } from "src/global/validation/validation.pipe";
import { UserModel } from "src/models/user.model";
import { AssignRolesDto } from "./dto/assign-roles.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";
import { SearchUserDto } from "./dto/search-user.dto";
import { SkipRbac } from "src/auth/decorators/skip-auth.decorator";
import { Body, Controller, Delete, Get, Injectable, Param, ParseIntPipe, Patch, Post, UsePipes } from "@nestjs/common";

@Injectable()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SkipRbac()
  @Patch("/update_password")
  async updatePassword(@AuthUser() authUser: UserModel, @Body() updateUserDto: UpdatePasswordDto) {
    return await this.usersService.updatePassword(authUser.id, updateUserDto);
  }

  @Post("/userroles")
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

  @Patch("/:id")
  update(@Param("id", ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
