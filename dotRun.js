export default class dotRun {
  constructor(dom, obj = {}) {
    if (!dom) {
      return
    }
    this.canvas = dom.nodeType ? dom : document.querySelector(dom)
    if (!this.canvas.getContext('2d')) {
      return
    }
    this.context = this.canvas.getContext('2d')
    this.dotArr = []
    this.timer = null
    this.disX = 0
    this.disY = 0
    if (obj.canvasWidth === 'full') {
      obj.canvasWidth = document.documentElement.offsetWidth
    }
    if (obj.canvasHeight === 'full') {
      obj.canvasHeight = document.documentElement.offsetHeight
    }
    this.canvasSet = {
      isHover: obj.isHover || false,
      width: obj.canvasWidth || 1000,
      height: obj.canvasHeight || 300,
      dotsNumber: obj.dotsNumber || 200,
      dotsRadius: obj.dotsRadius || 3,
      lineLength: obj.lineLength || 50,
      speedX: obj.speedX || 2,
      speedY: obj.speedY || 1.5,
      mouseLineLength: obj.mouseLineLength || 100,
      mouseColor: obj.mouseColor || '#f00',
      canvasBackColor: obj.canvasBackColor || 'transparent',
      ArcColor: obj.ArcColor || '#333',
      lineColor: obj.lineColor || '#ccc'
    }
    this.createDotsArr()
    this.initCanvas()
    if (this.canvasSet.isHover) {
      this.addEvent()
    }
    window.addEventListener('resize', () => {
      clearInterval(this.playingTimer)
      this.initCanvas()
      if (this.canvasSet.isHover) {
        this.addEvent()
      }
    })
  }
  
  addEvent() {
    this.canvas.addEventListener('mousemove', (ev) => {
      ev = ev || event
      this.disX = (ev.clientX - this.canvas.offsetLeft) * (this.canvasSet.width / this.canvas.offsetWidth)
      this.disY = (ev.clientY - this.canvas.offsetTop + this.getScrollTop()) * (this.canvasSet.height / this.canvas.offsetHeight)
    })
    this.canvas.addEventListener('mouseleave', (ev) => {
      this.disX = this.disY = -100
    })
  }
  
  colorHex(that) {
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
    if (/^(rgb|RGB)/.test(that)) {
      let aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, '').split('', '')
      let strHex = '#'
      for (let i = 0; i < aColor.length; i++) {
        let hex = Number(aColor[i]).toString(16)
        if (hex === '0') {
          hex += hex
        }
        strHex += hex
      }
      if (strHex.length !== 7) {
        strHex = that
      }
      return strHex
    } else if (reg.test(that)) {
      let aNum = that.replace(/#/, '').split('')
      if (aNum.length === 6) {
        return that
      } else if (aNum.length === 3) {
        let numHex = '#'
        for (let i = 0; i < aNum.length; i += 1) {
          numHex += (aNum[i] + aNum[i])
        }
        return numHex
      }
    }
    return that
  }
  
  colorRgb(sColor) {
    sColor = sColor.toLowerCase()
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        let sColorNew = '#'
        for (let i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
        }
        sColor = sColorNew
      }
      let sColorChange = []
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
      }
      return 'RGB(' + sColorChange.join(',') + ')'
    }
    return sColor
  };
  
  // 初始化canvas
  initCanvas() {
    console.log(this.colorRgb('#f00'))
    this.canvas.width = this.canvasSet.width
    this.canvas.height = this.canvasSet.height
    this.canvas.style.backgroundColor = this.canvasSet.canvasBackColor
    this.canvas.style.float = 'left'
    this.playing()
  }
  
  // 获取滚动条高度,处理兼容性
  getScrollTop() {
    let scrollTop = 0
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop
    } else if (document.body) {
      scrollTop = document.body.scrollTop
    }
    return scrollTop
  }
  
  // 运动
  playing() {
    this.playingTimer = null
    clearInterval(this.playingTimer)
    this.playingTimer = setInterval(() => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.lineRun(this.dotArr)
      if (this.canvasSet.isHover) {
        this.mouseLine(this.disX, this.disY, this.dotArr, this.context)
      }
      for (let i = 0; i < this.dotArr.length; i++) {
        this.createArc(this.dotArr[i].x += this.dotArr[i].vx * this.dotArr[i].lt, this.dotArr[i].y += this.dotArr[i].vy * this.dotArr[i].lt, this.context)
        if (this.dotArr[i].x >= this.canvas.width) {
          this.createArc(this.canvas.width * 2 - this.dotArr[i].x, this.dotArr[i].y, this.context)
        }
        if (this.canvas.width - this.dotArr[i].x <= 0) {
          this.dotArr[i].x = 0
          this.createArc(this.dotArr[i].x += this.dotArr[i].vx * this.dotArr[i].lt, this.dotArr[i].y, this.context)
        }
        if (this.dotArr[i].y >= this.canvas.height) {
          this.createArc(this.dotArr[i].x, this.canvas.height * 2 - this.dotArr[i].y, this.context)
        }
        if (this.canvas.height - this.dotArr[i].y <= 0) {
          this.dotArr[i].y = 0
          this.createArc(this.dotArr[i].x, this.dotArr[i].y += this.dotArr[i].vy * this.dotArr[i].lt, this.context)
        }
      }
    }, 30)
  }
  
  // 创建点数组
  createDotsArr() {
    for (let i = 0; i < this.canvasSet.dotsNumber; i++) {
      this.dotArr.push({
        x: Math.random() * this.canvasSet.width,
        y: Math.random() * this.canvasSet.height,
        lt: Math.random() > 0.5 ? 1 : -1, // 随机方向
        vx: Math.random() * this.canvasSet.speedX, // 随机x方向速度
        vy: Math.random() * this.canvasSet.speedY // 随机y方向速度
      })
    }
  }
  
  // 绘制线
  createLine(x1, y1, x2, y2, cxt, color = this.canvasSet.lineColor) {
    cxt.beginPath()
    cxt.moveTo(x1, y1)
    cxt.lineTo(x2, y2)
    cxt.lineWidth = 0
    cxt.strokeStyle = color
    cxt.stroke()
    cxt.closePath()
  }
  
  // 绘制点
  createArc(x, y, cxt, color = this.canvasSet.ArcColor) {
    cxt.beginPath()
    cxt.arc(x, y, this.canvasSet.dotsRadius, 0, 2 * Math.PI)
    cxt.fillStyle = color
    cxt.fill()
    cxt.closePath()
  }
  
  // 连线
  lineRun(arr) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        if (this.disDots(arr[j].x, arr[j].y, arr[i].x, arr[i].y) < this.canvasSet.lineLength * 1) {
          let opacity = 1 - this.disDots(arr[j].x, arr[j].y, arr[i].x, arr[i].y) / this.canvasSet.lineLength
          this.createLine(arr[j].x, arr[j].y, arr[i].x, arr[i].y, this.context, this.colorRgb(this.canvasSet.lineColor).replace(')', `,${opacity})`).replace('RGB', 'RGBA'))
        }
      }
    }
  }
  
  // 计算点与点之间的距离值
  disDots(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(Math.abs(x2 - x1), 2) + Math.pow(Math.abs(y2 - y1), 2))
  }
  
  // 计算鼠标位置,若小于定义值,连接两点
  mouseLine(x, y, arr, cxt) {
    for (let i = 0; i < arr.length; i++) {
      if (this.disDots(x, y, arr[i].x, arr[i].y) < this.canvasSet.mouseLineLength) {
        let opacity = 1 - this.disDots(x, y, arr[i].x, arr[i].y) / this.canvasSet.mouseLineLength
        this.createLine(x, y, arr[i].x, arr[i].y, cxt, this.colorRgb(this.canvasSet.mouseColor).replace(')', `,${opacity})`).replace('RGB', 'RGBA'))
      }
    }
  }
}