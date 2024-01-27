import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entity/report.entity';
import { OrderService } from 'src/order/order.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report) private readonly reportRepo: Repository<Report>,
    private orderRepo: OrderService,
    private userRepo: UserService,
  ) {}

  // Create Report
  async createReport(userId: number): Promise<Report> {
    let report: Report = new Report();
    report.totalSales = await this.orderRepo.calculateTotalSales();
    report.topSellingProduct =
      await this.orderRepo.calculateTopSellingProducts();
    return this.reportRepo.save(report);
  }

  // Get All Reports of a User
  async getAllReports(userId: number): Promise<Report[]> {
    // get user from user id
    // get all reports of that user
    const user = await this.userRepo.findById(userId);
    return this.reportRepo.find({ where: { user: user } });
  }

  // get report by day, week, month, year
  async getReportByTime(userId: number, date: Date): Promise<Report> {
    // get user from user id
    // get report of that user by time
    const user = await this.userRepo.findById(userId);
    return this.reportRepo.findOne({
      where: { user: user, createdDate: date },
    });
  }
}
