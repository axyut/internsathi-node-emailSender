import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/user/entity/user.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdDate: Date;

  // Report Calculations
  @Column({ default: 0 })
  totalSales: number;

  @Column('simple-json')
  topSellingProduct: {};

  // @Column('simple-array')
  // topSellingProduct: string[];

  // many reports to one user relationship
  @ManyToOne((type) => User, (user) => user.reports)
  user: User;

  // constructor(private readonly reportService: ReportService) {}

  // @BeforeInsert()
  // async calculateTotalSales(): Promise<void> {
  //   this.totalSales = await this.reportService.calculateTotalSales();
  // }

  // @BeforeInsert()
  // async calculateTopSellingProduct(): Promise<void> {
  //   this.topSellingProduct =
  //     await this.reportService.calculateTopSellingProducts();
  // }
}
