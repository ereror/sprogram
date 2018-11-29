function convertToGrayscale(data) {
  let g = 0
  for (let i = 0; i < data.length; i += 4) {
    g = (data[i] * 0.3 + data[i+1] * 0.59 + data[i+2] * 0.11)
    data[i] = g
    data[i+1] = g
    data[i+2] = g
  }
  return data
}

Page({
  data: {
    imgsrc: '',
    imgW: 0,
    imgH: 0,
    byclear: 1,
    zoommodel: false
  },
  onReady() {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        let byclear = res.screenWidth / 375
        that.setData({
          byclear
        })
      },
    })
  },

  openAndDraw() {
    var that = this
    wx.chooseImage({
      success: (res) => {
        console.log(res)
        that.setData({
          imgsrc: res.tempFilePaths[0],
          res
        })
      }
    })
  },
  checkwh(e){
    console.log(e)
    var vhsrc = e.detail.height / e.detail.width
    let res = this.data.res
    let byclear = this.data.byclear
    let zoommode = this.data.zoommodel
    const ctx = wx.createCanvasContext('canvasIn', this);
    if ((e.detail.width > 375 * byclear) && !zoommode) ctx.scale(375 * byclear / e.detail.width, 375 * byclear / e.detail.width);
    ctx.drawImage(res.tempFilePaths[0], 0, 0, e.detail.width, e.detail.width * vhsrc)
    ctx.draw()
    if (!zoommode) {
      this.setData({
        // imgW: e.detail.width * 2 / byclear,
        // imgH: e.detail.height * 2 / byclear
        imgW: e.detail.width > 375 ? 750 : e.detail.width * 2 / byclear,
        imgH: e.detail.width > 375 ? 750 * vhsrc : e.detail.width * vhsrc * 2 / byclear
      })
    } else {
      this.setData({
        imgW: e.detail.width * 2 / byclear,
        imgH: e.detail.height * 2 / byclear
      })
    }
  },
  export() {
    wx.canvasToTempFilePath({
      canvasId: 'canvasOut',
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: (res) => {
            console.log(res)
          },
          fail: (err) => {
            console.error(err)
          }
        })
      },
      fail: (err) => {
        console.error(err)
      }
    }, this)
  },
  gozoom(){
    let zoomnodel = !this.data.zoommodel
    if (zoomnodel) {

    }
    this.setData({
      zoommodel: zoomnodel
    })
  },
  process() {
    const cfg = {
      x: 0,
      y: 0,
      width: 300,
      height: 300,
    }
    wx.canvasGetImageData({
      canvasId: 'canvasIn',
      ...cfg,
      success: (res) => {
        const data = convertToGrayscale(res.data)
        wx.canvasPutImageData({
          canvasId: 'canvasOut',
          data,
          ...cfg,
          success: (res) => {
            console.log(res)
          },
          fail: (err) => {
            console.error(err)
          }
        })
      },
      fail: (err) => {
        console.error(err)
      }
    })
  }
})
