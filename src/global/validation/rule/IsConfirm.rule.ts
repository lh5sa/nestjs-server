import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
} from "class-validator";

// 与另外一个字段是否相等
export function IsConfirm(
	field: string,
	validationOptions?: ValidationOptions,
) {
	return function (object: Record<string, any>, propertyName: string) {
		registerDecorator({
			name: "IsNotExists",
			target: object.constructor,
			propertyName: propertyName,
			constraints: [field],
			options: validationOptions,
			validator: {
				validate(value: string, args: ValidationArguments) {
					// console.info(args);
					// return false;
					return value === args.property;
				},
				defaultMessage() {
					return "two values are not equal";
				},
			},
		});
	};
}
