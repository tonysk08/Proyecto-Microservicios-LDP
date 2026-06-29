import { Test, TestingModule } from '@nestjs/testing';
import { PriceServiceController } from './price-service.controller';
import { PriceServiceService } from './price-service.service';

describe('PriceServiceController', () => {
  let controller: PriceServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriceServiceController],
      providers: [
        { provide: PriceServiceService, useValue: { getHello: jest.fn().mockReturnValue('pong') } },
      ],
    }).compile();

    controller = module.get<PriceServiceController>(PriceServiceController);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('getHello() delega en el service', () => {
    expect(controller.getHello()).toBe('pong');
  });
});
