BEGIN TRANSACTION;

INSERT INTO users(name, email, role, hash, joined) VALUES('Tom Pomarede', 'tom.pomarede687@gmail.com', 'super-admin', '$2a$10$WMZ4Tzic80EgQ.ICRnpaUu9Q15uZg6R.hQ9m2xAd9QVJ2P.glNtLq', '2021-01-01');
INSERT INTO users(name, email, role, hash, joined) VALUES('Admin Normal', 'a@a.a', 'admin', '$2a$10$WMZ4Tzic80EgQ.ICRnpaUu9Q15uZg6R.hQ9m2xAd9QVJ2P.glNtLq', '2021-01-02');
INSERT INTO users(name, email, hash, joined) VALUES('Guio Pomarede Encinosa', 'guio@gmail.com', '$2a$10$WMZ4Tzic80EgQ.ICRnpaUu9Q15uZg6R.hQ9m2xAd9QVJ2P.glNtLq', '2021-01-03');
INSERT INTO users(name, email, hash, joined) VALUES('Utilisateur Lambda', 't@t.t', '$2a$10$WMZ4Tzic80EgQ.ICRnpaUu9Q15uZg6R.hQ9m2xAd9QVJ2P.glNtLq', '2021-01-05');


INSERT INTO todos(id_user, title, created_on) VALUES(1, 'Créer application (Tom - ID 1)', '2021-01-02');
INSERT INTO todos(id_user, title, completed, created_on, done_on) VALUES(1, 'Faire hélicoptère (Tom - ID 1)', true, '2021-01-03', '2021-01-06');
INSERT INTO todos(id_user, title, created_on) VALUES(2, 'Créer application (Admin N - ID 2)', '2021-01-02');
INSERT INTO todos(id_user, title, completed, created_on, done_on) VALUES(2, 'Faire hélicoptère (Admin N - ID 2)', true, '2021-01-04', '2021-01-06');
INSERT INTO todos(id_user, title, created_on) VALUES(3, 'Tester application (Guio PE - ID 3)', '2021-01-01');
INSERT INTO todos(id_user, title, completed, created_on, done_on) VALUES(1, 'Faire hélicoptère (Tom - ID 1)', true, '2021-01-04', '2021-01-06');
INSERT INTO todos(id_user, title, completed, created_on, done_on) VALUES(4, 'Faire les courses (User L - ID 4)', true, '2021-01-04', '2021-01-06');

COMMIT;