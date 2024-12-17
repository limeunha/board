const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('../config/config')[env]

const User = require('./user')
const Board = require('./board')
const Hashtag = require('./hashtag')

const db = {}
const sequelize = new Sequelize(config.database, config.username, config.password, config)

db.sequelize = sequelize
db.User = User
db.Board = Board
db.Hashtag = Hashtag

User.init(sequelize)
Board.init(sequelize)
Hashtag.init(sequelize)

User.associate(db)
Board.associate(db)
Hashtag.associate(db)

module.exports = db
