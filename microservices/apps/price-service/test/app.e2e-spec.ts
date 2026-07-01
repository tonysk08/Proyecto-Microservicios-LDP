/**
 * E2E del Price Service.
 *
 * El price-service es un microservicio RMQ puro (sin servidor HTTP), por lo que
 * el boilerplate `GET /` → "Hello World!" no aplica. La prueba E2E real
 * (mensajes RabbitMQ contra el stack levantado con `docker-compose up`) se
 * implementará junto con la lógica real del servicio (LDP-050b / LDP-133).
 */
describe.skip('Price Service (e2e RMQ)', () => {
  it('pendiente (LDP-050b/LDP-133): validar precios contra el broker', () => {
    expect(true).toBe(true);
  });
});
