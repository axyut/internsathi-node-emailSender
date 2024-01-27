import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from './entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { User } from 'src/user/entity/user.entity';
import { UserService } from '../user/user.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { OrderService } from '../order/order.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private userService: UserService,
  ) {}

  // create new product
  async create(
    userId: number,
    createProduct: CreateProductDto,
  ): Promise<Product> {
    let product: Product = new Product();
    product.name = createProduct.name;
    product.description = createProduct.description;
    product.price = createProduct.price;
    product.category = createProduct.category;
    product.availablity = createProduct.availablity;
    product.user = await this.userService.findById(userId);

    const saved = await this.productRepo.save(product);
    if (saved) {
      return saved;
    }
    throw new HttpException('Cannot save product', HttpStatus.NOT_FOUND);
  }

  // find all products by user id
  async findAll(userId: number): Promise<Product[]> {
    const user = await this.userService.findById(userId);
    const products = await this.productRepo.find({ where: { user: user } });
    if (products) {
      return products;
    }
    throw new HttpException(
      'Product with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  // find product by id and user id
  async findOne(id: number, userId: number): Promise<Product> {
    const user = await this.userService.findById(userId);
    const product = await this.productRepo.findOne({
      where: { id: id, user: user },
    });
    if (product) {
      return product;
    }
    throw new HttpException(
      'Product with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  // update product by id and user id
  async update(
    id: number,
    userId: number,
    updateProduct: UpdateProductDto,
  ): Promise<Product> {
    const user = await this.userService.findById(userId);
    const product = await this.productRepo.findOne({
      where: { id: id, user: user },
    });

    if (product) {
      product.name = updateProduct.name;
      product.description = updateProduct.description;
      product.price = updateProduct.price;
      product.availablity = updateProduct.availablity;

      const updated = await this.productRepo.update(id, product);
      if (updated) {
        return product;
      }
    }
    throw new HttpException(
      'Product with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  // remove product by id and user id
  async remove(id: number, userId: number): Promise<void> {
    const user = await this.userService.findById(userId);
    const product = await this.productRepo.findOne({
      where: { id: id, user: user },
    });
    if (product) {
      // delete order first if exists
      // await this.orderService.removeAllOP(id);

      await this.productRepo.delete(id);
      return;
    }
    throw new HttpException(
      'Product with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  // find product by id
  async findById(id: number): Promise<Product> {
    return await this.productRepo.findOne({ where: { id: id } });
  }
}
