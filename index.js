const inquirer = require("inquirer");
const mysql = require("mysql2");
const logo = require("asciiart-logo");
const config = require("./package.json");
console.log(logo(config).render());


const department = require("./utils/department.js");
const role = require("./utils/roles.js");
const employee = require("./utils/employees.js");


const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "dime10",
    database: "mydb"
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Connected to DB!");
})


const mainQuestion = [
{
    type: "list",
    message: "What would you like to do?",
    name: "option",
    choices: [
        "[Department] View All Departments",
        "[Department] Add Department",
        "[Department] View The Total Utilized Budget Of The Department",
        "[Department] Delete Department",
        "[Employees] View All Employees",
        "[Employees] View Employees By Manager",
        "[Employees] View Employees By Department",
        "[Employees] Add Employees",
        "[Employees] Update Employees role",
        "[Employees] Update Employees Manager",
        "[Employees] Delete Employees",
        "[Roles] View All Roles",
        "[Roles] Add Roles",
        "[Roles] Delete Roles",
        "***Quit***",

    ],
},

]


async function processChoice(option) {
    if (option === "[Department] View All Departments") {
        await department.viewAll(db);
        
    } else if (option === "[Department] Add Department") {
        await department.addDepPrompt(db);

    } else if (option === "[Employees] View All Employees") {
        await employee.viewAll(db);

    } else if (option === "[Employees] Add Employees") {
        await employee.addEmployeePrompt(db);

    } else if (option === "[Employees] Update Employees Role") {
        await employee.updateEmployeesRolePrompt(db);

    } else if (option === "[Employees] Update Employees Manager") {
        await employee.updateEmployeesManagerPrompt(db);

    } else if (option === "[Employees] View Employees By Manager") {
        await employee.viewEmployeesByManagerPrompt(db);

    } else if (option === "[Employees] View Employees By Department") {
        await employee.viewEmployeesByDepartmentPrompt(db);

    } else if (option === "[Roles] View All Roles") {
        await role.viewAll(db);

    } else if (option === "[Roles] Add Roles") {
        await role.addRolesPrompt(db);

    } else if (option === "[Roles] Delete Roles") {
        await role.deleteRolesPrompt(db);

    } else if (option === "[Department] Delete Department") {
        await department.deleteDepartmentPrompt(db);

    } else if (option === "[Employees] Delete Employees") {
        await employee.deleteEmployeePrompt(db);

    } else if (option === "[Department] View The Total Utilized Budget Of The Department") {
        await department.viewTotalBudgetOfDepartmentPrompt(db);

    } else if (option === "***Quit***") {
        console.log("Program Off.");
        process.exit();
    }


    promptQuestion();
}


function promptQuestion() {
    inquirer.prompt(mainQuestion).then((response) => {
        processChoice(response.option);
    });
}


function init() {
    console.log(logo(config).render());
    promptQuestion();
}


init();
