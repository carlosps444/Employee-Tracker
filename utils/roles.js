const inquirer = require("inquirer");
const department = require("./department.js");
const logger = require("./logger.js");


async function getRolesChoices(db) {
    const [rows] = await db.promise().query("SELECT id, title FROM roles");

    const choices = rows.map((item) => ({
        value: item.id,
        name: item.title,
    }));

    return choices;
}

async function viewAll(db) {
    const [rows, fields] = await db.promise()
        .query(`SELECT roles.id, roles.title, department.dep_name, roles.salary FROM roles
        JOIN department ON department.id = roles.department_id`);
        logger.logAsTable(rows, fields);
}

async function addRolesPrompt(db) {
    const depChoices = await department.getDepartmentChoices(db);

    const addRolesQuestions = [
        {
            type: "input",
            message: "What is the name of the role?",
            name: "rolesTitle",
        },
        {
            type: "input",
            message: "What is salary of the role?",
            name: "rolesSalary",
        },
        {
            type: "list",
            message: "Which department does the role belong to?",
            name: "rolesDepId",
            choices: [...depChoices],
        },
    ];

    await inquirer.prompt(addRolesQuestions).then(async (response) => {
        await addRole(
            db,
            response.rolesTitle,
            response.rolesSalary,
            response.rolesDepId,
        );
    });


}


async function addRole(db, rolesTitle, rolesSalary, rolesDepId) {
    await db.promise().query(
        `INSERT INTO roles (title, salary, department_id)
    VALUES
        (?,?,?)`,
        [rolesTitle, rolesSalary, rolesDepId]
    );
    logger.prettyLog("Role added.");
}

async function deleteRolesPrompt(db) {
    const rolesChoices = await getRolesChoices(db);

    const deleteRolesQuestions = [
        {
            type: "list",
            message: "Which role do you want to delete?",
            name: "rolesId",
            choices: [...rolesChoices],
        },
    ];

    await inquirer.prompt(deleteRolesQuestions).then(async (response) => {
        await deleteRole(db, response.rolesId);
    });
}

async function deleteRole(db, rolesId) {
    await db.promise().query(`DELETE from roles where id =?`, rolesId);
    logger.prettyLog("Role deleted.");
}


module.exports = {
    viewAll,
    addRolesPrompt,
    getRolesChoices,
    deleteRolesPrompt,
};