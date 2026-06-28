import { Injectable } from '@nestjs/common';

@Injectable()
export class PriceServiceService {
  getHello(): string {
    return 'Hello World! <br> This is the Price-Service';
  }
}
