INSERT INTO department (id, dep_name)
VALUES (1, "Tech"),
       (2, "Sales"),
       (3, "Finance"),
       (4, "Customer Service");



INSERT INTO roles (id, title, salary, department_id)
VALUES (1, "Tech Support", 60000, 1),
       (2, "Tech Lead", 70000, 1),
       (3, "Auditor", 50000, 2),
       (4, "Budget Analyst", 52000, 2),
       (5, "Sales Rep", 60000, 3),
       (6, "Sales Manager", 73000, 3),
       (7, "Customer Service Rep", 45000, 4),
       (8, "Patient Coordinator", 55000, 4);



INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Jamie", "Marquez", 2, NULL),
       (2, "Billy", "Jones", 1, 2),
       (3, "Mendy", "Livel", 3, 4),
       (4, "Melli", "King", 4, NULL),
       (5, "Corey", "Hanson", 5, 6),
       (6, "Anabelle", "Ridley", 6, NULL),
       (7, "Barbara", "Royce", 7, NULL),
       (8, "Betty", "Johnson", 8, NULL);
