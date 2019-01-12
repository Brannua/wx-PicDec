// pages/scene/scene.js

var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    var uploadData = app.globalData.uploadData;

    const ctx = wx.createCanvasContext("scene"); //取画布

    ctx.drawImage(uploadData.tempFilePaths[0], 0, 0);

    ctx.draw();

  },
})