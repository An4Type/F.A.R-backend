import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import FormData from 'form-data';
import * as streamifier from 'streamifier';

@Controller('food')
export class FoodController {
  constructor(
    private readonly foodService: FoodService,
    private readonly httpService: HttpService,
  ) {}

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
  async getPrediction(@UploadedFile() file: Express.Multer.File, @Res() res) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    try {
      const form = new FormData();
      const fileStream = streamifier.createReadStream(file.buffer);

      form.append('image', fileStream, {
        filename: 'image.jpg',
        contentType: file.mimetype,
      });

      const headers = form.getHeaders();
      const flaskResponse: AxiosResponse<any> = await this.httpService
        .post(
          'http://flask:5000/predict', // Flask server URL
          form, // Form data containing the file
          { headers }, // Multipart headers
        )
        .toPromise();
      res.json(
        await this.foodService.getFoodFromPrediction(
          flaskResponse.data.predicted_ind,
        ),
      );
    } catch (error) {
      console.error('Error communicating with Flask:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    // return this.foodService.predictByShell(file.buffer);
  }

  @Get('/getFoodList')
  async getFoodList() {
    return this.foodService.getFoodList();
  }

  @Get('/getFoodByCanName/:foodCanName')
  async getFoodByCanName(@Param('foodCanName') foodCanName: string) {
    return this.foodService.getFoodByCanName(foodCanName);
  }
}
