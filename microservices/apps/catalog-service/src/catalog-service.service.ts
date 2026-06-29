import { Injectable,HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { CatalogProductEntity } from './entities/catalog-product.entity';

@Injectable()
export class CatalogServiceService {

  // Regex estándar para validar UUID v4
  private readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  constructor(
    @InjectRepository(CatalogProductEntity)
    private readonly catalogProductRepository: Repository<CatalogProductEntity>,
  ) {}

  async findAll(
    options: {
      page?: number;
      limit?: number;
      category?: string;
      isActive?: boolean;
      includeRaw?: boolean;
    } = {},
  ) {
    const { category, isActive = true, includeRaw = false } = options;

    // Saneo de paginación: page >= 1, 1 <= limit <= 100
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(options.limit) || 20));

    const query = this.catalogProductRepository
      .createQueryBuilder('p')
      .where('p.isActive = :isActive', { isActive });

    if (includeRaw) {
      query.leftJoinAndSelect('p.rawItems', 'raw');
    }

    if (category) {
      query.andWhere('LOWER(p.category) = LOWER(:category)', { category });
    }

    const [items, total] = await query
      .orderBy('p.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async searchProducts(query: string) {
  return this.catalogProductRepository
    .createQueryBuilder('product')
    .where(
      'LOWER(product.name) LIKE LOWER(:query)',
      {
        query: `%${query}%`,
      },
    )
    .getMany();
  }

  async findById(id: string): Promise<CatalogProductEntity> {

      // Validar formato UUID antes de consultar
    if (!this.UUID_REGEX.test(id)) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Invalid UUID format: ${id}`,
      });
    }

    const product = await this.catalogProductRepository.findOne({
      where: { 
        id,
        isActive: true 
      },
      relations: {
        rawItems: true,
      },
    });
    if(!product) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Product with id ${id} not found`,
      });
    }
    return product;
  }
  
  async deactivateCatalog(id: string){
    // Validar formato UUID antes de consultar
    if (!this.UUID_REGEX.test(id)) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Invalid UUID format: ${id}`,
      });
    }

    const product = await this.catalogProductRepository.findOne({ where: { id } });

    if(!product) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Product with id ${id} not found`,
      });
    }

    product.isActive = false;
    await this.catalogProductRepository.save(product);

    return {
      id: product.id,
      isActive: product.isActive,
      message: `Product with id ${id} has been deactivated successfully`,
    };
  }

  async activateCatalog(id: string){
    // Validar formato UUID antes de consultar
    if (!this.UUID_REGEX.test(id)) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Invalid UUID format: ${id}`,
      });
    }

    const product = await this.catalogProductRepository.findOne({ where: { id } });

    if(!product) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Product with id ${id} not found`,
      });
    }

    product.isActive = true;
    await this.catalogProductRepository.save(product);

    return {
      id: product.id,
      isActive: product.isActive,
      message: `Product with id ${id} has been activated successfully`,
    };
  }

  async removeCatalog(id: string) {
    if (!this.UUID_REGEX.test(id)) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Invalid UUID format: ${id}`,
      });
    }

    const product = await this.catalogProductRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Product with id ${id} not found`,
      });
    }

    // Regla de negocio: solo se puede eliminar si está desactivado
    if (product.isActive) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message: `Product must be deactivated before been removed`,
      });
    }

    await this.catalogProductRepository.remove(product);

    return {
      id,
      message: 'Product permanently deleted',
    };
  }

}

