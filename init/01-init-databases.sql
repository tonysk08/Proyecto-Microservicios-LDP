-- Crear bases de datos del sistema de microservicios
CREATE DATABASE bd_catalogs;
CREATE DATABASE bd_precios;
CREATE DATABASE bd_matching;
CREATE DATABASE bd_logs;

-- Conectar a bd_catalogs y crear esquema base
\c bd_catalogs;
CREATE SCHEMA IF NOT EXISTS catalog;
COMMENT ON SCHEMA catalog IS 'Esquema para productos normalizados del catálogo';


-- Conectar a bd_precios y crear esquema base
\c bd_precios;
CREATE SCHEMA IF NOT EXISTS pricing;
COMMENT ON SCHEMA pricing IS 'Esquema para historial de precios';

-- Conectar a bd_matching y crear esquema base
\c bd_matching;
CREATE SCHEMA IF NOT EXISTS matching;
COMMENT ON SCHEMA matching IS 'Esquema para equivalencias y emparejamiento de productos';

-- Conectar a bd_logs y crear esquema base
\c bd_logs;
CREATE SCHEMA IF NOT EXISTS audit;
COMMENT ON SCHEMA audit IS 'Esquema para eventos y logs de auditoría';