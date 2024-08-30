INSERT INTO Departments (dept_name)
VALUES
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sales');

INSERT INTO Roles (title, salary, dept_id)
VALUES
    ('Sales Lead', 100000, 4),
    ('Salesperson', 80000, 4),
    ('Lead Engineer', 150000, 1),
    ('Software Engineer', 120000, 1),
    ('Account Manager', 145000, 2),
    ('Accountant', 125000, 2),
    ('Legal Team Lead', 250000, 3),
    ('Lawyer', 190000, 3);

INSERT INTO Employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Jim', 'Farley', 1, null),
    ('Chester', 'Fredericks', 3, null),
    ('Amy', 'Lord', 7, null),
    ('Sandy', 'Hammerstein', 5, null),
    ('John', 'Pickles', 6, 4),
    ('Bill', 'Larusso', 8, 3),
    ('Chelsea', 'Burbank', 2, 1),
    ('Alexander', 'Figglestein', 2, 1),
    ('Norman', 'Oglesworth', 4, 2),
    ('Fred', 'Parker', 4, 2);
    