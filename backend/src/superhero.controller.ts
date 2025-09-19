import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Query,
  UsePipes,
  Patch,
  BadRequestException,
} from "@nestjs/common";
import { SuperheroService } from "./superhero.service";
import { SuperheroSchema } from "./superhero.dto";
import type { SuperheroDto } from "./superhero.dto";
import { ZodValidationPipe } from "./validation.pipe";

@Controller("superheroes")
export class SuperheroController {
  constructor(private readonly superheroService: SuperheroService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(SuperheroSchema))
  async createSuperhero(@Body() hero: SuperheroDto) {
    return this.superheroService.createSuperhero(hero);
  }

  @Get()
  async findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "5",
    @Query("search") search?: string
  ) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 5);

    return this.superheroService.findAll(pageNum, limitNum, search);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.superheroService.findOne(id);
  }

  @Put(":id")
  @UsePipes(new ZodValidationPipe(SuperheroSchema))
  async updateSuperhero(@Param("id") id: string, @Body() hero: SuperheroDto) {
    return this.superheroService.updateSuperhero(id, hero);
  }

  @Patch(":id")
  async partialUpdateSuperhero(
    @Param("id") id: string,
    @Body() updateData: Partial<SuperheroDto>
  ) {
    return this.superheroService.updateSuperhero(id, updateData);
  }

  @Delete(":id")
  async removeSuperhero(@Param("id") id: string) {
    return this.superheroService.removeSuperhero(id);
  }

  @Delete(":id/images")
  async removeImage(
    @Param("id") id: string,
    @Body("imageUrl") imageUrl: string
  ) {
    return this.superheroService.removeImage(id, imageUrl);
  }

  @Post(":id/images")
  async addImage(@Param("id") id: string, @Body("imageUrl") imageUrl: string) {
    if (!imageUrl) {
      throw new BadRequestException("Image URL is required");
    }

    // Простая валидация URL
    try {
      new URL(imageUrl);
    } catch (error) {
      throw new BadRequestException("Invalid URL format");
    }

    return this.superheroService.addImage(id, imageUrl);
  }
}
