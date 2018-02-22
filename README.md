# canvas粒子动画

## 介绍
 * dotRun 基于es6开发的canvas动画插件,为实现粒子动画效果
 * es5请单独下载dotRun.es5.js
 * 动点连线
 * 鼠标动点连线

## 安装

```cmd
npm install dotrun
```

## 使用

```html
<div class="box">
  <canvas id="canvas"></canvas>
</div>
// es5
<script src="dotRun.es5.js"></script>
```


```javascript
import DotRun from 'dotRun'

let canvas=document.getElementById('canvas')

let dotrun=new DotRun(canvas,{
  canvasWidth:1000, // 参数
  canvasHeight:400  // 参数
})

// 当然也可以直接写入DOM元素,此写法使用querySelector属性
let dotrun=new DotRun('#canvas',{
  canvasWidth:1000, // 参数
  canvasHeight:400  // 参数
})
```

## 参数

#### canvasWidth
* 类型: Number
* 默认值: 1000
* 作用: 设置canvas像素宽度
* 备注: 若想设置为全屏宽度,写入字符串'full'

#### canvasHeight
* 类型: Number
* 默认值: 300
* 作用: 设置canvas像素高度
* 备注: 若想设置为全屏高度,写入字符串'full'

#### dotsNumber
* 类型: Number
* 默认值: 200
* 作用: 设置动点个数

#### dotsRadius
* 类型: Number
* 默认值: 3
* 作用: 设置动点半径

#### lineLength
* 类型: Number
* 默认值: 50
* 作用: 设置动点间连线的长度,当动点间距离小于此数,将连线
* 备注: 若想设置为0,请写成'0',字符串形式

#### speedX
* 类型: Number
* 默认值: 2
* 作用: 设置动点X轴方向运动速度,速度为以此为最大的随机数
* 备注: 若想设置为0,请写成'0',字符串形式

#### speedY
* 类型: Number
* 默认值: 1.5
* 作用: 设置动点Y轴方向运动速度,速度为以此为最大的随机数
* 备注: 若想设置为0,请写成'0',字符串形式

#### isHover
* 类型: Boolean
* 默认值: false
* 作用: 设置鼠标在canvas上滑动时,是否需要与动点连线

#### mouseLineLength
* 类型: Number
* 默认值: 100
* 作用: 设置鼠标在canvas上滑动时,与动点之间的连线长度

#### mouseColor
* 类型: String
* 默认值: '#f00'
* 作用: 设置鼠标连线的颜色
* 备注: 目前仅支持十六进制颜色样式

#### canvasBackColor
* 类型: String
* 默认值: 'transparent'
* 作用: 设置canvas背景颜色

#### ArcColor
* 类型: String
* 默认值: '#333'
* 作用: 设置动点圆颜色
* 备注: 目前仅支持十六进制颜色样式

#### lineColor
* 类型: String
* 默认值: '#ccc'
* 作用: 设置动点连线颜色
* 备注: 目前仅支持十六进制颜色样式

## 演示
![](https://github.com/fivexu/dotrun/blob/master/dotrun.jpg)