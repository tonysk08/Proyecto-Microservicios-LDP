import { Test, TestingModule } from '@nestjs/testing';
import { CatalogServiceController } from './catalog-service.controller';
import { CatalogServiceService } from './catalog-service.service';

describe('CatalogServiceController', () => {
  let controller: CatalogServiceController;
  let service: {
    findAll: jest.Mock;
    searchProducts: jest.Mock;
    findById: jest.Mock;
    deactivateCatalog: jest.Mock;
    activateCatalog: jest.Mock;
    removeCatalog: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
      searchProducts: jest.fn(),
      findById: jest.fn(),
      deactivateCatalog: jest.fn(),
      activateCatalog: jest.fn(),
      removeCatalog: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogServiceController],
      providers: [{ provide: CatalogServiceService, useValue: service }],
    }).compile();

    controller = module.get<CatalogServiceController>(CatalogServiceController);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('getCatalogs() delega en findAll con los flags por defecto', async () => {
    const expected = [{ id: '1' }];
    service.findAll.mockResolvedValue(expected);

    const result = await controller.getCatalogs({});

    expect(service.findAll).toHaveBeenCalledWith({ isActive: true, includeRaw: false });
    expect(result).toBe(expected);
  });

  it('getCatalogs() respeta los flags recibidos', async () => {
    service.findAll.mockResolvedValue([]);

    await controller.getCatalogs({ isActive: false, includeRaw: true });

    expect(service.findAll).toHaveBeenCalledWith({ isActive: false, includeRaw: true });
  });

  it('getCatalogById() delega en findById con el id', async () => {
    const product = { id: 'abc' };
    service.findById.mockResolvedValue(product);

    const result = await controller.getCatalogById({ id: 'abc' });

    expect(service.findById).toHaveBeenCalledWith('abc');
    expect(result).toBe(product);
  });

  it('deactivateCatalog() delega en deactivateCatalog con el id', async () => {
    service.deactivateCatalog.mockResolvedValue({ id: 'abc', isActive: false, message: 'ok' });

    await controller.deactivateCatalog({ id: 'abc' });

    expect(service.deactivateCatalog).toHaveBeenCalledWith('abc');
  });

  it('removeCatalog() delega en removeCatalog con el id', async () => {
    service.removeCatalog.mockResolvedValue({ id: 'abc', message: 'deleted' });

    await controller.removeCatalog({ id: 'abc' });

    expect(service.removeCatalog).toHaveBeenCalledWith('abc');
  });
});
