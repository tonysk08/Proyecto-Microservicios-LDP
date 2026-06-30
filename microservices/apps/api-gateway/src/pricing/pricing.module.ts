import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PricingController } from './pricing.controller';
import { QuotesController } from './quotes.controller';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'PRICE_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            queue: configService.getOrThrow<string>('PRICING_QUEUE'),
            queueOptions: { durable: true },
            // La cola está predeclarada (con DLX) en definitions.json
            noAssert: true,
          },
        }),
      },
    ]),
  ],
  controllers: [PricingController, QuotesController],
})
export class PricingModule {}
