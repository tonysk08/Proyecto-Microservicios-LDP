import { Test, TestingModule } from '@nestjs/testing';
import { RmqContext } from '@nestjs/microservices';
import { PriceServiceController } from './price-service.controller';
import { PriceServiceService } from './price-service.service';

describe('PriceServiceController', () => {
  let controller: PriceServiceController;
  let service: { recordPrices: jest.Mock };

  beforeEach(async () => {
    service = { recordPrices: jest.fn().mockResolvedValue({ recorded: 0 }) };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriceServiceController],
      providers: [{ provide: PriceServiceService, useValue: service }],
    }).compile();

    controller = module.get<PriceServiceController>(PriceServiceController);
  });

  // Contexto RMQ falso con ack manual
  const fakeCtx = () => {
    const channel = { ack: jest.fn(), nack: jest.fn() };
    const message = {};
    return {
      ctx: {
        getChannelRef: () => channel,
        getMessage: () => message,
      } as unknown as RmqContext,
      channel,
      message,
    };
  };

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('onScrapingCompleted() delega en recordPrices y hace ack', async () => {
    const { ctx, channel, message } = fakeCtx();
    const event = { correlationId: 'c1', payload: { supermarketId: 'super99', rawProducts: [] } };

    await controller.onScrapingCompleted(event, ctx);

    expect(service.recordPrices).toHaveBeenCalledWith(event);
    expect(channel.ack).toHaveBeenCalledWith(message);
  });

  it('onScrapingCompleted() hace nack→DLQ si recordPrices falla', async () => {
    const { ctx, channel, message } = fakeCtx();
    service.recordPrices.mockRejectedValueOnce(new Error('boom'));

    await controller.onScrapingCompleted({ payload: {} }, ctx);

    expect(channel.nack).toHaveBeenCalledWith(message, false, false);
  });
});
