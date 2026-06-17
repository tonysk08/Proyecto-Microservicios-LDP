import { Controller, Get,Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation,ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

@ApiTags('catalog')
@Controller('catalog')
export class CatalogController {

    constructor(
        @Inject('CATALOG_SERVICE') private readonly client: ClientProxy
    ){}

    @Get()
    @ApiOperation({ summary: 'Obtener listado de catálogos' })
    async getProducts() {
        return firstValueFrom(
            this.client.send({ cmd: 'get_catalogs' }, {})
        );
    }
}
