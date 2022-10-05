import knex from 'knex';

const db = knex({
	client: 'pg',
	connection: process.env.POSTGRES_URI
});

export default db;