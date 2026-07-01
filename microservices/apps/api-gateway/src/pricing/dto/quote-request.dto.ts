import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class QuoteItemDto {
  @ApiProperty({ description: 'ID del producto del catálogo (UUID)' })
  @IsString()
  catalogProductId: string;

  @ApiProperty({ required: false, default: 1, example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}

export class QuoteRequestDto {
  @ApiProperty({ type: [QuoteItemDto], description: 'Productos de la canasta' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuoteItemDto)
  items: QuoteItemDto[];
}
