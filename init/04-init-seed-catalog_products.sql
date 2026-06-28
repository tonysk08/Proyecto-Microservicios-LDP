\c bd_catalogs;

--
-- PostgreSQL database dump
--

\restrict 4CobF50eVxMIBXv072r9sGUQchwLVT6CG8zAB4ChSkvNRLLJ2TByam5qJdGWTfg

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
-- Data for Name: catalog_products; Type: TABLE DATA; Schema: catalog; Owner: catalog_user
--

COPY catalog.catalog_products (id, name, brand, category, presentation, unit, "isActive", "createdAt", "updatedAt") FROM stdin;
6fe9ee71-f8f3-49ec-ade2-a1390a214f33	arroz especial	pelin	granos	2.27	kg	t	2026-06-16 22:25:30.280574	2026-06-16 22:25:30.280574
ddfcac57-9bc8-434b-82d9-527b1ded764a	ARROZ SSISIMO ESPECIAL	ARROSSISIMO 	granos	2	kg	t	2026-06-22 20:39:37.371925	2026-06-22 20:39:37.371925
99404b70-2f10-4f86-abe5-e37255dd5c0f	leche entera	panalat	Lácteos 	946	ml	t	2026-06-27 23:52:39.264729	2026-06-27 23:52:39.264729
f5d6ca14-9525-4308-bab4-3dc0368ae65e	leche entera	bonlac	Lácteos 	946	ml	t	2026-06-27 23:52:39.271167	2026-06-27 23:52:39.271167
68156813-fc96-46d6-83f1-0e0f43ba9c0d	leche entera	la chiricana	Lácteos 	946	ml	t	2026-06-27 23:52:39.27532	2026-06-27 23:52:39.27532
94c17880-1703-4648-a9dc-886773b0e8e3	leche entera	Nevada	Lácteos 	946	ml	t	2026-06-27 23:52:39.278984	2026-06-27 23:52:39.278984
033b9c57-90c1-4eb2-a18e-96bf1595ad8b	leche entera	estrella azul	Lácteos 	946	ml	t	2026-06-27 23:52:39.277277	2026-06-27 23:52:39.277277
d01a3fc0-b72e-465f-a2e6-493a130c74b1	Elminable#1	eliminable	TEST	99999	NA	f	2026-06-28 09:37:48.768662	2026-06-28 09:37:48.768662
eb1fa032-9cb0-496c-97be-31e2a0a908d2	Elminable#2	eliminable	TEST	99999	NA	f	2026-06-28 09:37:48.774028	2026-06-28 09:37:48.774028
f817c06d-58fd-46f1-a42e-83c6f2f3c0b5	Elminable#3	eliminable	TEST	99999	NA	f	2026-06-28 09:37:48.775772	2026-06-28 09:37:48.775772
cc3057a0-e426-474c-a44d-1a65b5fbcd43	Elminable#4	eliminable	TEST	99999	NA	f	2026-06-28 09:37:48.777368	2026-06-28 09:37:48.777368
8fc069cf-f998-4870-9fad-ee1611d5967d	Elminable#5	eliminable	TEST	99999	NA	f	2026-06-28 09:37:48.77939	2026-06-28 09:37:48.77939
d840e8d5-7ccc-4950-9c3c-4a03b1fc9085	leche entera roscable	bonlac	Lácteos 	946	ml	t	2026-06-27 23:52:39.273039	2026-06-28 15:19:32.448181
\.


--
-- PostgreSQL database dump complete
--

\unrestrict 4CobF50eVxMIBXv072r9sGUQchwLVT6CG8zAB4ChSkvNRLLJ2TByam5qJdGWTfg

