import { 
            Controller, Get, Patch, Inject, Delete, Body,
            Query, Param, NotFoundException, 
            BadRequestException, InternalServerErrorException, ConflictException,  
            Post
        } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation,ApiTags,ApiQuery, ApiBody } from '@nestjs/swagger';
import { firstValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@ApiTags('Catalog')
@Controller('catalog')
export class CatalogController {

    constructor(
        @Inject('CATALOG_SERVICE') private readonly client: ClientProxy
    ){}

    @Get()
    @ApiOperation({ summary: 'Listar catálogos activos (paginado)' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
    @ApiQuery({ name: 'category', required: false, type: String })
    @ApiQuery({ name: 'includeRaw', required: false, type: Boolean })
    async getCatalogs(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('category') category?: string,
        @Query('includeRaw') includeRaw?: string,
    ) {
        return firstValueFrom(
            this.client.send(
                { cmd: 'get_catalogs' },
                {
                    page: page ? Number(page) : 1,
                    limit: limit ? Number(limit) : 20,
                    category,
                    isActive: true,
                    includeRaw: includeRaw === 'true',
                }
            )
        );
    }

    @Get('deactivated')
    @ApiOperation({ summary: 'Listar catálogos desactivados (paginado)' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
    @ApiQuery({ name: 'category', required: false, type: String })
    @ApiQuery({ name: 'includeRaw', required: false, type: Boolean })
    async getCatalogsDeactivated(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('category') category?: string,
        @Query('includeRaw') includeRaw?: string,
    ) {
        return firstValueFrom(
            this.client.send(
                { cmd: 'get_catalogs' },
                {
                    page: page ? Number(page) : 1,
                    limit: limit ? Number(limit) : 20,
                    category,
                    isActive: false,
                    includeRaw: includeRaw === 'true',
                }
            )
        );
    }

    @Get('search')
    @ApiOperation({ summary: 'Busqueda de catálogos por similitudes' })
    async searchCatalogs(@Query('query') query: string,) {
        return this.client.send({ cmd: 'search_catalogs' }, { query });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener catálogo por ID' })
    async getCatalogById(@Param('id') id: string) {
        return this.client.send({ cmd: 'get_catalog_by_id' }, { id })
        .pipe(
            catchError((error) => {
                switch (error?.statusCode) {
                case 400:
                    throw new BadRequestException(error.message);
                case 404:
                    throw new NotFoundException(error.message);
                default:
                    throw new InternalServerErrorException(
                    'Unexpected error from catalog service',
                    );
                }
            }),
        );
    }

    @Patch(':id/deactivate')
    @ApiOperation({ summary: 'Desactivar catálogo por ID' })
    async deactivateCatalog(@Param('id') id: string) {
        return this.client.send({ cmd: 'deactivate_catalog' }, { id })
        .pipe(
            catchError((error) => {
                switch (error?.statusCode) {
                case 400:
                    throw new BadRequestException(error.message);
                case 404:
                    throw new NotFoundException(error.message);
                default:
                    throw new InternalServerErrorException(
                    'Unexpected error from catalog service',
                    );
                }
            }),
        );
    }

    @Patch(':id/activate')
    @ApiOperation({ summary: 'Activar catálogo por ID' })
    async activateCatalog(@Param('id') id: string) {
        return this.client.send({ cmd: 'activate_catalog' }, { id })
        .pipe(
            catchError((error) => {
                switch (error?.statusCode) {
                case 400:
                    throw new BadRequestException(error.message);
                case 404:
                    throw new NotFoundException(error.message);
                default:
                    throw new InternalServerErrorException(
                    'Unexpected error from catalog service',
                    );
                }
            }),
        );
    }
    
    @Delete('products/:id')
    @ApiOperation({ summary: 'Eliminar definitivamente un producto desactivado' })
    async removeProduct(@Param('id') id: string) {
    return this.client
        .send({ cmd: 'remove_catalog' }, { id })
        .pipe(
        catchError((error) => {
            switch (error?.statusCode) {
            case 400:
                throw new BadRequestException(error.message);
            case 404:
                throw new NotFoundException(error.message);
            case 409:
                throw new ConflictException(error.message);
            default:
                throw new InternalServerErrorException(
                'Unexpected error from catalog service',
                );
            }
        }),
        );
    }

    @Post('products')
    @ApiOperation({ summary: 'Crear un producto en el catálogo' })
    @ApiBody({
    schema: {
        example: {
        name: 'Arroz 1kg',
        brand: 'Estrella Azul',
        category: 'Granos',
        presentation: '1kg',
        unit: 'KG',
        },
    },
    })
    async createProduct(){
    }
}
