BEGIN TRANSACTION;

CREATE TYPE role AS ENUM('user', 'admin', 'super-admin');

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name VARCHAR(200) NOT NULL,
	email VARCHAR(255) NOT NULL,
	role role NOT NULL DEFAULT 'user',
	hash VARCHAR(255) NOT NULL,
	reset_psswd_token VARCHAR(255) NULL,
	reset_psswd_token_expiration TIMESTAMP NULL,
	joined TIMESTAMP NOT NULL
);

COMMIT;