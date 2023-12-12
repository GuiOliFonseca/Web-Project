-- public.tb_product_order_avaliation definition

-- Drop table

-- DROP TABLE public.tb_product_order_avaliation;

CREATE TABLE public.tb_product_order_avaliation (
	id serial NOT NULL,
	liked varchar(1) NOT NULL,
	"comment" text NULL,
	is_deleted bool NOT NULL DEFAULT false,
	created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT tb_product_order_avaliation_pkey PRIMARY KEY (id)
);


-- public.tb_user definition

-- Drop table

-- DROP TABLE public.tb_user;

CREATE TABLE public.tb_user (
	id serial NOT NULL,
	"name" varchar(50) NOT NULL,
	surname varchar(50) NOT NULL,
	email varchar(150) NOT NULL,
	"password" varchar(255) NOT NULL,
	tel varchar(15) NOT NULL UNIQUE,
	"type" varchar(1) NOT NULL,
	is_deleted bool NOT NULL DEFAULT false,
	created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT tb_user_email_unique UNIQUE (email),
	CONSTRAINT tb_user_pkey PRIMARY KEY (id)
);


-- public.tb_address definition

-- Drop table

-- DROP TABLE public.tb_address;

CREATE TABLE public.tb_address (
	id serial NOT NULL,
	alias varchar(100) NOT NULL,
	street varchar(100) NOT NULL,
	neigh varchar(100) NOT NULL,
	complement varchar(100) NULL,
	num varchar(10) NOT NULL,
	zipcode varchar(8) NOT NULL,
	city varchar(60) NOT NULL,
	state varchar(60) NOT NULL,
	country varchar(60) NOT NULL,
	is_deleted bool NOT NULL DEFAULT false,
	id_user int4 NOT NULL,
	created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT tb_address_pkey PRIMARY KEY (id),
	CONSTRAINT tb_address_id_user_foreign FOREIGN KEY (id_user) REFERENCES tb_user(id) ON DELETE CASCADE
);


-- public.tb_client definition

-- Drop table

-- DROP TABLE public.tb_client;

CREATE TABLE public.tb_client (
	id serial NOT NULL,
	cpj varchar(11) NOT NULL UNIQUE DEFAULT '0'::character varying,
	cnpj varchar(14) NOT NULL UNIQUE DEFAULT '0'::character varying,
	is_deleted bool NOT NULL DEFAULT false,
	id_user int4 NOT NULL,
	created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT tb_client_pkey PRIMARY KEY (id),
	CONSTRAINT tb_client_id_user_foreign FOREIGN KEY (id_user) REFERENCES tb_user(id) ON DELETE CASCADE
);


-- public.tb_order definition

-- Drop table

-- DROP TABLE public.tb_order;

CREATE TABLE public.tb_order (
	id serial NOT NULL,
	is_delivered bool NOT NULL DEFAULT false,
	order_total numeric(8,2) NOT NULL,
	id_client int4 NOT NULL,
	id_address int4 NOT NULL,
	created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT tb_order_pkey PRIMARY KEY (id),
	CONSTRAINT tb_order_id_address_foreign FOREIGN KEY (id_address) REFERENCES tb_address(id),
	CONSTRAINT tb_order_id_client_foreign FOREIGN KEY (id_client) REFERENCES tb_client(id)
);


-- public.tb_salesman definition

-- Drop table

-- DROP TABLE public.tb_salesman;

CREATE TABLE public.tb_salesman (
	id serial NOT NULL,
	business_name varchar(150) NOT NULL,
	cnpj varchar(14) NOT NULL UNIQUE,
	is_deleted bool NOT NULL DEFAULT false,
	id_user int4 NOT NULL,
	created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT tb_salesman_cnpj_unique UNIQUE (cnpj),
	CONSTRAINT tb_salesman_pkey PRIMARY KEY (id),
	CONSTRAINT tb_salesman_id_bank_account_foreign FOREIGN KEY (id_bank_account) REFERENCES tb_bank_account(id) ON DELETE CASCADE,
	CONSTRAINT tb_salesman_id_user_foreign FOREIGN KEY (id_user) REFERENCES tb_user(id) ON DELETE CASCADE
);


-- public.tb_material definition

-- Drop table

-- DROP TABLE public.tb_material;

CREATE TABLE public.tb_category (
	id serial NOT NULL,
	"name" varchar(50) NOT NULL,
	is_deleted bool NOT NULL DEFAULT false,
	created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT tb_material_pkey PRIMARY KEY (id)
);


-- public.tb_product definition

-- Drop table

-- DROP TABLE public.tb_product;

CREATE TABLE public.tb_product (
	id serial NOT NULL,
	title varchar(50) NOT NULL,
	num_access int4 NOT NULL DEFAULT 0,
	description text NOT NULL,
	price numeric(8,2) NOT NULL,
	quantity int4 NOT NULL,
	is_active bool NOT NULL DEFAULT true,
	is_deleted bool NOT NULL DEFAULT false,
	id_category int4 NOT NULL,
	id_salesman int4 NOT NULL,
	created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT tb_product_pkey PRIMARY KEY (id),
	CONSTRAINT tb_product_id_category_foreign FOREIGN KEY (id_category) REFERENCES tb_category(id),
	CONSTRAINT tb_product_id_salesman_foreign FOREIGN KEY (id_salesman) REFERENCES tb_salesman(id)
);


-- public.tb_order_product definition

-- Drop table

-- DROP TABLE public.tb_order_product;

CREATE TABLE public.tb_order_product (
	id serial NOT NULL,
	price numeric(8,2) NOT NULL,
	quantity int4 NOT NULL,
	is_deleted bool NOT NULL DEFAULT false,
	id_product int4 NOT NULL,
	id_order int4 NOT NULL,
	id_avaliation int4 NULL,
	created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT tb_order_product_pkey PRIMARY KEY (id),
	CONSTRAINT tb_order_product_id_avaliation_foreign FOREIGN KEY (id_avaliation) REFERENCES tb_product_order_avaliation(id),
	CONSTRAINT tb_order_product_id_order_foreign FOREIGN KEY (id_order) REFERENCES tb_order(id),
	CONSTRAINT tb_order_product_id_product_foreign FOREIGN KEY (id_product) REFERENCES tb_product(id)
);