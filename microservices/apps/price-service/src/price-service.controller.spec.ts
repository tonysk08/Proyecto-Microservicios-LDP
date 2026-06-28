import { Test, TestingModule } from '@nestjs/testing';
import { PriceServiceController } from './price-service.controller';
import { PriceServiceService } from './price-service.service';

describe('PriceServiceController', () => {
  let priceServiceController: PriceServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PriceServiceController],
      providers: [PriceServiceService],
    }).compile();

    priceServiceController = app.get<PriceServiceController>(PriceServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(priceServiceController.getHello()).toBe('Hello World!');
    });
  });
});
