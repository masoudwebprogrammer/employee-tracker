const inquirer = require("inquirer");
const validation = require("./Validation");
const logo = `
███████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗███████╗    
██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝    
█████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  █████╗      
██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══╝      
███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗███████╗    
╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝    
                                                                         
███╗   ███╗ █████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗██████╗            
████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝██╔══██╗           
██╔████╔██║███████║██╔██╗ ██║███████║██║  ███╗█████╗  ██████╔╝           
██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  ██╔══██╗           
██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║╚██████╔╝███████╗██║  ██║           
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝           
`;

function mainMenu() {
  console.clear();
  console.log(logo);
  return inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "View Employees by Department",
        "View Employees by Manager",
        "View Total Salary Expenses per Department",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update an Employee's Role",
        "Update an Employee's Manager",
        "Delete a Department",
        "Delete a Role",
        "Delete an Employee",
        "Quit",
      ],
    },
  ]);
}

function deptPrompt() {
  return inquirer.prompt([
    {
      type: "input",
      name: "deptName",
      message: `What is the department name? (Required)`,
      validate: (deptName) => {
        if (deptName) {
          return true;
        } else {
          console.log(`
          ***** You must enter a department name. *****
          `);
          return false;
        }
      },
    },
  ]);
}

function rolePrompt() {
  return inquirer.prompt([
    {
      type: "input",
      name: "roleTitle",
      message: `What is the role name? (Required)`,
      validate: (roleTitle) => {
        if (roleTitle) {
          return true;
        } else {
          console.log(`
          ***** You must enter a role name. *****
          `);
          return false;
        }
      },
    },
    {
      type: "number",
      name: "roleSalary",
      message: `What is the salary for this role? (Required)`,
      ...validation.reqNumberInputValidation,
    },
    {
      type: "number",
      name: "roleDept",
      message: "What is the deptartment id for this role?",
      ...validation.optNumberInputValidation,
    },
  ]);
}

function empNamePrompt(order) {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: `What is the employee's ${order} name?`,
      },
    ])
    .then((input) => {
      return input.name;
    });
}

function empRolePrompt(rolesList) {
  const roleChoices = rolesList.roleTitles;
  const answerKey = rolesList.rows;
  return inquirer
    .prompt([
      {
        type: "list",
        name: "roleChoice",
        message: "What is the employee's role?",
        choices: [...roleChoices, "none"],
      },
    ])
    .then((choice) => {
      if (choice.roleChoice === "none") {
        return (choice.roleChoice = null);
      } else {
        const match = answerKey.filter(
          (TextRow) => TextRow["title"] === choice.roleChoice
        );
        return match[0].id;
      }
    });
}

function empMngrPrompt(empList) {
  const mngrChoices = empList.employeeNames;
  const answerKey = empList.rows;
  return inquirer
    .prompt([
      {
        type: "list",
        name: "mngrChoice",
        message: "Who is the employee's manager?",
        choices: [...mngrChoices, "none"],
      },
    ])
    .then((choice) => {
      const mngrName = choice.mngrChoice;
      if (choice.mngrChoice === "none") {
        const mngrId = null;
        return { mngrName, mngrId };
      } else {
        const match = answerKey.filter(
          (TextRow) => TextRow["name"] === choice.mngrChoice
        );
        const mngrId = match[0].id;
        return { mngrName, mngrId };
      }
    });
}

function empChoicePrompt(empList) {
  const empChoices = empList.employeeNames;
  const answerKey = empList.rows;
  return inquirer
    .prompt([
      {
        type: "list",
        name: "empChoice",
        message: "Choose an Employee.",
        choices: [...empChoices],
      },
    ])
    .then((choice) => {
      const match = answerKey.filter(
        (TextRow) => TextRow["name"] === choice.empChoice
      );
      const id = match[0].id;
      const empName = choice.empChoice;
      return { empName, id };
    });
}

function deptChoicePrompt(deptList) {
  const deptChoices = deptList.deptNames;
  const answerKey = deptList.rows;
  return inquirer
    .prompt([
      {
        type: "list",
        name: "deptChoice",
        message: "Choose a department.",
        choices: [...deptChoices],
      },
    ])
    .then((choice) => {
      const match = answerKey.filter(
        (TextRow) => TextRow["dept_name"] === choice.deptChoice
      );
      const id = match[0].id;
      const deptName = choice.deptChoice;
      return { deptName, id };
    });
}

function mngrChoicePrompt(mngrList) {
  const mngrChoices = mngrList.mngrNames;
  const answerKey = mngrList.rows;
  return inquirer
    .prompt([
      {
        type: "list",
        name: "mngrChoice",
        message: "Choose a manager.",
        choices: [...mngrChoices],
      },
    ])
    .then((choice) => {
      const match = answerKey.filter(
        (TextRow) => TextRow["managers"] === choice.mngrChoice
      );
      const id = match[0].id;
      const mngrName = choice.mngrChoice;
      return { mngrName, id };
    });
}

function roleChoicePrompt(rolesList) {
  const roleChoices = rolesList.roleTitles;
  const answerKey = rolesList.rows;
  return inquirer
    .prompt([
      {
        type: "list",
        name: "roleChoice",
        message: "Choose a role.",
        choices: [...roleChoices],
      },
    ])
    .then((choice) => {
      const match = answerKey.filter(
        (TextRow) => TextRow["title"] === choice.roleChoice
      );
      const id = match[0].id;
      const roleName = choice.roleChoice;
      return { roleName, id };
    });
}

function newRolePrompt(rolesList, name) {
  const roleChoices = rolesList.roleTitles;
  const answerKey = rolesList.rows;
  return inquirer
    .prompt([
      {
        type: "list",
        name: "roleChoice",
        message: `What role do you want to assign to ${name}?`,
        choices: [...roleChoices, "none"],
      },
    ])
    .then((choice) => {
      const roleTitle = choice.roleChoice;
      if (choice.roleChoice === "none") {
        const roleId = null;
        return { roleTitle, roleId };
      } else {
        const match = answerKey.filter(
          (TextRow) => TextRow["title"] === choice.roleChoice
        );
        const roleId = match[0].id;
        return { roleTitle, roleId };
      }
    });
}

function deptViewNumPrompt() {
  return inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Would you like to view expenses for all departments or just one?",
      choices: ["One", "All"],
    },
  ]);
}

function quitReturn() {
  return inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: ["Main Menu", "Quit"],
    },
  ]);
}

module.exports = {
  mainMenu,
  deptPrompt,
  rolePrompt,
  empNamePrompt,
  empRolePrompt,
  empMngrPrompt,
  empChoicePrompt,
  deptChoicePrompt,
  newRolePrompt,
  mngrChoicePrompt,
  roleChoicePrompt,
  deptViewNumPrompt,
  quitReturn,
};
