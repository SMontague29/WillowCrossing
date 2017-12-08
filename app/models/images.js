var Sequelize = require("sequelize");

var sequelize = require("../config/connection.js");


var Image = sequelize.define('Image', {
    img_url: {
      type: Sequelize.TEXT
    },
    human_id: {
      type: Sequelize.INTEGER
    }
  })

module.exports = Image;