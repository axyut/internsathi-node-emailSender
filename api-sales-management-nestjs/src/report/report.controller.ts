import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('report')
@ApiTags('Report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // get Reports of a User
  @Get(':userId')
  @ApiSecurity('JWT-auth')
  //@UseGuards(JwtAuthGuard)
  Get(@Req() req, @Param('userId') userId: number) {
    return this.reportService.getAllReports(+userId);
  }

  // get Report by date, week, month, year
  @Get(':userId/:date')
  @ApiSecurity('JWT-auth')
  //@UseGuards(JwtAuthGuard)
  GetByTime(
    @Req() req,
    @Param('userId') userId: number,
    @Param('date') date: Date,
  ) {
    return this.reportService.getReportByTime(+userId, date);
  }
}
