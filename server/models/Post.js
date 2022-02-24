module.exports = function(sequelize, DataTypes){
    const Post = sequelize.define("Post",{
      user_id:{
          type: DataTypes.INTEGER(10),
          allowNull : false
        },
      title: {
          type: DataTypes.STRING(20),
          allowNull : false
      },
      address:{
          type: DataTypes.STRING(20),
          allowNull : false
      },
      menu:{
        type: DataTypes.STRING(20),
        allowNull : false
      },
      delivery_charge:{
        type: DataTypes.INTEGER(20),
        allowNull : false
      },
      recruit_volume:{
        type: DataTypes.STRING(20),
        allowNull : false
      },
      bank_name:{
        type: DataTypes.STRING(20),
        allowNull : false
      },
      account_number:{
        type: DataTypes.INTEGER(20),
        allowNull : false
      },
      content:{
        type: DataTypes.STRING(20),
        allowNull : false
      }

    })
    return Post
}