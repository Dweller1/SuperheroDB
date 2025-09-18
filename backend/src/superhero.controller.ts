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
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from "@nestjs/common";
import { SuperheroService } from "./superhero.service";
import { SuperheroSchema } from "./superhero.dto";
import type { SuperheroDto } from "./superhero.dto";
import { ZodValidationPipe } from "./validation.pipe";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

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
    @Query("page") page: string = "1", // Отримуємо як рядок
    @Query("limit") limit: string = "5", // Отримуємо як рядок
    @Query("search") search?: string
  ) {
    // Перетворюємо рядки на числа з перевіркою
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
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          callback(
            null,
            file.fieldname + "-" + uniqueSuffix + extname(file.originalname)
          );
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
        const ext = allowedTypes.test(extname(file.originalname).toLowerCase());
        const mime = allowedTypes.test(file.mimetype);

        if (mime && ext) {
          return callback(null, true);
        } else {
          callback(new Error("Непідтримуваний формат зображення"), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    })
  )
  async addImage(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    // Тут обробка файлу - збереження шляху до файлу в базу даних
    const imageUrl = `/uploads/${file.filename}`;
    return this.superheroService.addImage(id, imageUrl);
  }
}
