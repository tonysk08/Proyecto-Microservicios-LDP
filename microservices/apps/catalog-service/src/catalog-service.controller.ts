import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CatalogServiceController {
  
  @MessagePattern({ cmd: 'get_products' })// Escucha este patrón específico
  getProducts(@Payload() data: any) {
    console.log('Mensaje recibido en Catalog:', data);
    
    // Lo que retornes aquí se enviará automáticamente de vuelta al Gateway
    return [
      { id: 1, name: 'Laptop Pro',        price: 1200 },
      { id: 2, name: 'Mouse Gamer',       price: 50 },
      { id: 3, name: 'Teclado Mecánico',  price: 100 },
      { id: 4, name: 'Monitor 4K',        price: 300 },
      { id: 5, name: 'Tablet',            price: 200 },
      { id: 6, name: 'Smartphone',        price: 500 },
      { id: 7, name: 'CPU',               price: 500 },
      { id: 8, name: 'UPS',               price: 500 },
      { id: 9, name: 'CPU FAN',           price: 500 },
      { id: 9, name: 'Microfono',         price: 500 },
      { id: 10,name: 'Altavoz',           price: 500 },
    ];
  }}
