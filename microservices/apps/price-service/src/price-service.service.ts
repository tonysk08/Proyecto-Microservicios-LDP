import { Injectable,HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceHistoryEntity } from './entities/price-history.entity';


@Injectable()
export class PriceServiceService {

  // Regex estándar para validar UUID v4
  private readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  constructor(
    @InjectRepository(PriceHistoryEntity)
    private readonly priceHistoryRepository: Repository<PriceHistoryEntity>,
  ) {}

  async getPriceHistory(productId: string): Promise<PriceHistoryEntity[]> {

    if (!this.UUID_REGEX.test(productId)) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Invalid UUID format: ${productId}`,
      });
    }

    const pricelist = await this.priceHistoryRepository.find({
      where: { productId },
      order: { capturedAt: 'DESC' },
    });

    if(!pricelist) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No PriceHistory found for product with id ${productId}`,
      });
    }

    return pricelist;
  }
}
