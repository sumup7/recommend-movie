'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Movie = loader.database.define(
  'movies',
  {
    movieId: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false
    },
    movieTitle: {
      type: Sequelize.STRING,
      allowNull: false
    },
    movieDetails: {
      type : Sequelize.STRING,
      allowNull: false
    },
    movieReview: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    movieReviewAll: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    // userId: {
    //   type: Sequelize.INTEGER,
    //   allowNull: false
    // },
    // username: {
    //   type: Sequelize.STRING,
    //   allowNull: false
    // },
    createdBy: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        fields: ['createdBy']
      }
    ]
  }
);

module.exports = Movie;