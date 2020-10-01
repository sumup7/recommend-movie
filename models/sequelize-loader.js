'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'postgres://postgres:postgres@localhost/recommend_movie'
);

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};