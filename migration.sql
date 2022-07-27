DROP TABLE IF EXISTS pets;

CREATE TABLE pets (
    id SERIAL,
    name TEXT,
    kind TEXT,
    age INTEGER
);

INSERT INTO pets (name, kind, age) VALUES ('Cerberus', 'Dog', 1200);
INSERT INTO pets (name, kind, age) VALUES ('Fenrir', 'Wolf', 321321);
INSERT INTO pets (name, kind, age) VALUES ('Norbert', 'Dragon', 2);