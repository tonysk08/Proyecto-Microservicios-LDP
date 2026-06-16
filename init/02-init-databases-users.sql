-- =============================================
-- USUARIOS INDEPENDIENTES POR BASE DE DATOS
-- =============================================

-- === bd_catalogs ===
\c bd_catalogs;
CREATE USER catalog_user WITH PASSWORD 'my_catalog_password';
GRANT ALL PRIVILEGES ON DATABASE bd_catalogs TO catalog_user;
GRANT ALL ON SCHEMA public TO catalog_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO catalog_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO catalog_user;

-- === bd_precios ===
\c bd_precios;
CREATE USER precios_user WITH PASSWORD 'my_precios_password';
GRANT ALL PRIVILEGES ON DATABASE bd_precios TO precios_user;
GRANT ALL ON SCHEMA public TO precios_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO precios_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO precios_user;

-- === bd_matching ===
\c bd_matching;
CREATE USER matching_user WITH PASSWORD 'my_matching_password';
GRANT ALL PRIVILEGES ON DATABASE bd_matching TO matching_user;
GRANT ALL ON SCHEMA public TO matching_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO matching_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO matching_user;

-- === bd_logs ===
\c bd_logs;
CREATE USER logs_user WITH PASSWORD 'my_logs_password';
GRANT ALL PRIVILEGES ON DATABASE bd_logs TO logs_user;
GRANT ALL ON SCHEMA public TO logs_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO logs_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO logs_user;