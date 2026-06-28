import { 
            Controller, Get, Patch, Inject, Delete,
            Query, Param, NotFoundException, 
            BadRequestException, InternalServerErrorException, ConflictException  
        } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation,ApiTags } from '@nestjs/swagger';
import { firstValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@ApiTags('Catalog')
@Controller('catalog')
export class CatalogController {

    constructor(
        @Inject('CATALOG_SERVICE') private readonly client: ClientProxy
    ){}

    @Get()
    @ApiOperation({ summary: 'Obtener listado de catálogos' })
    async getCatalogs() {
        return firstValueFrom(
            this.client.send({ cmd: 'get_catalogs' }, {})
        );
    }

    @Get('deactivated')
    @ApiOperation({ summary: 'Obtener listado de catálogos desactivados' })
    async getCatalogsDeactivated() {
        return firstValueFrom(
            this.client.send({ cmd: 'get_catalogs_deactivated' }, {})
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
}
