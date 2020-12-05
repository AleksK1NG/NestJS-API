import { EntityRepository, Repository } from 'typeorm'
import { Category } from './category.entity'
import CategoryNotFoundException from './exceptions/categoryNotFound.exception'
import CreateCategoryDto from './dto/create-category.dto'
import UpdateCategoryDto from './dto/update-category.dto'

@EntityRepository(Category)
export class CategoriesRepository extends Repository<Category> {
  async getAllCategories(): Promise<Category[]> {
    return this.find({ relations: ['posts'] })
  }

  async getCategoryById(id: number): Promise<Category> {
    const category = await this.findOne(id, { relations: ['posts'] })
    if (!category) throw new CategoryNotFoundException(id)
    return category
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.create(createCategoryDto)
    return this.save(category)
  }

  async updateCategory(updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const updatedCategory = await this.preload({
      ...updateCategoryDto,
    })
    if (!updatedCategory) throw new CategoryNotFoundException(updateCategoryDto.id)
    return updatedCategory
  }

  async deleteCategory(id: number): Promise<void> {
    const result = await this.delete({ id })
    if (result.affected === 0) throw new CategoryNotFoundException(id)
  }
}
