import { Controller, UploadedFile, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { fileFilter, limits, Upload } from "./upload.decorator";
import { UploadService } from "./upload.service";

@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService, private readonly config: ConfigService) {}

  @Upload("file", {
    limits: limits(5), // 最大 5m
    fileFilter: fileFilter("image"), // 图片类型
  })
  @Post("/avatar")
  avatar(@UploadedFile() file: Express.Multer.File) {
    const uploadUrl = this.config.get("UPLOAD_URL");
    const url = `${uploadUrl}/${file.filename}`;
    return {
      url,
    };
  }
}
