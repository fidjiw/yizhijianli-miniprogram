// 微信云开发 - 登录函数
const cloud = require('wx-server-sdk');

// 初始化云环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  try {
    // 获取用户的 openid 和 unionid
    const { OPENID, UNIONID, APPID } = wxContext;

    // 生成 token（使用 openid 作为 token）
    const token = OPENID;
    const loginTime = new Date().getTime();

    // 保存登录信息到数据库
    const users = db.collection('users');

    await users.where({
      _openid: OPENID
    }).get().then(async res => {
      if (res.data.length === 0) {
        // 新用户，插入数据库
        await users.add({
          data: {
            _openid: OPENID,
            createdAt: db.serverDate(),
            updatedAt: db.serverDate(),
            lastLoginAt: db.serverDate()
          }
        });
      } else {
        // 现有用户，更新最后登录时间
        await users.doc(res.data[0]._id).update({
          data: {
            lastLoginAt: db.serverDate()
          }
        });
      }
    });

    return {
      code: 0,
      msg: '登录成功',
      data: {
        token: token,
        userId: OPENID,
        openid: OPENID,
        loginTime: loginTime
      }
    };
  } catch (error) {
    console.error('登录失败:', error);
    return {
      code: 1,
      msg: '登录失败：' + error.message
    };
  }
};
