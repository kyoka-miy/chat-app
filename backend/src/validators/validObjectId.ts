import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import { ObjectId } from "mongodb";

export function ValidObjectId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "validObjectId",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          return ObjectId.isValid(value);
        },
        defaultMessage(_args: ValidationArguments) {
          return "$property must be a valid MongoDB ObjectId";
        }
      }
    });
  };
}