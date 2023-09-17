const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "course_project_9o6f",
  "evil",
  "3UIX9Fb7E4720lXRfL5OzfTvIGnfBIwq",
  {
    host: "dpg-ck0ffqu3ktkc73e171gg-a.oregon-postgres.render.com",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
  }
);

module.exports = sequelize;
