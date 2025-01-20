import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from './data-source';
import { FoodModule } from './food/food.module';
import { DayModule } from './dayInfo/day.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          ...DataSourceOptions,
          synchronize: false,
          migrationsRun: false,
          migrations: [],
        };
      },
    }),
    UserModule,
    FoodModule,
    DayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
