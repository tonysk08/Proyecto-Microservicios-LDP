/**
 * E2E del Catalog Service.
 *
 * El catalog-service es un microservicio RMQ puro (sin servidor HTTP), por lo
 * que el boilerplate `GET /` → "Hello World!" no aplica. La prueba E2E real
 * (mensajes RabbitMQ contra el stack levantado con `docker-compose up`) se
 * implementará en LDP-133.
 */
describe.skip('Catalog Service (e2e RMQ)', () => {
  it('pendiente (LDP-133): validar { cmd: get_catalogs } contra el broker', () => {
    expect(true).toBe(true);
  });
});
