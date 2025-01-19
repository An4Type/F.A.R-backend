import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jpeg from 'jpeg-js';
import { Options, PythonShell } from 'python-shell';
import { Food } from './entities/food.entity';
import { Repository } from 'typeorm';
import { FoodConsumed } from './entities/foodConsumed.entity';
import { User } from 'src/user/entities/user.entity';
import foodMapAI from './foodMapAI.json';
import { CreateFoodConsumedDto } from './dto/create-foodConsumed.dto';

// const tf = require('@tensorflow/tfjs-node');

@Injectable()
export class FoodService implements OnModuleInit {
  private model: any;
  constructor(
    @InjectRepository(Food) private readonly foodRepository: Repository<Food>,
    @InjectRepository(FoodConsumed)
    private readonly foodConsumedRepository: Repository<FoodConsumed>,
  ) {}
  async onModuleInit() {
    // this.model = await tf.node.loadSavedModel(
    //   './model/saved_model',
    //   ['serve'],
    //   'serving_default',
    // );
  }

  async predictByShell(imageBuffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const options: Options = {
        mode: 'json',
        pythonOptions: ['-u'], // Unbuffered output
        scriptPath: './src/food', // Path to the Python script
      };

      // Convert buffer to base64 string
      const base64Image = imageBuffer.toString('base64');

      const input = { image: base64Image }; // Pass as JSON

      const pyshell = new PythonShell('python_scripts/python_ai.py', options);

      pyshell.send(input);

      pyshell.on('message', (message) => {
        resolve(message); // Return the predictions
      });

      pyshell.on('error', (error) => reject(error));
      pyshell.end((err) => {
        if (err) reject(err);
        console.log('Python script finished execution.'); // Optional log
      });
    });
  }

  async getFoodByCanName(foodCanName: string) {
    const food = await this.foodRepository.findOne({
      where: { canName: foodCanName },
    });
    if (!food)
      throw new HttpException(
        'Food with given name not found.',
        HttpStatus.NOT_FOUND,
      );
    return food;
  }

  async getFoodFromPrediction(prediction: string) {
    const foodCanName = foodMapAI[prediction];
    const food = await this.getFoodByCanName(foodCanName);
    return food;
  }

  async getFoodList() {
    return await this.foodRepository.find();
  }

  async getCreatedFoodConsumed(foodConsumedDto: CreateFoodConsumedDto) {
    const food = await this.getFoodByCanName(foodConsumedDto.foodCanName);
    const foodConsumed = FoodConsumed.fromProps({
      food,
      mass: foodConsumedDto.mass,
    });
    return foodConsumed;
  }

  async getFoodConsumedByDayInfoID(dayInfoId: number) {
    const foodConsumed = await this.foodConsumedRepository.find({
      where: { dayInfo: { id: dayInfoId } },
    });
    return foodConsumed;
  }
}
