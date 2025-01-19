import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post('/getFoodByPhoto')
  @UseInterceptors(
    FileInterceptor('photo', {
      limits: { fileSize: 1024 * 1024 * 5 },
      fileFilter: (req, file, callback) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Invalid file type'), false);
        }
      },
    }),
  )
  async getPrediction(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.foodService.predictByShell(file.buffer);
  }

  @Get('/getFoodList')
  async getFoodList() {
    return this.foodService.getFoodList();
  }

  @Get('/getFoodByCanName:foodCanName')
  async getFoodByCanName(@Param('foodCanName') foodCanName: string) {
    return this.foodService.getFoodByCanName(foodCanName);
  }
}
