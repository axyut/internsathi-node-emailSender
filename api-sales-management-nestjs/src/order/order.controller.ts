import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
@ApiTags('Order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // post new order
  @Post(':userId/:productId')
  @ApiSecurity('JWT-auth')
  //@UseGuards(JwtAuthGuard)
  create(
    @Req() req,
    @Param('userId') userId: number,
    @Param('productId') productId: number,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.create(+userId, +productId, createOrderDto);
  }

  // get all orders by user id
  @Get('/all/:userId')
  @ApiSecurity('JWT-auth')
  //@UseGuards(JwtAuthGuard)
  findAll(@Req() req, @Param('userId') userId: number) {
    return this.orderService.findAll(+userId);
  }

  // get order by id and user id
  @Get(':userId/:id')
  @ApiSecurity('JWT-auth')
  //@UseGuards(JwtAuthGuard)
  findOne(
    @Req() req,
    @Param('userId') userId: number,
    @Param('id') id: number,
  ) {
    return this.orderService.findOne(+id, +userId);
  }

  // delete order by id and user id
  @Get('/delete/:userId/:id')
  @ApiSecurity('JWT-auth')
  //@UseGuards(JwtAuthGuard)
  remove(@Req() req, @Param('userId') userId: number, @Param('id') id: number) {
    return this.orderService.remove(+id, +userId);
  }
}
