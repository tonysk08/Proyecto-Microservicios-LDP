import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class ScrapingRequestDto {
  @ApiPropertyOptional({
    description: 'Supermercado a scrapear. Omitir para scrapear todos.',
    enum: ['super99', 'riba-smith', 'el-machetazo'],
    example: 'super99',
  })
  @IsOptional()
  @IsString()
  @IsIn(['super99', 'riba-smith', 'el-machetazo'])
  supermarketId?: string;
}
