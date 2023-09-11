const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "course_project",
  "root",
  "root",
  {
    host: "localhost", 
    dialect: "mysql", 
    port: 3306,
    logging: false,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
