import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CatalogServiceController {
  
  @MessagePattern({ cmd: 'get_products' })// Escucha este patrón específico
  getProducts(@Payload() data: any) {
    console.log('Mensaje recibido en Catalog:', data);
    
    // Lo que retornes aquí se enviará automáticamente de vuelta al Gateway
    return [
      { id: 1, name: 'Laptop Pro', price: 1200 },
      { id: 2, name: 'Mouse Gamer', price: 50 },
    ];
  }
}
