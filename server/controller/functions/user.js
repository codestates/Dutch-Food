const { sign, verify } = require('jsonwebtoken');
const { user } = require('./../../models');
const bcrypt = require('bcrypt');

const authorized = (accessToken) => {
    if (!accessToken) return null;
    try {
      return verify(accessToken, process.env.ACCESS_SECRET);
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  module.exports = {
    generateAccessToken: (data) => {
        return sign(data, process.env.ACCESS_SECRET, { expiresIn: '2h' });
      },

    sendAccessToken: (res, accessToken) => {
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        expires: new Date(Date.now() + 1 * 1000 * 60 * 60 * 24),
      });
    },
    
    isAuthorized: (req) => {
      const accessToken = req.cookies.accessToken;
            if (!accessToken) return null;
       try {
         return verify(accessToken, process.env.ACCESS_SECRET);
      } catch (err) {
         console.log(err);
         return null;
      }
    },

    updateNickname: async (req) => {
      const resObject = {};
      const accessToken = authorized(req.cookies.accessToken);
  
      if (!accessToken) {
        resObject.code = 401;
        resObject.message = '로그인 시간이 만료되었습니다';
  
        return resObject;
      }
  
      if (req.body.nickName) {
        const userFindOne = await user.findOne({
          where: { nickName: req.body.nickName },
        });
  
        try {
          if (userFindOne) {
            resObject.code = 204;
            throw '닉네임 중복입니다';
          }
        } catch (error) {
          console.log(error);
          return resObject;
        }
      }

      const userData = await user.findOne({ where: { userId: accessToken.userId } });
      const match = await bcrypt.compare(req.body.password, userData.dataValues.password);
      if (!match) {
        resObject.code = 400;
        throw '비밀번호를 잘못 입력하였습니다';
      }
      
      await user
        .update(req.body, {
          where: { userId: accessToken.userId },
        })
        .then(() => {
          resObject.code = 201;
          resObject.message = '유저 정보를 수정하였습니다';
        })
        .catch(() => {
          resObject.code = 400;
          resObject.message = '유저 정보를 수정하지 못하였습니다';
        });
  
      return resObject;
    },

    updatePassword: async (req) => {
      const resObject = {};
      const accessToken = authorized(req.cookies.accessToken);
  
      try {
        if (!accessToken) {
          resObject.code = 401;
          throw '로그인하여 주시기 바랍니다';
        }
  
        const userData = await user.findOne({ where: { userId: accessToken.userId } });
        const match = await bcrypt.compare(req.body.oldPassword, userData.dataValues.password);
        if (!match) {
          resObject.code = 400;
          throw '비밀번호를 잘못 입력하였습니다';
        }
  
        const password = await hashPassword(req.body.password);
        await user
          .update(
            {
              password,
            },
            {
              where: { userId: userData.dataValues.userId },
            }
          )
          .then(() => {
            resObject.code = 201;
            resObject.message = '비밀번호가 변경 되었습니다';
          })
          .catch((error) => {
            console.log(error);
            resObject.code = 500;
            resObjectmessage = '서버에 오류가 발생했습니다';
          });
      } catch (error) {
        console.log(error);
        resObject.message = error;
      }
      return resObject;
    },

    unregister : async (req) => {
      const resObject = {};
      const accessToken = authorized(req.cookies.accessToken);
  
      try {
        if (!accessToken) {
          resObject.code = 401;
          throw '로그인하여 주시기 바랍니다';
        }
        // 소셜관련은 일단 미뤘습니다.
        // if(req.body.social){
        //   await user.update({
        //     expiredDatetime: new Date(),
        //   }, {
        //     where: {userId: accessToken.userId}
        //   });
  
        //   await chat_member.update({
        //     left: 'left'
        //   }, {
        //     where: {userId: accessToken.userId}
        //   });
  
        //   await guide_user_participate.destroy({
        //     where: {userId: accessToken.userId}
        //   })
  
        //   resObject.code = 201;
        //   resObject.message = '회원탈퇴 되었습니다';
        //   return resObject;
        // }
  
        const userData = await user.findOne({ where: { userId: accessToken.userId } });
        const match = await bcrypt.compare(req.body.password, userData.dataValues.password);
        if (!match) {
          resObject.code = 400;
          throw '비밀번호를 잘못 입력하였습니다';
        }
  
        await user
          .update(
            {
              expiredDatetime: new Date(),
            },
            {
              where: { userId: userData.dataValues.userId },
            }
          )
          .then(() => {
            resObject.code = 201;
            resObject.message = '회원탈퇴 되었습니다';
          })
          .catch((error) => {
            console.log(error);
            resObject.code = 500;
            resObject.message = '서버에 오류가 발생했습니다';
          });
      } catch (error) {
        console.log(error);
        resObject.message = error;
      }
      return resObject;
    }
  }