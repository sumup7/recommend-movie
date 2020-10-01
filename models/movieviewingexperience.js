'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const MovieViewingExperience = loader.database.define(
  'movieviewingexperiences',
  {
    userId: {
      type: Sequelize.INTEGER,
      primaryKey:true,
      allowNull: false
    },
    movieviewingexperience: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    movieId: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false
    }
    },
    {
      freezeTableName: true,
      timestamps: false,
      indexes: [
        {
          fields: ['movieId']
        }
      ]
  }
)
module.exports = MovieViewingExperience;