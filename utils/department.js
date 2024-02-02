const inquirer = require("inquirer");
const logger = require("./logger.js");

const departmentQuestions = [
    {
        type: "input",
        message: "What is the name of the department?",
        name: "depName",
    },
];



async function viewAll(db) {
    const [rows, fields] = await db.promise().query("SELECT * FROM department");
    logger.logAsTable(rows, fields);
}


async function getDepartmentChoices(db) {
    const [rows] = await db
    .promise()
    .query("SELECT id, dep_name FROM department");


    const choices = rows.map((item) => ({
        value: item.id,
        name: item.dep_name,
    }));

    return choices;

}

async function addDepPrompt(db) {
    await inquirer.prompt(departmentQuestions).then(async (response) => {
        await addDep(db, response.depName);
    });
}

async function addDep(db, depName) {
    await db.promise().query(
        `INSERT INTO department (dep_name)
        VALUES
        (?)`,
        depName
    );
    logger.prettyLog("Department added.");
}

async function deleteDepartmentPrompt(db) {
    const depChoices = await getDepartmentChoices(db);

    const deleteDepartmentQuestions = [
        {
            type: "list",
            message: "Which Department do you want to delete?",
            name: "depId",
            choices: [...depChoices],
        },

    ];

    await inquirer.prompt(deleteDepartmentQuestions).then(async (response) => {
        await deleteDepartment(db, response.depId);
    });
}


async function deleteDepartment(db, department_Id) {
    await db
        .promise()
        .query(`DELETE from Department where id = ?`, department_Id);
        logger.prettyLog("Department deleted.");
}



async function viewTotalBudgetOfDepartmentPrompt(db) {
    const depChoices = await getDepartmentChoices(db);

    const totalBudgetQuestion = [
        {
            type: "list",
            message: "Which Department's total utilized budget do you want to view?",
            name: "depId",
            choices: [...depChoices],
        },
    ];

    await inquirer.prompt(totalBudgetQuestion).then(async (response) => {
        await getTotalBudgetForDepartment(db, response.depId);
    });
}


async function getTotalBudgetForDepartment(db, department_Id) {

    const queryString = `SELECT department.id, department.dep_name, sum(role.salary) as budget FROM department
    JOIN roles on roles.department_id = department.id
    JOIN employees ON employees.roles_id = roles.id
    WHERE department.id = ?
    GROUP BY department.id`;

    const [rows, fields] = await db.promise().query(queryString, department_Id);
    logger.logAsTable(rows, fields);
}

module.exports = {
    viewAll,
    addDepPrompt,
    getDepartmentChoices,
    deleteDepartmentPrompt,
    viewTotalBudgetOfDepartmentPrompt,
};