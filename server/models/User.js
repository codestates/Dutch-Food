module.exports = function(sequelize, DataTypes){
    const User = sequelize.define("User",{
      email:{
          type: DataTypes.STRING(20),
          allowNull : false
        },
      password: {
          type: DataTypes.STRING(20),
          allowNull : false
      },
      nickname:{
          type: DataTypes.STRING(20),
          allowNull : false
      },
    })
    return User
}