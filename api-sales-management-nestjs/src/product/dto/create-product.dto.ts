import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean } from 'class-validator';

// validation for category enum
export const Category = {
  OTHERS: 'others',
  KIDS: 'kids',
  MENS: 'mens',
  WOMENS: 'womens',
};

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  // category from enum
  @ApiProperty({ enum: Category })
  @IsString()
  category: (typeof Category)[keyof typeof Category];

  @ApiProperty()
  @IsBoolean()
  availablity: boolean;
}
