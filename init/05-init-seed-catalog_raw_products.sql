\c bd_catalogs;

--
-- PostgreSQL database dump
--

\restrict wqDjXHBdxIYcteKAd0iXDGzFJfBoV0oj6MhuS9YfuWfTVzXUY1iKBvGc58yYhMt

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: catalog_raw_products; Type: TABLE DATA; Schema: catalog; Owner: catalog_user
--

COPY catalog.catalog_raw_products (id, supermarket, raw_name, raw_brand, "lastPrice", url, status, "scrapedAt", normalized_product_id) FROM stdin;
e189bd8c-2bba-4c12-aa50-53fcf95d4b1e	Super Carnes	ARROZ 2.27 KG ESPECIAL PELIN	PELIN	3.85	https://supercarnes.com/albrook/arroz-227-kg-especial-pelin-7451084770090	pending	2026-06-16 22:27:19.247436	6fe9ee71-f8f3-49ec-ade2-a1390a214f33
01f52165-bd7b-4406-a567-4ce31a57037e	Super Carnes	ARROSSISIMO ESPECIAL 2 KG	ARROSSISIMO	3.67	https://supercarnes.com/albrook/arrossisimo-especial-2-kg-7451106200116	pending	2026-06-22 20:57:12.937541	ddfcac57-9bc8-434b-82d9-527b1ded764a
67603d2c-5074-4081-848a-5b4699e47b45	Super Carnes	LECHE ENTERA PANALAT 946ML	PANALAT	1.68	https://supercarnes.com/albrook/leche-entera-panalat-946ml-2022000001724	pending	2026-06-28 00:00:47.801242	99404b70-2f10-4f86-abe5-e37255dd5c0f
bb5bb76d-cb1d-4fde-a8b6-8736b8a94bb9	Super Carnes	LECHE ENTERA BONLAC 946 ML	BONLAC	1.74	https://supercarnes.com/albrook/leche-entera-bonlac-946-ml-012157301022	pending	2026-06-28 00:00:47.804652	f5d6ca14-9525-4308-bab4-3dc0368ae65e
6550a356-4427-4bc7-ad8d-6bc9ebf06a8e	Super Carnes	LECHE BONLAC ENTERA 946 ML	BONLAC	1.84	https://supercarnes.com/albrook/leche-bonlac-entera-946-ml-012157211390	pending	2026-06-28 00:00:47.807076	d840e8d5-7ccc-4950-9c3c-4a03b1fc9085
e0e52aea-37c0-449e-a387-9d31306eb18c	Super Carnes	LECHE LA CHIRICANA 946 ML	LA CHIRICANA	1.79	https://supercarnes.com/albrook/leche-la-chiricana-946-ml-7452096901588	pending	2026-06-28 00:00:47.809337	68156813-fc96-46d6-83f1-0e0f43ba9c0d
8dc89f80-f9ae-4dec-96dd-6cafc7159ebb	Super Carnes	LECHE D/ORO ENTERA ESTRELLA AZUL 946 ML	ESTRELLA AZUL	1.69	https://supercarnes.com/albrook/leche-doro-entera-estrella-azul-946-ml-088209013366	pending	2026-06-28 00:00:47.811516	033b9c57-90c1-4eb2-a18e-96bf1595ad8b
8beba282-2698-4a98-bd93-43a7a72e42d2	Super Carnes	NEVADA ENTERA NACIONAL 1 L	ESTRELLA AZUL	2.05	https://supercarnes.com/albrook/nevada-entera-nacional-1-l-743337100103	pending	2026-06-28 00:00:47.813718	94c17880-1703-4648-a9dc-886773b0e8e3
82761133-dffe-4249-b4db-2c12dda40a56	Undefiend	undefiended	test	99999.00	https://www.google.com	ready	2026-06-28 09:39:33.783459	d01a3fc0-b72e-465f-a2e6-493a130c74b1
20fe2322-eb53-4a89-8aa3-817e70f7b66c	Undefiend	undefiended	test	99999.00	https://www.google.com	ready	2026-06-28 09:39:33.783459	eb1fa032-9cb0-496c-97be-31e2a0a908d2
4dcbc963-4f8d-4227-8d4e-61adf9268d98	Undefiend	undefiended	test	99999.00	https://www.google.com	ready	2026-06-28 09:39:33.783459	f817c06d-58fd-46f1-a42e-83c6f2f3c0b5
be6001e9-4f6f-4477-aa23-9fee7e81af91	Undefiend	undefiended	test	99999.00	https://www.google.com	ready	2026-06-28 09:39:33.783459	cc3057a0-e426-474c-a44d-1a65b5fbcd43
56e07b4c-0f15-4498-beed-ed5784b3f764	Undefiend	undefiended	test	99999.00	https://www.google.com	ready	2026-06-28 09:39:33.783459	8fc069cf-f998-4870-9fad-ee1611d5967d
\.


--
-- PostgreSQL database dump complete
--

\unrestrict wqDjXHBdxIYcteKAd0iXDGzFJfBoV0oj6MhuS9YfuWfTVzXUY1iKBvGc58yYhMt

