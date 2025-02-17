import { applyDecorators, UnsupportedMediaTypeException, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

//上传类型验证
export function fileFilter(type: string) {
  return (_req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    if (!file.mimetype.includes(type)) {
      callback(new UnsupportedMediaTypeException("文件类型错误"), false);
    } else {
      callback(null, true);
    }
  };
}

// 上传文件大小限制(单位: M)
export function limits(size: number): { fileSize: number } {
  return {
    fileSize: Math.pow(1024, 2) * size,
  };
}

//文件上传
export function Upload(field = "file", options: MulterOptions) {
  return applyDecorators(UseInterceptors(FileInterceptor(field, options)));
}

//图片上传
export function UploadImage(field = "file") {
  return Upload(field, {
    limits: limits(2),
    fileFilter: fileFilter("image"),
  });
}

//文档上传
export function UploadDocument(field = "file") {
  return Upload(field, {
    limits: limits(5),
    fileFilter: fileFilter("document"),
  });
}

// 上传音/视屏频
export function UploadVideo(filed = "file") {
  return Upload(filed, {
    limits: limits(10),
    fileFilter: fileFilter("video"),
  });
}
export function UploadAudio(filed = "file") {
  return Upload(filed, {
    limits: limits(10),
    fileFilter: fileFilter("audio"),
  });
}
