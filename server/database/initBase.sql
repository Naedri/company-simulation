/*server/database/initBase.sql*/

/*Cleaning*/
DROP TABLE IF EXISTS ROLE CASCADE;
DROP TABLE IF EXISTS STAFF CASCADE;
DROP TABLE IF EXISTS COMPONENT CASCADE;
DROP TABLE IF EXISTS COMPONENT_RELATION CASCADE;

/*Role Table*/
CREATE TABLE ROLE
(
    id         SERIAL PRIMARY KEY,
    label      VARCHAR(25)
        CONSTRAINT NN_role_label NOT NULL,
    created_at timestamp DEFAULT current_timestamp
);
INSERT INTO ROLE (label)
VALUES ('visitor');
INSERT INTO ROLE (label)
VALUES ('admin');

/*Staff Table*/
/*USER table name not allowed*/
CREATE TABLE STAFF
(
    id                 SERIAL PRIMARY KEY,
    first_name         VARCHAR(25),
    last_name          VARCHAR(25),
    mail               VARCHAR(50)
        CONSTRAINT NN_email NOT NULL,
    encrypted_password VARCHAR(60)
        CONSTRAINT NN_password NOT NULL,
    role_id            INTEGER REFERENCES ROLE (id) DEFAULT 1
        CONSTRAINT NN_role_id NOT NULL,
    created_at         timestamp                    DEFAULT current_timestamp
);
INSERT INTO STAFF (first_name, last_name, mail, encrypted_password)
VALUES ('Bernard', 'Dublanc', 'bn@yopmail.com', 'blablabla');
INSERT INTO STAFF (first_name, last_name, mail, encrypted_password)
VALUES ('Bernard', 'Gilber', 'bg@yopmail.com', 'blablabla');
INSERT INTO STAFF (mail, encrypted_password)
VALUES ('odt@yopmail.com', 'odt123456');
INSERT INTO STAFF (mail, encrypted_password, role_id)
VALUES ('odtadmin@yopmail.com', 'odt123456', 2);
INSERT INTO STAFF (mail, encrypted_password)
VALUES ('a@yopmail.com', 'aqwzsxedc');
INSERT INTO STAFF (mail, encrypted_password, role_id)
VALUES ('b@yopmail.com', 'aqwzsxedc', 2);

/*Component Table*/
CREATE TABLE COMPONENT
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(50),
    created_at timestamp DEFAULT current_timestamp
);
INSERT INTO COMPONENT (name)
VALUES ('forest');
INSERT INTO COMPONENT (name)
VALUES ('sawmill');
INSERT INTO COMPONENT (name)
VALUES ('ikea');
INSERT INTO COMPONENT (name)
VALUES ('home');

/*Component Relation Table*/
CREATE TABLE COMPONENT_RELATION
(
    component_from INTEGER REFERENCES COMPONENT (id),
    component_to   INTEGER REFERENCES COMPONENT (id),
    weight         INTEGER DEFAULT 1,
    PRIMARY KEY (component_from, component_to)
);
INSERT INTO COMPONENT_RELATION(component_from, component_to)
VALUES (1, 1);
INSERT INTO COMPONENT_RELATION(component_from, component_to, weight)
VALUES (1, 2, 2);
INSERT INTO COMPONENT_RELATION(component_from, component_to)
VALUES (2, 3);
INSERT INTO COMPONENT_RELATION(component_from, component_to, weight)
VALUES (4, 4, 1);
