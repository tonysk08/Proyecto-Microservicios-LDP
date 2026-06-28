\c bd_catalogs;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE catalog.catalog_products (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	name varchar(200) NOT NULL,
	brand varchar(100) NULL,
	category varchar(100) NULL,
	presentation varchar(50) NULL,
	unit varchar(20) NULL,
	"isActive" bool DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "PK_9f7a978657257a0bb575a174f0a" PRIMARY KEY (id)
);

CREATE TABLE catalog.catalog_raw_products (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	supermarket varchar NOT NULL,
	raw_name varchar NOT NULL,
	raw_brand varchar NULL,
	"lastPrice" numeric(10, 2) NULL,
	url varchar NULL,
	status varchar DEFAULT 'pending'::character varying NOT NULL,
	"scrapedAt" timestamp DEFAULT now() NOT NULL,
	normalized_product_id uuid NULL,
	CONSTRAINT "PK_b37c269a0fc4b14588280cf11ec" PRIMARY KEY (id),
	CONSTRAINT "FK_8ed0edd47446dc7390f97c7fc16" FOREIGN KEY (normalized_product_id) REFERENCES catalog.catalog_products(id)
);