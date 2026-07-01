/**
 * Estado del proceso de emparejamiento (matching) de un producto crudo
 * recolectado por scraping contra el catálogo normalizado.
 */
export enum RawProductStatus {
  PENDING = 'pending',
  MATCHED = 'matched',
  REJECTED = 'rejected',
  DUPLICATE = 'duplicate',
}
