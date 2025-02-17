import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { PermissionsService } from "./permissions.service";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { PaginateData } from "src/common/decorators/paginate-data.decorator";
import { PaginateDataDto } from "src/common/dto/paginate-data.dto";
import { SearchData } from "src/common/decorators/search-data.decorator";
import { SearchPermissionDto } from "./dto/search-permission.dto";

@Controller("permissions")
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  async findAll(@PaginateData() paginateData: PaginateDataDto, @SearchData() searchData: SearchPermissionDto) {
    if (searchData.type === 3) {
      return await this.permissionsService.getPermissionTree();
    }
    return await this.permissionsService.getPermissions(paginateData, searchData);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.permissionsService.remove(+id);
  }
}
