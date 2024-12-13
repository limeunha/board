const Sequelize = require('sequelize')

module.exports = class Board extends Sequelize.Model {
   static init(sequelize) {
      return super.init(
         {
            //글내용
            content: {
               type: Sequelize.TEXT,
               allowNull: false,
            },
            //이미지 경로 및 파일명
            img: {
               type: Sequelize.STRING(200),
               allowNull: true,
            },
         },
         {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Board',
            tableName: 'Boards',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
         }
      )
   }
   static associate(db) {
      db.Board.belongsTo(db.User)
   }
}
