import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { CatalogProductEntity } from './entities/catalog-product.entity';

@Injectable()
export class CatalogServiceService {
  constructor(
    @InjectRepository(CatalogProductEntity)
    private readonly catalogProductRepository: Repository<CatalogProductEntity>,
  ) {}

  async findAll(){
    return this.catalogProductRepository.find({
      relations: {
        rawItems: true,
      },
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }
}

