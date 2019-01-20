var app = getApp(); // 获取app实例

Page({
  data: {
    bgSrc: "https://pj-l.gitee.io/lpj/2018/image/bg.png"
  },
  uploadPhoto: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        app.globalData.uploadData = res;
        wx.navigateTo({
          url: '/pages/scene/scene',
        })
      }
    })
  }
})