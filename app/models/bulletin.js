var Sequelize = require("sequelize");

var sequelize = require("../config/connection.js");

var bulletinPost = sequelize.define('Bulletin', {
	subject: {
	type: Sequelize.TEXT
	},
	name: {
	type: Sequelize.TEXT
	},
	added_notes: {
	type: Sequelize.TEXT
	},
	start_time: {
	type: Sequelize.INTEGER
	},
	end_time: {
	type: Sequelize.INTEGER
	},
	start_date: {
	type: Sequelize.DATE
	},
	end_date: {
	type: Sequelize.DATE
	},
	human_id: {
	type: Sequelize.INTEGER
	}
});

module.exports = bulletinPost;