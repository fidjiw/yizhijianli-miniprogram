// 微信云开发 - 获取用户信息函数
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { nickName, avatarUrl } = event;

  try {
    const OPENID = wxContext.OPENID;

    // 更新用户信息
    const users = db.collection('users');

    await users.where({
      _openid: OPENID
    }).get().then(async res => {
      if (res.data.length > 0) {
        await users.doc(res.data[0]._id).update({
          data: {
            nickName: nickName,
            avatarUrl: avatarUrl,
            updatedAt: db.serverDate()
          }
        });
      }
    });

    return {
      code: 0,
      msg: '用户信息已保存',
      data: {
        userId: OPENID,
        nickName: nickName,
        avatarUrl: avatarUrl
      }
    };
  } catch (error) {
    console.error('保存用户信息失败:', error);
    return {
      code: 1,
      msg: '保存失败：' + error.message
    };
  }
};
