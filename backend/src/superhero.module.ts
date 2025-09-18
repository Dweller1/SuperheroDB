import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SuperheroController } from "./superhero.controller";
import { SuperheroService } from "./superhero.service";
import { SuperheroEntity } from "./superhero.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SuperheroEntity])],
  controllers: [SuperheroController],
  providers: [SuperheroService],
})
export class SuperheroModule {}
