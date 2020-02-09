# wx-Pic装扮

-  从期末考试结束开始着手做这个小程序，到2019.1.22正式上线，今天终于有时间来总结一下这些日子学到的东西，以便回顾。

-  Firstly，这是一款用于图片编辑的工具小程序，(可以操作一波表情包有木有？哈~)，来认识一哈它吧~

![](./img/demo.png)

### 它的功能

- 你可以从主页面上传相册中的图片

- 上传成功后会自动跳转到图片编辑页面

- 你可任意挑选底部滚动栏的挂饰并用手指调整挂饰的大小和位置

- 点击保存并同意保存权限后小程序就会将编辑好的图片保存在你的相册中啦~

- 接下来，你可以分享 or 斗图 or 。。。if you like

  - ps: [挂件来源](https://github.com/lewky/bilibili-avatar-pendant)

### 重要知识点

- 了解了wxml,wxss,其实就是wxml<->html wxss<->css,微信小程序作为一个框架,在wxml中提供了很多组件供我们使用

- 微信小程序有丰富而强大的Api接口，此款小程序使用到的有

  ```
  上传图片：wx.chooseImage({...})
  返回一个SelectorQuery对象实例: wx.createSelectorQuery()
  获取图片信息：wx.getImageInfo({})
  创建画布地图：wx.createCanvasContext("canvasId")
  当前画布指定区域内容导出生成指定大小的图片: wx.canvasToTempFilePath({})
  保存图片到系统相册：wx.saveImageToPhotosAlbum({})
  显示消息提示框：wx.showToast({})
  ```

- canvas和swiper的引入使用，引入了一些模板挂饰，制作完成界面UI并实现路由跳转

- 图片大小自适应原理：

  - 首先： wx.createSelectorQuery()得到容器宽高,然后wx.getImageInfo({})得到上传的图片的宽高。

  - 分为两种情况：1.图片瘦高 2.图片胖宽 (正方形图片可任意归并到其一)

    - 1.图片瘦高->即：图片高度/图片宽度 > 容器高度/容器宽度,则 -> 画布高=容器高,再由等比例缩放原理计算画布宽

    - 2.图片胖宽->即：图片高度/图片宽度 < 容器高度/容器宽度,则 -> 画布宽=容器宽,再由等比例缩放原理计算画布高

  - 等比例缩放原理：图片宽/图片高=画布宽/画布高

- 图片拖动原理：

  - 其实挂饰图片拖拽原理和最初的电影原理是一样的，都是由一帧帧的画面连起来形成了一种移动的视觉效果。

  - 具体来说，我们可以获取到的值有：挂饰图片的clientX，clientY；触摸点的clientX，clientY；

    - 偏移值x=触摸点的clientX - 挂饰图片的clientX

    - 偏移值y=触摸点的clientY - 挂饰图片的clientY

    - 偏移值x和偏移值y在拖拽过程中保持不变！

  - And then~

    - 拖拽一旦开始，每时每刻我们都能获取到touchPoint的clientX和clientY，分别减去对应的偏移值便可得到挂饰图片新位置的clientX和clientY，并进行实时更新(实时更新就是拖拽过程中不停地画新的场景)

    - 由于有可能在拖拽图片前进行了图片缩放 所以需要获取挂饰图片的原始宽高后由当前的缩放比例计算新的模板图片宽高

    - 挂饰图片拖动结束都要记录下来其位置，这样更换挂饰时就会在当前挂饰位置而不会归位

- 图片缩放原理：

  - 由勾股定理计算当前两手指之间的距离,核心实现代码如下

    ```
    cfg.scale = cfg.scale + 0.0001 * (cfg.curDistance - cfg.initialDistance);
    ```

  - 算出缩放比例后，结合等比例缩放原理，在缩放过程中不停地画新场景以实现缩放

  - 缩放比例需记录，防止更换挂饰时挂饰大小复原

  - 可以设置不能无限放大或缩小

- 触摸事件中，要判断执行的是拖拽操作还是缩放操作，可由触摸点的个数，即event.touches.length是否大于一来判断

- 缩放操作有一个隐藏较深的bug如下

  - 由于缩放结束的一瞬间触发touchEnd事件，相当于又一次触碰到了屏幕 会触发此函数🌚，为了解决这个问题，设置若离上次结束小于600ms，则不处理

    ```
    onTouchEnd: function() {
        var date = new Date();
        cfg.endTime = date.getTime();
    }

    if (new Date().getTime() - cfg.endTime < 600) {
        return;
    } else {this.move(event);}
    ```

### ❤Finished

- 终于总结完啦~撒花撒花~

- 加油！