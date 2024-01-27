import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Product } from 'src/product/entity/product.entity';

@Entity()
export class Order {
  // Unique ID
  @PrimaryGeneratedColumn({})
  id: number;

  @Column()
  name: string;

  @Column()
  totalAmount: number;

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  // many orders to one user relationship
  @ManyToOne((type) => User, (user) => user.orders)
  user: User;

  // many orders to one product relationship
  @ManyToOne((type) => Product, (product) => product.orders)
  product: Product;
}
