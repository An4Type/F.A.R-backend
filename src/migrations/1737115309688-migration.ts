import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1737115309688 implements MigrationInterface {
    name = 'Migration1737115309688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "goal" ("id" SERIAL NOT NULL, "nutritionCalories" integer NOT NULL, "nutritionFats" integer NOT NULL, "nutritionCarbohydrates" integer NOT NULL, "nutritionProteins" integer NOT NULL, CONSTRAINT "PK_88c8e2b461b711336c836b1e130" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."food_category_enum" AS ENUM('Meat', 'Dessert', 'Salad', 'Appetizer', 'Main Dish', 'Soup', 'Snack', 'Side Dish', 'Beverage', 'Breakfast')`);
        await queryRunner.query(`CREATE TABLE "food" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "canName" character varying NOT NULL, "info" character varying NOT NULL, "photo" bytea NOT NULL, "category" "public"."food_category_enum" NOT NULL DEFAULT 'Meat', "nutritionCalories" integer NOT NULL, "nutritionFats" integer NOT NULL, "nutritionCarbohydrates" integer NOT NULL, "nutritionProteins" integer NOT NULL, CONSTRAINT "PK_26d12de4b6576ff08d30c281837" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "food_consumed" ("id" SERIAL NOT NULL, "mass" integer NOT NULL, "foodId" integer, "dayInfoId" integer, "nutritionCalories" integer NOT NULL, "nutritionFats" integer NOT NULL, "nutritionCarbohydrates" integer NOT NULL, "nutritionProteins" integer NOT NULL, CONSTRAINT "PK_2959e6399e885d562fa3df6b216" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "day_info" ("id" SERIAL NOT NULL, "date" date NOT NULL DEFAULT ('now'::text)::date, "goalId" integer, "userId" integer, "nutritionCalories" integer NOT NULL, "nutritionFats" integer NOT NULL, "nutritionCarbohydrates" integer NOT NULL, "nutritionProteins" integer NOT NULL, CONSTRAINT "PK_dd99ed44c093d36267535978622" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "food_consumed" ADD CONSTRAINT "FK_b443d7a042faf8dc40997960bc1" FOREIGN KEY ("foodId") REFERENCES "food"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "food_consumed" ADD CONSTRAINT "FK_0e383091afa84d0cf1ea6e6eb39" FOREIGN KEY ("dayInfoId") REFERENCES "day_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "day_info" ADD CONSTRAINT "FK_e3c0a583806615f84b9525cc298" FOREIGN KEY ("goalId") REFERENCES "goal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "day_info" ADD CONSTRAINT "FK_9a0ed9253feff2eb76717cb0b2c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "day_info" DROP CONSTRAINT "FK_9a0ed9253feff2eb76717cb0b2c"`);
        await queryRunner.query(`ALTER TABLE "day_info" DROP CONSTRAINT "FK_e3c0a583806615f84b9525cc298"`);
        await queryRunner.query(`ALTER TABLE "food_consumed" DROP CONSTRAINT "FK_0e383091afa84d0cf1ea6e6eb39"`);
        await queryRunner.query(`ALTER TABLE "food_consumed" DROP CONSTRAINT "FK_b443d7a042faf8dc40997960bc1"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "day_info"`);
        await queryRunner.query(`DROP TABLE "food_consumed"`);
        await queryRunner.query(`DROP TABLE "food"`);
        await queryRunner.query(`DROP TYPE "public"."food_category_enum"`);
        await queryRunner.query(`DROP TABLE "goal"`);
    }

}
