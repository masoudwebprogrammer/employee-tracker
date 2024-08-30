const mysql = require("mysql2");
const dotenv = require("dotenv").config();
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: process.env.NODE_ENV === "development" ? 3306 : "",
  user: process.env.user,
  password: process.env.pass,
  database: "employees_db",
});

const initiateConnection = function () {
  connection.promise().connect((err) => {
    if (err) throw err;
  });
};

const getAll = (keyWord) => {
  let qryStmt = `SELECT * FROM ${keyWord}`;
  if (keyWord === "Employees") {
    qryStmt =
      "SELECT Employees.id AS ID, " +
      "Employees.first_name AS `First Name`, " +
      "Employees.last_name AS `Last Name`, " +
      "Roles.title AS Title, " +
      "Departments.dept_name AS Department, " +
      "Roles.salary AS Salary, " +
      "CONCAT(m.first_name, ' ', m.last_name) AS Manager " +
      "FROM Employees " +
      "LEFT JOIN Roles ON Employees.role_id = Roles.id " +
      "LEFT JOIN Departments ON Roles.dept_id = Departments.id " +
      "LEFT JOIN Employees m ON m.id = Employees.manager_id";
  } else if (keyWord === "Roles") {
    qryStmt =
      "SELECT Roles.title AS Title, Roles.id AS `Role ID`, Departments.dept_name AS Department, Roles.salary AS Salary FROM Roles " +
      "LEFT JOIN Departments ON Roles.dept_id = Departments.id";
  } else if (keyWord === "Departments") {
    qryStmt =
      "SELECT Departments.dept_name AS Department, Departments.id AS `Dept ID` FROM Departments";
  }
  return connection
    .promise()
    .query(qryStmt)
    .then(([rows, fields]) => {
      console.log(``);
      console.table(keyWord, rows);
    });
};

const getEmpByDept = (deptNameId) => {
  let qryStmt = `SELECT                          
                        CONCAT(Employees.first_name, ' ', Employees.last_name) AS Employees, 
                        Roles.title AS Roles,
                        Roles.salary AS Salary,
                    FROM Roles 
                    INNER JOIN Employees ON Employees.role_id = Roles.id
                    and Roles.dept_id = ${deptNameId.id}`;
  return connection
    .promise()
    .query(qryStmt)
    .then(([rows, fields]) => {
      console.log(``);
      console.table(deptNameId.deptName, rows);
    });
};

const getEmpByMngr = (managerInfo) => {
  let qryStmt = `SELECT        
        CONCAT(Employees.first_name, ' ', Employees.last_name) AS Employees, 
        Roles.title AS Roles,
        Roles.salary AS Salary 
    FROM Employees 
    INNER JOIN Roles ON Employees.role_id = Roles.id
    WHERE Employees.manager_id = ${managerInfo.id}`;
  return connection
    .promise()
    .query(qryStmt)
    .then(([rows, fields]) => {
      console.log(``);
      console.table(`Reporting to ${managerInfo.mngrName}`, rows);
    });
};

const getDeptBdgt = (deptNameId) => {
    let singleOpt = "";
    if (deptNameId) {
        singleOpt = `WHERE Roles.dept_id = ${deptNameId.id} `;
    }

  let qryStmt =
    "SELECT " +
    "Departments.dept_name AS Department, " +
    "SUM(Roles.salary) AS `Total Salary Expenses` " +
    "FROM Departments " +
    "LEFT JOIN Roles ON Departments.id = Roles.dept_id " +
     singleOpt +
    "GROUP BY Roles.dept_id";
  return connection
    .promise()
    .query(qryStmt)
    .then(([rows, fields]) => {
      console.log(``);
      console.table("Department Salary Expenses", rows)
    });
};

const addDept = (deptName) => {
  let qryStmt = `INSERT INTO Departments SET ?`;

  return connection.promise().query(
    qryStmt,
    {
      dept_name: deptName,
    },
    function (err, res) {
      if (err) throw err;
    }
  );
};

const addRole = (roleTitle, roleSalary, roleDept) => {
  let qryStmt = `INSERT INTO Roles SET ?`;

  return connection.promise().query(
    qryStmt,
    {
      title: roleTitle,
      salary: roleSalary,
      dept_id: roleDept,
    },
    function (err, res) {
      if (err) throw err;
    }
  );
};

const getNamesId = () => {
  let employeeNames = [];
  let qryStmt = `SELECT 
                        CONCAT(first_name, ' ', last_name) AS name, 
                        id 
                    FROM Employees`;

  return connection
    .promise()
    .query(qryStmt)
    .then(([rows, fields]) => {
      for (let i = 0; i < rows.length; ++i) {
        employeeNames = [...employeeNames, rows[i].name];
      }
      return (empList = { employeeNames, rows });
    });
};

const getRolesId = () => {
  let roleTitles = [];
  let qryStmt = `SELECT 
                        title, 
                        id 
                    FROM Roles`;

  return connection
    .promise()
    .query(qryStmt)
    .then(([rows, fields]) => {
      for (let i = 0; i < rows.length; ++i) {
        roleTitles = [...roleTitles, rows[i].title];
      }
      return (rolesList = { roleTitles, rows });
    });
};

const getDeptsId = () => {
  let deptNames = [];
  let qryStmt = `SELECT
                        dept_name,
                        id
                    FROM Departments`;
  return connection
    .promise()
    .query(qryStmt)
    .then(([rows, fields]) => {
      for (let i = 0; i < rows.length; ++i) {
        deptNames = [...deptNames, rows[i].dept_name];
      }
      return (deptList = { deptNames, rows });
    });
};

const getMngrNamesId = () => {
  let mngrNames = [];
  let qryStmt = `SELECT DISTINCT 
                        CONCAT(m.first_name, ' ', m.last_name) AS managers, 
                        m.id 
                    FROM Employees 
                    INNER JOIN Employees m ON m.id = Employees.manager_id`;
  return connection
    .promise()
    .query(qryStmt)
    .then(([rows, fields]) => {
      for (let i = 0; i < rows.length; ++i) {
        mngrNames = [...mngrNames, rows[i].managers];
      }
      return (mngrList = { mngrNames, rows });
    });
};

async function getNameRoleId() {
  try {
    const empList = await getNamesId();
    const rolesList = await getRolesId();
    return await new Promise((resolve, reject) => {
      let empChoices = { empList, rolesList };
      if (empChoices) {
        resolve(empChoices);
      } else {
        reject();
      }
    });
  } catch (error) {
    if (error) console.log(error);
  }
}

const addEmployee = (firstName, lastName, roleId, managerId) => {
  let qryStmt = `INSERT INTO Employees SET ?`;

  return connection.promise().query(
    qryStmt,
    {
      first_name: firstName,
      last_name: lastName,
      role_id: roleId,
      manager_id: managerId,
    },
    function (err, res) {
      if (err) throw err;
    }
  );
};

const updateEmp = (empId, valueId) => {
  let qryStmt = `UPDATE Employees SET ? WHERE ?`;
  return connection.promise().query(
    qryStmt,
    [
      { ...valueId },
      {
        id: empId,
      },
    ],
    function (err, res) {
      if (err) throw err;
    }
  );
};

const delAny = (tableRowId, keyWord) => {
  const { row, id } = tableRowId;
  let qryStmt = `DELETE FROM ${keyWord}s WHERE ?`;
  return connection.promise().query(
    qryStmt,
    {
      id: id,
    },
    function (err, res) {
      if (err) throw err;
    }
  );
};

const quit = () => {
  connection.end();
};

module.exports = {
  initiateConnection,
  getAll,
  getEmpByDept,
  getEmpByMngr,
  getDeptBdgt,  
  addDept,
  addRole,
  getNamesId,
  getRolesId,
  getDeptsId,
  getNameRoleId,
  getMngrNamesId,
  addEmployee,
  updateEmp,
  delAny,
  quit,
};
