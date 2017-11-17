var Sequelize = require("sequelize");

var sequelize = require("../config/connection.js");

  var Human = sequelize.define('human', {

      first_name: {
        type:Sequelize.TEXT
      },
      last_name: {
        type: Sequelize.TEXT
      },
      username: {
        type: Sequelize.TEXT
      },
      password: {
        type: Sequelize.TEXT
      },
      email: {
        type: Sequelize.TEXT
      },
      // TODO, generate a cups_of_sugar field for users: {
      //   type: Sequelize.INTEGER
      // },
      autocomplete: {
        type: Sequelize.TEXT
      },
      street_number: {
        type: Sequelize.TEXT
      },
      route:{
        type: Sequelize.TEXT
      },
      locality:{
        type: Sequelize.TEXT
      },
      administrative_area_level_1:{
        type: Sequelize.TEXT
      },
      postal_code:{
        type: Sequelize.TEXT
      },
      address_lat: {
    type: Sequelize.DECIMAL(18, 14)
   },
   address_lng: {
     type: Sequelize.DECIMAL(18, 14)
   }
  })


module.exports = Human;
