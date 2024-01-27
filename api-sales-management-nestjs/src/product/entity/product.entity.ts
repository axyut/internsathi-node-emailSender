import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Order } from 'src/order/entity/order.entity';

export enum Category {
  OTHERS = 'others',
  KIDS = 'kids',
  MENS = 'mens',
  WOMENS = 'womens',
}

@Entity()
export class Product {
  // Unique ID
  @PrimaryGeneratedColumn({})
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ type: 'enum', enum: Category, default: Category.OTHERS })
  category: string;

  @Column()
  availablity: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // many products to one user relationship
  @ManyToOne((type) => User, (user) => user.products)
  user: User;

  // one product to many orders relationship
  @OneToMany((type) => Order, (order) => order.product)
  orders: Order[];
}
