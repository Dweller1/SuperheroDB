import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { SuperheroEntity } from "./superhero.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like, FindManyOptions } from "typeorm";
import { SuperheroDto } from "./superhero.dto";
@Injectable()
export class SuperheroService {
  constructor(
    @InjectRepository(SuperheroEntity)
    private readonly superheroRepository: Repository<SuperheroEntity>
  ) {}

  // Допоміжна функція для перетворення рядка в масив
  private parseImages(imagesString: string): string[] {
    if (!imagesString || imagesString.trim() === "") {
      return [];
    }
    return imagesString.split(",").filter((img) => img.trim() !== "");
  }

  // Допоміжна функція для перетворення масиву в рядок
  private stringifyImages(imagesArray: string[]): string {
    return imagesArray.filter((img) => img.trim() !== "").join(",");
  }

  async createSuperhero(hero: SuperheroDto) {
    try {
      const existingHero = await this.superheroRepository.findOne({
        where: { nickname: hero.nickname },
      });

      if (existingHero) {
        throw new HttpException(
          `A superhero with the nickname '${hero.nickname}' already exists`,
          HttpStatus.CONFLICT
        );
      }

      // Конвертуємо images з масиву в рядок для зберігання
      const superheroData: Partial<SuperheroEntity> = {
        nickname: hero.nickname,
        realName: hero.realName,
        originDescription: hero.originDescription,
        superpowers: hero.superpowers,
        catchPhrase: hero.catchPhrase,
        images: this.stringifyImages(hero.images || []),
      };

      const newSuperhero = this.superheroRepository.create(superheroData);
      const savedHero = await this.superheroRepository.save(newSuperhero);

      // Конвертуємо назад в масив для відповіді
      return {
        ...savedHero,
        images: this.parseImages(savedHero.images),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Failed to create superhero",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll(page: number = 1, limit: number = 5, search?: string) {
    const skip = (page - 1) * limit;
    const options: FindManyOptions<SuperheroEntity> = {
      skip,
      take: limit,
      order: { createdAt: "DESC" },
    };

    if (search) {
      options.where = [
        { nickname: Like(`%${search}%`) },
        { realName: Like(`%${search}%`) },
      ];
    }

    const [superheroes, total] = await this.superheroRepository.findAndCount(
      options
    );

    // Парсимо images для кожного супергероя
    const parsedSuperheroes = superheroes.map((hero) => ({
      ...hero,
      images: this.parseImages(hero.images),
    }));

    return {
      data: parsedSuperheroes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const superhero = await this.superheroRepository.findOne({ where: { id } });

    if (!superhero) {
      throw new HttpException(
        `Superhero with ID ${id} not found`,
        HttpStatus.NOT_FOUND
      );
    }

    // Парсимо images назад в масив
    return {
      ...superhero,
      images: this.parseImages(superhero.images),
    };
  }

  async updateSuperhero(id: string, updateData: Partial<SuperheroDto>) {
    const superhero = await this.superheroRepository.findOne({ where: { id } });

    if (!superhero) {
      throw new HttpException(
        `Superhero with ID ${id} not found`,
        HttpStatus.NOT_FOUND
      );
    }

    if (updateData.nickname && updateData.nickname !== superhero.nickname) {
      const existingHero = await this.superheroRepository.findOne({
        where: { nickname: updateData.nickname },
      });

      if (existingHero) {
        throw new HttpException(
          `A superhero with the nickname '${updateData.nickname}' already exists`,
          HttpStatus.CONFLICT
        );
      }
    }

    // Створюємо об'єкт для оновлення з правильними типами
    const updateEntity: Partial<SuperheroEntity> = {};

    // Копіюємо поля, які потрібно оновити
    if (updateData.nickname !== undefined)
      updateEntity.nickname = updateData.nickname;
    if (updateData.realName !== undefined)
      updateEntity.realName = updateData.realName;
    if (updateData.originDescription !== undefined)
      updateEntity.originDescription = updateData.originDescription;
    if (updateData.superpowers !== undefined)
      updateEntity.superpowers = updateData.superpowers;
    if (updateData.catchPhrase !== undefined)
      updateEntity.catchPhrase = updateData.catchPhrase;

    // Конвертуємо images якщо вони є в updateData
    if (updateData.images !== undefined) {
      updateEntity.images = this.stringifyImages(updateData.images);
    }

    // Оновлюємо сутність
    Object.assign(superhero, updateEntity);
    const updatedHero = await this.superheroRepository.save(superhero);

    return {
      ...updatedHero,
      images: this.parseImages(updatedHero.images),
    };
  }

  async removeSuperhero(id: string) {
    const deleteResult = await this.superheroRepository.delete(id);

    if (deleteResult.affected === 0) {
      throw new HttpException(
        `Superhero with ID ${id} not found`,
        HttpStatus.NOT_FOUND
      );
    }

    return { message: `Superhero with ID ${id} successfully deleted` };
  }

  async addImage(id: string, imageUrl: string) {
    const superhero = await this.superheroRepository.findOne({ where: { id } });

    if (!superhero) {
      throw new HttpException(
        `Superhero with ID ${id} not found`,
        HttpStatus.NOT_FOUND
      );
    }

    const currentImages = this.parseImages(superhero.images);

    // Перевіряємо, чи вже існує таке зображення
    if (!currentImages.includes(imageUrl)) {
      const updatedImages = [...currentImages, imageUrl];
      superhero.images = this.stringifyImages(updatedImages);
      const updatedHero = await this.superheroRepository.save(superhero);

      return {
        ...updatedHero,
        images: this.parseImages(updatedHero.images),
      };
    }

    // Якщо зображення вже існує, повертаємо поточний стан
    return {
      ...superhero,
      images: currentImages,
    };
  }

  async removeImage(id: string, imageUrl: string) {
    const superhero = await this.superheroRepository.findOne({ where: { id } });

    if (!superhero) {
      throw new HttpException(
        `Superhero with ID ${id} not found`,
        HttpStatus.NOT_FOUND
      );
    }

    const currentImages = this.parseImages(superhero.images);
    const updatedImages = currentImages.filter((img) => img !== imageUrl);

    // Перевіряємо, чи щось змінилося
    if (updatedImages.length !== currentImages.length) {
      superhero.images = this.stringifyImages(updatedImages);
      const updatedHero = await this.superheroRepository.save(superhero);

      return {
        ...updatedHero,
        images: this.parseImages(updatedHero.images),
      };
    }

    // Якщо зображення не знайдено, повертаємо поточний стан
    return {
      ...superhero,
      images: currentImages,
    };
  }
}
