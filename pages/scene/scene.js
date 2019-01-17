// pages/scene/scene.js

var app = getApp();

var cfg = {
  photo: {}, //用于保存背景图片的信息
  template: {} //用于保存模板图片的信息
}; //用来保存查询所得的元素数据，方便之后取用

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //六个模板图片
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
    currentNewScene: 0,
    canvasWidth: 0,
    canvasHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
          //将图片的路径宽高等重要信息保存下来
          cfg.photo.path = res.path;
          var originalHeight = cfg.photo.originalHeight = res.height;
          var originalWidth = cfg.photo.originalWidth = res.width;
          // 计算画布的宽度和高度
          if ( //图片瘦高
            originalHeight / originalWidth > cfg.canvasWrapper.height / cfg.canvasWrapper.width
          ) {
            cfg.canvasHeight = cfg.canvasWrapper.height;
            cfg.canvasWidth = originalWidth * cfg.canvasHeight / originalHeight;
          } else { //图片胖宽或者正好和容器成比例
            cfg.canvasWidth = cfg.canvasWrapper.width;
            cfg.canvasHeight = originalHeight * cfg.canvasWidth / originalWidth;
          }
          //保存住画布的宽高
          that.setData({
            canvasWidth: cfg.canvasWidth,
            canvasHeight: cfg.canvasHeight
          });

          that.drawNewScene(that.data.currentNewScene); //有画布了再进行接下来画的操作
        }
      });
    }).exec();
  },

  // 画的操作
  drawNewScene: function(index) { //index是形式参数
    var uploadData = app.globalData.uploadData; //获取上传的背景图片
    var templates = this.data.templates; //将模板图片对象数组取出来

    const ctx = wx.createCanvasContext("scene"); //取画布


    // 先知道模板图片的原始宽高再进行等比例缩放
    wx.getImageInfo({
      src: templates[index].cover,
      success(res) {
        var width = cfg.template.originalWidth = res.width;
        var height = cfg.template.originalHeight = res.height;
        // 获取模板图片的初始位置
        var x = cfg.template.x;
        var y = cfg.template.y;

        // width \ heigt = 100 \ ?  等比例缩放模板图片

        ctx.drawImage(uploadData.tempFilePaths[0], x, y, cfg.canvasWidth, cfg.canvasHeight);
        ctx.drawImage(templates[index].cover, 0, 0, 160, 160 * height / width);
        ctx.draw();
      }
    });
  },

  // 点击哪一张模板图片就画上哪一张模板图片
  onTapScene: function(event) {
    // 获取并保存住当前所点击的图片的index
    var index = event.currentTarget.dataset.index;

    this.setData({
      currentNewScene: index,
    });

    // cfg中保存住模板图片左上角距离xy轴的距离
    cfg.template.x = 0;
    cfg.template.y = 0;

    // 将点击选中的图片放上去
    this.drawNewScene(index);
  },

  // 拖动模板图片
  onTouchStart: 　 function(event) {
    console.log(event);
    var touchPoint = event.touches[0];
    // 获取模板图片的初始位置
    var x = cfg.template.x;
    var y = cfg.template.y;

    // 计算得到触摸点的偏移值并保存到cfg中
    cfg.offsetX = touchPoint.clientX - x;
    cfg.offsetY = touchPoint.clientY - y;
  },

  // 模板图片的拖动事件
  onTouchMove: function(event) {

    var touchPoint = event.touches[0];
    console.log(touchPoint);

    // 计算出拖动模板图片结束后模板图片左上角的位置
    // cfg.offsetX = touchPoint.clientX - x
    // cfg.offsetY = touchPoint.clientY - y
    x = cfg.offsetX - touchPoint.clientX;
    y = cfg.offsetY - touchPoint.clientY;
  }
});