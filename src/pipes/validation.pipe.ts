import {
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { PipesConsumer } from '@nestjs/core/pipes';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ClassValidatorPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('No Data Provided');
    }

    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0)
      throw new HttpException(
        'Error during validating request data',
        HttpStatus.BAD_REQUEST,
      );
    return value;
  }

  toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
