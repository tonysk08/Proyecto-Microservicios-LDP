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

  it('getCatalogs() envía get_catalogs con paginación, categoría e includeRaw', async () => {
    const result = await controller.getCatalogs('2', '5', 'Lácteos', 'true');

    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'get_catalogs' },
      { page: 2, limit: 5, category: 'Lácteos', isActive: true, includeRaw: true },
    );
    expect(result).toEqual([]);
  });

  it('getCatalogs() usa valores por defecto sin query params', async () => {
    await controller.getCatalogs();

    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'get_catalogs' },
      { page: 1, limit: 20, category: undefined, isActive: true, includeRaw: false },
    );
  });

  it('getCatalogsDeactivated() envía get_catalogs con isActive=false', async () => {
    await controller.getCatalogsDeactivated();

    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'get_catalogs' },
      { page: 1, limit: 20, category: undefined, isActive: false, includeRaw: false },
    );
  });

  it('getCatalogById() envía get_catalog_by_id con el id', () => {
    controller.getCatalogById('abc');

    expect(client.send).toHaveBeenCalledWith({ cmd: 'get_catalog_by_id' }, { id: 'abc' });
  });
});
