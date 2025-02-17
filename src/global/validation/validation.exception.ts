import { HttpException, HttpStatus } from "@nestjs/common";

// 自定义验证失败异常
export class ValidationException extends HttpException {
	constructor(response: any) {
		super(response, HttpStatus.UNPROCESSABLE_ENTITY); // 422
	}
}
