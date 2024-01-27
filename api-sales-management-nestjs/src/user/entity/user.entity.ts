import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../product/entity/product.entity';
import { Order } from '../../order/entity/order.entity';
import { Report } from '../../report/entity/report.entity';

@Entity()
export class User {
  // Unique ID
  @PrimaryGeneratedColumn({})
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'NORMAL' })
  role: string;

  // one to many with products
  @OneToMany((type) => Product, (product) => product.user)
  products: Product[];

  // one to many with orders
  @OneToMany((type) => Order, (order) => order.user)
  orders: Order[];

  // one to many with report
  @OneToMany((type) => Report, (report) => report.user)
  reports: Order[];
}
