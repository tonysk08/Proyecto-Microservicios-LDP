import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { CatalogController } from './catalog.controller';

describe('CatalogController', () => {
  let controller: CatalogController;
  let client: { send: jest.Mock };

  beforeEach(async () => {
    client = { send: jest.fn().mockReturnValue(of([])) };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [{ provide: 'CATALOG_SERVICE', useValue: client }],
    }).compile();

    controller = module.get<CatalogController>(CatalogController);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('getCatalogs() envía el comando get_catalogs con includeRaw=true', async () => {
    const result = await controller.getCatalogs('true');

    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'get_catalogs' },
      { isActive: true, includeRaw: true },
    );
    expect(result).toEqual([]);
  });

  it('getCatalogsDeactivated() envía get_catalogs con isActive=false', async () => {
    await controller.getCatalogsDeactivated('false');

    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'get_catalogs' },
      { isActive: false, includeRaw: false },
    );
  });

  it('getCatalogById() envía get_catalog_by_id con el id', () => {
    controller.getCatalogById('abc');

    expect(client.send).toHaveBeenCalledWith({ cmd: 'get_catalog_by_id' }, { id: 'abc' });
  });
});
