import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { Category } from './category.entity'
import CreateCategoryDto from './dto/create-category.dto'
import JwtAuthenticationGuard from '../auth/guards/jwt-authentication.guard'
import UpdateCategoryDto from './dto/update-category.dto'

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories(): Promise<Category[]> {
    return this.categoriesService.getAllCategories()
  }

  @Get(':id')
  getCategoryById(@Param('id', ParseIntPipe) id): Promise<Category> {
    return this.categoriesService.getCategoryById(id)
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryDto)
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  async updateCategory(@Param('id', ParseIntPipe) id, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return this.categoriesService.updateCategory(id, updateCategoryDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  async deleteCategory(@Param('id', ParseIntPipe) id): Promise<void> {
    return this.categoriesService.deleteCategory(id)
  }
}
