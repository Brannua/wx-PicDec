// pages/scene/scene.js

var app = getApp();

var cfg = {
  photo: {}
}; //用来保存查询所得的元素数据，方便之后取用

Page({
  /**
   * 页面的初始数据
   */
  data: {
    templates: [{
      cover: "../../image/1.jpg"
    }, {
      cover: "../../image/2.jpg"
    }, {
      cover: "../../image/3.jpg"
    }, {
      cover: "../../image/4.jpg"
    }, {
      cover: "../../image/5.jpg"
    }, {
      cover: "../../image/6.jpg"
    }],

    currentNewScene: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // var uploadData = app.globalData.uploadData;

    // this.drawNewScene(this.data.currentNewScene);

    this.setCanvasSize(); // 设置画布大小
  },

  // 设置画布大小
  setCanvasSize: function() {
    var that = this; // 用于保存this指向，方便内部调用api时使用
    // 先要知道容器的高度和宽度
    wx.createSelectorQuery().select('#scene-editor').boundingClientRect(function(canvasWrapper) {
      // 将查询到的宽高保存到cfg中方便之后取用
      cfg.canvasWrapper = canvasWrapper;
      // 要知道图片原始的宽度和高度
      wx.getImageInfo({
        src: that.data.templates[0].cover,
        success(res) {
          console.log(res);
          //将图片的路径宽高等重要信息保存下来
          cfg.photo.path = res.path;
          cfg.photo.originalHeight = res.height;
          cfg.photo.originalWidth = res.width;
        }
      });
    }).exec();
  },

  onTapScene: function(event) {
    console.log(event);
    var index = event.currentTarget.dataset.index;
    // 保存住当前所点击的图片的index
    this.setData({
      currentNewScene: index,
    });
    // 将点击选中的图片放上去
    this.drawNewScene(index);
  },

  drawNewScene: function(index) { //index是形式参数
    var uploadData = {
      "errMsg": "chooseImage:ok",
      "tempFilePaths": ["https://isujin.com/wp-content/themes/Diaspora/timthumb/timthumb.php?src=https://isujin.com/wp-content/uploads/2018/11/wallhaven-672007-1.png"],
      "tempFiles": [{
        "path": "https://isujin.com/wp-content/themes/Diaspora/timthumb/timthumb.php?src=https://isujin.com/wp-content/uploads/2018/11/wallhaven-672007-1.png",
        "size": 81478
      }]
    };
    var templates = this.data.templates; //将数组取出来

    const ctx = wx.createCanvasContext("scene"); //取画布
    ctx.drawImage(uploadData.tempFilePaths[0], 0, 0);
    ctx.drawImage(templates[index].cover, 0, 0, 100, 60);
    ctx.draw();
  }
})



// if (
//   photo.originalHeight / photo.originalWidth > canvasWrapper.height / canvasWrapper.width
// ) {
//   canvasHeight = canvasWrapper.height;
//   canvasWidth = photo.originalWidth * canvasHeight / photo.originalHeight;
// } else {
//   canvasWidth = canvasWrapper.width;
//   canvasHeight = photo.originalHeight * canvasWidth / photo.originalWidth;
// }