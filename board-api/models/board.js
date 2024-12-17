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
      // Board는 User에 속함
      db.Board.belongsTo(db.User) // 수정된 부분: db.Post가 아니라 db.Board로 변경

      // Board와 Hashtag는 다대다 관계
      db.Board.belongsToMany(db.Hashtag, { through: 'BoardHashtag' })
   }
}
