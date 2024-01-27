import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post(':userId')
  @ApiSecurity('JWT-auth')
  //@UseGuards(JwtAuthGuard)
  create(
    @Req() req,
    @Param('userId') userId: number,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.create(+userId, createProductDto);
  }

  // get all products by user id
  @Get('/all/:userId')
  @ApiSecurity('JWT-auth')
  //@UseGuards(JwtAuthGuard)
  findAll(@Req() req, @Param('userId') userId: number) {
    return this.productService.findAll(+userId);
  }

  // get product by id and user id
  @Get(':userId/:id')
  @ApiSecurity('JWT-auth')
  //@UseGuards(JwtAuthGuard)
  findOne(
    @Req() req,
    @Param('userId') userId: number,
    @Param('id') id: number,
  ) {
    return this.productService.findOne(+id, +userId);
  }

  // update product by id and user id
  @Post('/update/:userId/:id')
  @ApiSecurity('JWT-auth')
  //@UseGuards(JwtAuthGuard)
  update(
    @Req() req,
    @Param('userId') userId: number,
    @Param('id') id: number,
    @Body() updateProduct: UpdateProductDto,
  ) {
    return this.productService.update(+id, +userId, updateProduct);
  }

  // delete product by id and user id
  @Post('/delete/:userId/:id')
  @ApiSecurity('JWT-auth')
  //@UseGuards(JwtAuthGuard)
  remove(@Req() req, @Param('userId') userId: number, @Param('id') id: number) {
    return this.productService.remove(+id, +userId);
  }
}
