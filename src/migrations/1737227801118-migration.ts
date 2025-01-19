import { MigrationInterface, QueryRunner } from "typeorm";
import data from 'src/migrations/datalist.json'
import { FoodCategory } from "src/food/entities/food.entity";
import * as fs from 'fs';
import * as path from 'path';

export class Migration1737227801118 implements MigrationInterface {
    name = 'Migration1737227801118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await data.foodItems.forEach(async (val)=>{
            const imagePath = path.join(__dirname, '/FoodImages/'+val.name+'.jpg');
            const image = fs.readFileSync(imagePath);
            const normalName = val.name.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
            await queryRunner.query(`INSERT INTO food("name", "canName", "info", "category", "nutritionCalories", "nutritionFats", 
                "nutritionCarbohydrates", "nutritionProteins", "photo") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, 
                [normalName, val.name, val.info, FoodCategory[val.category], val.calories, val.fats, val.carbohydrates, val.proteins, image])
        })
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await data.foodItems.forEach(async (val)=>{
            await queryRunner.query(`DELETE FROM "food" WHERE "canName"=$1`,[val.name])
        })
    }

}
