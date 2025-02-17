import { Module } from "@nestjs/common";
import { PermissionsService } from "./permissions.service";
import { PermissionsController } from "./permissions.controller";
import { PermissionModel } from "src/models/permission.model";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
  imports: [SequelizeModule.forFeature([PermissionModel])],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
