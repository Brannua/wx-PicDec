var app = getApp();//可以获取到里面保存的上传的背景图片src

var cfg = {
  photo: {}, //用于保存背景图片的信息
  template: {}, //用于保存模板图片的信息
  scale: 1 //模板图片初始既不放大也不缩小缩放比例是1
}; //用来保存查询所得的元素数据，方便之后取用

// 定义模板图片缩放比例的最大值和最小值以避免无限制放大缩小
var SCALE = {
  MAX: 2,
  MIN: 0.01
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //模板图片们
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
    }, {
      cover: "../../image/7.jpg"
    }, {
      cover: "../../image/8.jpg"
    }, {
      cover: "../../image/9.jpg"
    }, {
      cover: "../../image/10.jpg"
    }, {
      cover: "../../image/11.jpg"
    }, {
      cover: "../../image/12.jpg"
    }],
    // 刚上传图片的时候模板图片默认为第一张
    currentNewScene: 0,
    // 设置画布的初始宽高
    canvasWidth: 0,
    canvasHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setCanvasSize(); // 设置画布大小
    // cfg中保存住模板图片左上角距离xy轴的距离
    cfg.template.x = 0;
    cfg.template.y = 0;
  },

  // 设置画布大小
  setCanvasSize: function () {
    var that = this; // 用于保存this指向，方便内部调用api时使用
    // 先要知道容器的高度和宽度
    wx.createSelectorQuery().select('#scene-editor').boundingClientRect(function (canvasWrapper) {
      // 将查询到的容器宽高保存到cfg中方便之后取用
      cfg.canvasWrapper = canvasWrapper;
      //获取上传的背景图片src
      var uploadDataSrc = app.globalData.uploadData.tempFilePaths[0];
      // 要知道图片原始的宽度和高度
      wx.getImageInfo({
        src: uploadDataSrc,
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
          // 保存住画布的宽高
          that.setData({
            canvasWidth: cfg.canvasWidth,
            canvasHeight: cfg.canvasHeight,
          });
          //有画布了再进行接下来画的操作
          that.drawNewScene(that.data.currentNewScene);
        }
      });
    }).exec();
  },

  // 画的操作
  drawNewScene: function (index) { //index是形式参数
    var uploadData = app.globalData.uploadData; //获取上传的背景图片
    var templates = this.data.templates; //将模板图片对象数组取出来

    // 先知道模板图片的原始宽高再画
    wx.getImageInfo({
      src: templates[index].cover,
      success(res) {
        // 模板图片的原始宽高
        var width = cfg.template.originalWidth = res.width;
        var height = cfg.template.originalHeight = res.height;

        // 记录下来现在模板图片画的是哪一张
        cfg.template.cover = templates[index].cover;

        // 获取到当前模板图片所在位置
        var x = cfg.template.x;
        var y = cfg.template.y;

        // 开始画
        const ctx = wx.createCanvasContext("scene"); //取画布
        ctx.drawImage(uploadData.tempFilePaths[0], 0, 0, cfg.canvasWidth, cfg.canvasHeight);
        ctx.drawImage(templates[index].cover, x, y, width, height);
        ctx.draw();
      }
    });
  },

  // 点击哪一张模板图片就画上哪一张模板图片
  onTapScene: function (event) {
    // 获取并保存住当前所点击的图片的index
    var index = event.currentTarget.dataset.index;
    this.setData({
      currentNewScene: index,
    });
    // 将点击选中的图片画上去
    this.drawNewScene(index);
  },

  // 开始触摸
  onTouchStart: function (event) {
    // 先判断是移动操作还是缩放操作
    if (event.touches.length > 1) {//开始缩放
      this.startZoom(event);
    } else {// 开始移动
      this.startMove(event);
    }
  },

  // 模板图片开始缩放
  startZoom: function (event) {
    // 先计算两缩放手指之间的初始距离并保存到cfg中
    var xMove = event.touches[1].clientX - event.touches[0].clientX;
    var yMove = event.touches[1].clientY - event.touches[0].clientY;
    cfg.initialDistance = Math.sqrt(xMove * xMove + yMove * yMove);
  },

  // 移动开始事件
  startMove: function (event) {
    var touchPoint = event.touches[0];
    // 获取模板图片的初始位置
    var x = cfg.template.x;
    var y = cfg.template.y;
    // 计算得到触摸点的偏移值并保存到cfg中
    cfg.offsetX = touchPoint.clientX - x;
    cfg.offsetY = touchPoint.clientY - y;
  },

  // 拖动图片的方法
  move: function (event) {
    var touchPoint = event.touches[0];
    // 计算出拖动模板图片结束后模板图片左上角的位置
    var x = touchPoint.clientX - cfg.offsetX;
    var y = touchPoint.clientY - cfg.offsetY;
    // 记录住图片被拖动后的位置(实时更新模板图片的位置)
    cfg.template.x = x;
    cfg.template.y = y;
    
    // 获取模板图片的原始宽高方便进行等比例缩放
    var width = cfg.template.originalWidth;
    var height = cfg.template.originalHeight;
    // 计算新的模板图片宽(因为有可能在拖拽图片前进行了图片缩放)
    var newWidth = width * cfg.scale;
    // 计算新的模板图片高(等比缩放)
    var newHeight = newWidth * height / width;

    //算好之后开始画
    var uploadData = app.globalData.uploadData; //获取上传的背景图片
    var ctx = wx.createCanvasContext("scene"); //取画布
    ctx.drawImage(uploadData.tempFilePaths[0], 0, 0, cfg.canvasWidth, cfg.canvasHeight);
    ctx.drawImage(cfg.template.cover, x, y, newWidth, newHeight);
    ctx.draw();
  },

  // 模板图片缩放
  zoom: function (event) {
    // 先计算当前的手指之间的距离(勾股定理算距离)
    var xMove = event.touches[1].clientX - event.touches[0].clientX;
    var yMove = event.touches[1].clientY - event.touches[0].clientY;
    cfg.curDistance = Math.sqrt(xMove * xMove + yMove * yMove); //勾股定理算距离

    // 不能无限制地放大
    cfg.scale = Math.min(cfg.scale + 0.0001 * (cfg.curDistance - cfg.initialDistance), SCALE.MAX);
    // 不能无限制地缩小
    cfg.scale = Math.max(cfg.scale, SCALE.MIN);

    // 开始画新的缩放后的模板图片
    var uploadData = app.globalData.uploadData; //获取上传的背景图片
    var template = cfg.template;
    // 获取模板图片原始宽高
    var height = template.originalHeight;
    var width = template.originalWidth;
    // 计算新的模板图片宽
    var newWidth = width * cfg.scale;
    // 计算新的模板图片高(等比缩放)
    var newHeight = newWidth * height / width;

    var ctx = wx.createCanvasContext('scene');
    ctx.drawImage(uploadData.tempFilePaths[0], 0, 0, cfg.canvasWidth, cfg.canvasHeight);
    ctx.drawImage(template.cover, template.x, template.y, newWidth, newHeight);
    ctx.draw();
  },

  // 移动中
  onTouchMove: function (event) {
    // 先判断是移动操作还是缩放操作
    if (event.touches.length > 1) {
      // 缩放中
      this.zoom(event);
    } else {
      // 由于缩放结束的一瞬间触发touchEnd事件
      // 相当于又一次触碰到了屏幕 会触发此函数
      // 为了解决这个问题 如下
      // 离上次结束小于600ms 不处理 解决缩放bug
      if (new Date().getTime() - cfg.endTime < 600) {
        return;
      }
      // 移动中
      this.move(event);
    }
  },

  //缩放结束的一瞬间触发的函数，用来解决模板图片瞬间跳转的bug 
  onTouchEnd: function () {
    var date = new Date();
    cfg.endTime = date.getTime();
  },

  // 保存图片
  downloadPic: function () {
    var canvasWidth = cfg.canvasWidth;
    var canvasHeight = cfg.canvasHeight;

    wx.canvasToTempFilePath({
      width: canvasWidth,
      height: canvasHeight,
      destWidth: canvasWidth * 2,
      destHeight: canvasHeight * 2,
      canvasId: 'scene',
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功'
            })
          }
        })
      }
    });
  },
});