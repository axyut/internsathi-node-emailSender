import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from 'src/product/entity/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  // create new order with userId product Id  from createOrderDto
  async create(
    userId: number,
    productId: number,
    order: CreateOrderDto,
  ): Promise<Order> {
    const user = await this.userService.findById(userId);
    const product = await this.productService.findById(productId);
    let newOrder = new Order();
    newOrder.user = user;
    newOrder.product = product;
    newOrder.name = product.name;
    newOrder.quantity = order.quantity;
    newOrder.totalAmount = product.price * order.quantity;
    const saved = await this.orderRepo.save(newOrder);
    if (saved) {
      return saved;
    }
    throw new HttpException('Cannot save order', HttpStatus.NOT_FOUND);
  }

  // find all orders by user id
  async findAll(userId: number): Promise<Order[]> {
    const user = await this.userService.findById(userId);
    const orders = await this.orderRepo.find({ where: { user: user } });
    if (orders) {
      return orders;
    }
    throw new HttpException(
      'Order with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  // find order by id and user id
  async findOne(id: number, userId: number): Promise<Order> {
    const user = await this.userService.findById(userId);
    const order = await this.orderRepo.findOne({
      where: { id: id, user: user },
    });
    if (order) {
      return order;
    }
    throw new HttpException(
      'Order with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  // delete order by id and user id
  async remove(userId: number, id: number): Promise<Order> {
    const user = await this.userService.findById(userId);
    const order = await this.orderRepo.findOne({
      where: { id: id, user: user },
    });
    if (order) {
      console.log(order);

      const deleted = await this.orderRepo.delete(order);
      if (deleted) {
        return order;
      }
    }
    throw new HttpException(
      'Order with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  // delete all orders of particular product
  async removeAllOP(productId: number): Promise<Order[]> {
    const product = await this.productService.findById(productId);
    const orders = await this.orderRepo.find({ where: { product: product } });
    if (orders) {
      const deleted = await this.orderRepo.remove(orders);
      if (deleted) {
        return orders;
      }
    }
    throw new HttpException(
      'Order with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  // Total Sales
  async calculateTotalSales(): Promise<number> {
    const orders = await this.orderRepo.find();

    let totalSales = 0;
    orders.forEach((order) => {
      totalSales += order.totalAmount;
    });

    return totalSales;
  }

  // Top Selling Products
  async calculateTopSellingProducts(): Promise<Product[]> {
    const orders = await this.orderRepo.find();

    const productsMap = {};
    orders.forEach((order) => {
      if (productsMap[order.product.id]) {
        productsMap[order.product.id].quantity += order.quantity;
      } else {
        productsMap[order.product.id] = {
          id: order.product.id,
          name: order.product.name,
          quantity: order.quantity,
        };
      }
    });

    const products: any[] = [];
    for (const id in productsMap) {
      products.push(productsMap[id]);
    }

    products.sort((a, b) => {
      return b.quantity - a.quantity;
    });

    return products.slice(0, 5);
  }
}
