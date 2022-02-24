module.exports = function(sequelize, DataTypes){
    const Comment = sequelize.define("Comment",{
      post_id:{
          type: DataTypes.INTEGER(10),
          allowNull : false
        },
      applicant_id: {
          type: DataTypes.STRING(20),
          allowNull : false
      },
      comment_content:{
          type: DataTypes.STRING(20),
          allowNull : false
      },
    })
    return Comment
}