import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { Category } from './category.entity'
import CreateCategoryDto from './dto/create-category.dto'
import JwtAuthenticationGuard from '../auth/guards/jwt-authentication.guard'
import UpdateCategoryDto from './dto/update-category.dto'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getAllCategories(): Promise<Category[]> {
    return this.categoriesService.getAllCategories()
  }

  @Get(':id')
  getCategoryById(id: number): Promise<Category> {
    return this.categoriesService.getCategoryById(id)
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryDto)
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  async updateCategory(updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return this.categoriesService.updateCategory(updateCategoryDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  async deleteCategory(id: number): Promise<void> {
    return this.categoriesService.deleteCategory(id)
  }
}
