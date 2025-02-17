import { Module } from "@nestjs/common";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { PermissionModel } from "src/models/permission.model";
import { RolePermissionModel } from "src/models/role-permission.model";
import { RoleModel } from "src/models/role.model";
import { UserRoleModel } from "src/models/user-role.model";
import { UserModel } from "src/models/user.model";

@Module({
  imports: [SequelizeModule.forFeature([UserRoleModel, RoleModel, UserModel, PermissionModel, RolePermissionModel])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
