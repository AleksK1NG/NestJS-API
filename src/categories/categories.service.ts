import { Injectable } from '@nestjs/common'
import { CategoriesRepository } from './categories.repository'
import { Category } from './category.entity'
import CreateCategoryDto from './dto/create-category.dto'
import UpdateCategoryDto from './dto/update-category.dto'

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.getAllCategories()
  }

  async getCategoryById(id: number): Promise<Category> {
    return this.categoriesRepository.getCategoryById(id)
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesRepository.createCategory(createCategoryDto)
  }

  async updateCategory(id: number, category: UpdateCategoryDto): Promise<Category> {
    return this.categoriesRepository.updateCategory(id, category)
  }

  async deleteCategory(id: number): Promise<void> {
    return this.categoriesRepository.deleteCategory(id)
  }
}
