BEGIN TRANSACTION;

CREATE TYPE status AS ENUM('fait', 'non');

CREATE TABLE todos (
	id SERIAL PRIMARY KEY,
	id_member INT NOT NULL REFERENCES users(id),
	title VARCHAR(150) NOT NULL,
	status status NOT NULL DEFAULT 'non',
	created_on TIMESTAMP NOT NULL,
	done_on TIMESTAMP NULL
);

COMMIT;