const inquirer = require("inquirer");
const role = require("./roles.js");
const department = require("./department.js");
const logger = require("./logger.js");



async function getEmployeeChoices(db) {
    const queryString = `SELECT id, concat(first_name, ' ', last_name) as employeesName FROM employees`;

    
    const [rows] = await db.promise().query(queryString);


    const choices = rows.map((item) => ({
        value: item.id,
        name: item.employeeName,
    }));

    return choices;
}

async function getManagerChoices(db) {
    const queryString = `SELECT id, concat(first_name, ' ', last_name) as managerName FROM employees`;

    const [rows] = await db.promise().query(queryString);

    const choices = rows.map((item) => ({
        value: item.id,
        name: item.managerName,
    }));
    return choices;
}

async function viewAll(db) {
    const queryString = `
    SELECT
        employees.id,
        employees.first_name,
        employees.last_name,
        roles.title,
        department.dep_name,
        roles.salary,
        CONCAT(e2.first_name, ' ', e2.last_name) as manager
    FROM
        employees
        JOIN roles ON roles.id = employees.roles_id
        JOIN department ON department.id = roles.department_id
        LEFT JOIN employees e2 ON e2.id = employees.manager_id

    `;

    const [rows, fields] = await db.promise().query(queryString);
    logger.logAsTable(rows, fields);
}


async function addEmployeePrompt(db) {
    const managerChoices = await getEmployeeChoices(db);

    const rolesChoices = await role.getRolesChoices(db);

    const addEmployeeQuestions = [
        {
            type: "input",
            message: "What is the employee's first name?",
            name: "firstName",
        },
        {
            type: "input",
            message: "What is the employee's last name?",
            name: "lastName",
        },
        {
            type: "list",
            message: "What is the employee's role?",
            name: "rolesId",
            choices: [...rolesChoices],
        },
        {
            type: "list",
            message: "Who is the employee's manager?",
            name: "managerId",
            choices: ["None", ...managerChoices],
        },
    ];

    await inquirer.prompt(addEmployeeQuestions).then(async (response) => {
        await addEmployee(
            db,
            response.firstName,
            response.lastName,
            response.rolesId,
            response.managerId
        );
    });
}

async function addEmployee(
    db,
    firstName,
    lastName,
    employeesRole,
    employeesManager
) {
    if (employeesManager === "None") {
        employeesManager = null;
    }

    await db
    .promise()
    .query(
        `INSERT INTO employees (first_name, last_name, roles_id, manager_id) VALUES (?,?,?,?)`,
        [firstName, lastName, employeesRole, employeesManager]
    );

    logger.prettyLog("Employee added.");
}

async function updateEmployeesRolePrompt(db) {
    const employeeChoices = await getEmployeeChoices(db);

    const rolesChoices = await role.getRolesChoices(db);

    const updateEmployeeQuestions = [
        {
            type: "list",
            message: "Which employee's role do you want to update?",
            name: "empId",
            choices: [...employeeChoices],
        },
        {
            type: "list",
            message: "Which role do you want to assign the selected employee?",
            name: "rolesId",
            choices: [...rolesChoices]
        },
    ];

    await inquirer.prompt(updateEmployeeQuestions).then(async (response) => {
        await updateEmployeesRole(db, response.rolesId, response.empId);
    });
}

async function updateEmployeesRole(db, rolesId, employeesId) {
    await db
    .promise()
    .query(`UPDATE employees SET roles_id WHERE id = ?`, [rolesId, employeesId]);

    logger.prettyLog("Employees Role updated");
}


async function updateEmployeesManagerPrompt(db) {
    const employeeChoices = await getEmployeeChoices(db);

    const managerChoices = await getManagerChoices(db);

    const updateEmployeesManagerQuestions = [
        {
            type: "list",
            message: "Which employee's manager do you want to update?",
            name: "empId",
            choices: [...employeeChoices],
        },
        {
            type: "list",
            message: "Which manager do you want to assign the selected employee?",
            name: "managerId",
            choices: [...managerChoices],
        },
    ];

    await inquirer
    .prompt(updateEmployeesManagerQuestions)
    .then(async (response) => {
        await updateEmployeesManager(db, response.empId, response.managerId);
    });

}


async function updateEmployeesManager(db, employeesId, managerId) {
    await db
    .promise()
    .query(`UPDATE employees SET manager_id=? WHERE id = ?`, [
        managerId,
        employeesId,
    ]);
    logger.prettyLog("Employees Manager updated.");
    
}


async function viewEmployeesByManagerPrompt(db) {
    const employeeChoices = await getEmployeeChoices(db);


    const viewEmployeesByManagerQuestions = [
        {
            type: "list",
            message: "Which manager do you want to view the employees for?",
            name: "managerId",
            choices: [...employeeChoices],
        },
    ];


    await inquirer
    .prompt(viewEmployeesByManagerQuestions)
    .then(async (response) => {
        await viewEmployeesByManager(db, response.managerId);
    });
}

async function viewEmployeesByManager(db, managerId) {
    const queryString = `
    SELECT
        employees.id,
        employees.first_name,
        employees.last_name,
        roles.title,
        department.dep_name,
        roles.salary,
        CONCAT(e2.first_name, ' ', e2.last_name) as manager
    FROM
        employees
        JOIN roles ON roles.id = employees.roles_id
        JOIN department ON department.id = roles.department_id
        LEFT JOIN employees e2 ON e2.id = employees.manager_id
    WHERE
        employees.manager_id = ?
        `;

const [rows, fields] = await db.promise().query(queryString,managerId);
logger.logAsTable(rows, fields);
}

async function viewEmployeesByDepartmentPrompt(db) {
    const departmentChoices = await department.getDepartmentChoices(db);

    const queryString = [
        {
            type: "list",
            message: "Which Department do you want to view the employeees for?",
            name: "depId",
            choices: [...departmentChoices],        
        },
    ];

    await inquirer.prompt(queryString).then(async (response) => {
        await viewEmployeesByDepartment(db, response.depId);
    });
}

async function viewEmployeesByDepartment(db, depId) {
    const queryString = `
    SELECT
        employees.id,
        employees.first_name,
        employees.last_name,
        roles.title.
        department.dep_name,
        roles.salary,
        CONCAT(e2.first_name, ' ', e2.last_name) as manager
    FROM
        employees
        JOIN roles ON roles.id = employees.roles_id
        JOIN department ON department.id = roles.department_id
        LEFT JOIN employees e2 ON e2.id = employees.manager_id
    WHERE
    department.id = ?
    `;

    const [rows, fields] = await db.promise().query(queryString, depId);
    logger.logAsTable(rows, fields);
}

async function deleteEmployeePrompt(db) {
    const employeeChoices = await getEmployeeChoices(db);


    const deleteEmployeeQuestions = [
        {
            type: "list",
            message: "Which Employee do you want to delete?",
            name: "employeeId",
            choices: [...employeeChoices],
        },
    ];

    await inquirer.prompt(deleteEmployeeQuestions).then(async (response) => {
        await deleteEmployee(db, response.employeesId);
    });
}


async function deleteEmployee(db, empId) {
    await db.promise().query(`DELETE from Employees where = ?`, empId);
    logger.prettyLog("Employee deleted.");
}

module.exports = {
    viewAll,
    addEmployeePrompt,
    updateEmployeesRolePrompt,
    updateEmployeesManagerPrompt,
    getManagerChoices,
    viewEmployeesByManagerPrompt,
    viewEmployeesByDepartmentPrompt,
    deleteEmployeePrompt,
};