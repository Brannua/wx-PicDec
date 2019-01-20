var app = getApp();// 获取app实例

Page({
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