import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ValidationException } from "./validation.exception";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length) {
      // throw new BadRequestException('数据验证失败')
      // 如果有错误就直接抛出异常
      throw new ValidationException(this.formatMessages(errors));
    }
    return value;
  }

  // 格式化错误信息
  formatMessages(errors: Array<any>): Array<any> {
    return errors.map((item) => {
      return {
        [item.property]: Object.values(item.constraints),
      };
    });
  }
}
