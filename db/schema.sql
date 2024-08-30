DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;

DROP TABLE IF EXISTS Departments;
DROP TABLE IF EXISTS Roles;
DROP TABLE IF EXISTS Employee;

CREATE TABLE Departments (
    id INT NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE Roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    dept_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (dept_id)
        REFERENCES Departments (id)
        ON DELETE SET NULL
);

CREATE TABLE Employees (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NULL,
    manager_id INT NULL,
    PRIMARY KEY (id),

    FOREIGN KEY (role_id)
        REFERENCES Roles (id)
        ON DELETE SET NULL,

    FOREIGN KEY (manager_id)
        REFERENCES Employees (id)
        ON DELETE SET NULL
);