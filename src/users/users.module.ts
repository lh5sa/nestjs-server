import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModel } from "src/models/user.model";

import { UserRoleModel } from "src/models/user-role.model";
import { RoleModel } from "src/models/role.model";
import { RolePermissionModel } from "src/models/role-permission.model";
import { PermissionModel } from "src/models/permission.model";

@Module({
  imports: [SequelizeModule.forFeature([UserRoleModel, RoleModel, UserModel, PermissionModel, RolePermissionModel])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
