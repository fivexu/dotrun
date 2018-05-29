'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dotRun = function () {
    function dotRun(dom) {
        var _this = this;

        var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, dotRun);

        if (!dom) {
            return;
        }
        this.canvas = dom.nodeType ? dom : document.querySelector(dom);
        if (!this.canvas.getContext('2d')) {
            return;
        }
        this.context = this.canvas.getContext('2d');
        this.dotArr = [];
        this.timer = null;
        this.disX = 0;
        this.disY = 0;
        if (obj.canvasWidth === 'full') {
            obj.canvasWidth = document.documentElement.offsetWidth;
        }
        if (obj.canvasHeight === 'full') {
            obj.canvasHeight = document.documentElement.offsetHeight;
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
        };
        this.createDotsArr();
        this.initCanvas();
        if (this.canvasSet.isHover) {
            this.addEvent();
        }
        window.addEventListener('resize', function () {
            clearInterval(_this.playingTimer);
            _this.initCanvas();
            if (_this.canvasSet.isHover) {
                _this.addEvent();
            }
        });
    }

    _createClass(dotRun, [{
        key: 'addEvent',
        value: function addEvent() {
            var _this2 = this;

            this.canvas.addEventListener('mousemove', function (ev) {
                ev = ev || event;
                _this2.disX = (ev.clientX - _this2.canvas.offsetLeft) * (_this2.canvasSet.width / _this2.canvas.offsetWidth);
                _this2.disY = (ev.clientY - _this2.canvas.offsetTop + _this2.getScrollTop()) * (_this2.canvasSet.height / _this2.canvas.offsetHeight);
            });
            this.canvas.addEventListener('mouseleave', function (ev) {
                _this2.disX = _this2.disY = -100;
            });
        }
    }, {
        key: 'colorHex',
        value: function colorHex(that) {
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            if (/^(rgb|RGB)/.test(that)) {
                var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, '').split('', '');
                var strHex = '#';
                for (var i = 0; i < aColor.length; i++) {
                    var hex = Number(aColor[i]).toString(16);
                    if (hex === '0') {
                        hex += hex;
                    }
                    strHex += hex;
                }
                if (strHex.length !== 7) {
                    strHex = that;
                }
                return strHex;
            } else if (reg.test(that)) {
                var aNum = that.replace(/#/, '').split('');
                if (aNum.length === 6) {
                    return that;
                } else if (aNum.length === 3) {
                    var numHex = '#';
                    for (var _i = 0; _i < aNum.length; _i += 1) {
                        numHex += aNum[_i] + aNum[_i];
                    }
                    return numHex;
                }
            }
            return that;
        }
    }, {
        key: 'colorRgb',
        value: function colorRgb(sColor) {
            sColor = sColor.toLowerCase();
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            if (sColor && reg.test(sColor)) {
                if (sColor.length === 4) {
                    var sColorNew = '#';
                    for (var i = 1; i < 4; i += 1) {
                        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                    }
                    sColor = sColorNew;
                }
                var sColorChange = [];
                for (var _i2 = 1; _i2 < 7; _i2 += 2) {
                    sColorChange.push(parseInt('0x' + sColor.slice(_i2, _i2 + 2)));
                }
                return 'RGB(' + sColorChange.join(',') + ')';
            }
            return sColor;
        }
    }, {
        key: 'initCanvas',


        // 初始化canvas
        value: function initCanvas() {
            this.canvas.width = this.canvasSet.width;
            this.canvas.height = this.canvasSet.height;
            this.canvas.style.backgroundColor = this.canvasSet.canvasBackColor;
            this.canvas.style.float = 'left';
            this.playing();
        }

        // 获取滚动条高度,处理兼容性

    }, {
        key: 'getScrollTop',
        value: function getScrollTop() {
            var scrollTop = 0;
            if (document.documentElement && document.documentElement.scrollTop) {
                scrollTop = document.documentElement.scrollTop;
            } else if (document.body) {
                scrollTop = document.body.scrollTop;
            }
            return scrollTop;
        }

        // 运动

    }, {
        key: 'playing',
        value: function playing() {
            var _this3 = this;

            this.playingTimer = null;
            clearInterval(this.playingTimer);
            this.playingTimer = setInterval(function () {
                _this3.context.clearRect(0, 0, _this3.canvas.width, _this3.canvas.height);
                _this3.lineRun(_this3.dotArr);
                if (_this3.canvasSet.isHover) {
                    _this3.mouseLine(_this3.disX, _this3.disY, _this3.dotArr, _this3.context);
                }
                for (var i = 0; i < _this3.dotArr.length; i++) {
                    _this3.createArc(_this3.dotArr[i].x += _this3.dotArr[i].vx * _this3.dotArr[i].lt, _this3.dotArr[i].y += _this3.dotArr[i].vy * _this3.dotArr[i].lt, _this3.context);
                    if (_this3.dotArr[i].x >= _this3.canvas.width) {
                        _this3.createArc(_this3.canvas.width * 2 - _this3.dotArr[i].x, _this3.dotArr[i].y, _this3.context);
                    }
                    if (_this3.canvas.width - _this3.dotArr[i].x <= 0) {
                        _this3.dotArr[i].x = 0;
                        _this3.createArc(_this3.dotArr[i].x += _this3.dotArr[i].vx * _this3.dotArr[i].lt, _this3.dotArr[i].y, _this3.context);
                    }
                    if (_this3.dotArr[i].y >= _this3.canvas.height) {
                        _this3.createArc(_this3.dotArr[i].x, _this3.canvas.height * 2 - _this3.dotArr[i].y, _this3.context);
                    }
                    if (_this3.canvas.height - _this3.dotArr[i].y <= 0) {
                        _this3.dotArr[i].y = 0;
                        _this3.createArc(_this3.dotArr[i].x, _this3.dotArr[i].y += _this3.dotArr[i].vy * _this3.dotArr[i].lt, _this3.context);
                    }
                }
            }, 30);
        }

        // 创建点数组

    }, {
        key: 'createDotsArr',
        value: function createDotsArr() {
            for (var i = 0; i < this.canvasSet.dotsNumber; i++) {
                this.dotArr.push({
                    x: Math.random() * this.canvasSet.width,
                    y: Math.random() * this.canvasSet.height,
                    lt: Math.random() > 0.5 ? 1 : -1, // 随机方向
                    vx: Math.random() * this.canvasSet.speedX, // 随机x方向速度
                    vy: Math.random() * this.canvasSet.speedY // 随机y方向速度
                });
            }
        }

        // 绘制线

    }, {
        key: 'createLine',
        value: function createLine(x1, y1, x2, y2, cxt) {
            var color = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : this.canvasSet.lineColor;

            cxt.beginPath();
            cxt.moveTo(x1, y1);
            cxt.lineTo(x2, y2);
            cxt.lineWidth = 0;
            cxt.strokeStyle = color;
            cxt.stroke();
            cxt.closePath();
        }

        // 绘制点

    }, {
        key: 'createArc',
        value: function createArc(x, y, cxt) {
            var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.canvasSet.ArcColor;

            cxt.beginPath();
            cxt.arc(x, y, this.canvasSet.dotsRadius, 0, 2 * Math.PI);
            cxt.fillStyle = color;
            cxt.fill();
            cxt.closePath();
        }

        // 连线

    }, {
        key: 'lineRun',
        value: function lineRun(arr) {
            for (var i = 0; i < arr.length; i++) {
                for (var j = 0; j < arr.length; j++) {
                    if (this.disDots(arr[j].x, arr[j].y, arr[i].x, arr[i].y) < this.canvasSet.lineLength * 1) {
                        var opacity = 1 - this.disDots(arr[j].x, arr[j].y, arr[i].x, arr[i].y) / this.canvasSet.lineLength;
                        this.createLine(arr[j].x, arr[j].y, arr[i].x, arr[i].y, this.context, this.colorRgb(this.canvasSet.lineColor).replace(')', ',' + opacity + ')').replace('RGB', 'RGBA'));
                    }
                }
            }
        }

        // 计算点与点之间的距离值

    }, {
        key: 'disDots',
        value: function disDots(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(Math.abs(x2 - x1), 2) + Math.pow(Math.abs(y2 - y1), 2));
        }

        // 计算鼠标位置,若小于定义值,连接两点

    }, {
        key: 'mouseLine',
        value: function mouseLine(x, y, arr, cxt) {
            for (var i = 0; i < arr.length; i++) {
                if (this.disDots(x, y, arr[i].x, arr[i].y) < this.canvasSet.mouseLineLength) {
                    var opacity = 1 - this.disDots(x, y, arr[i].x, arr[i].y) / this.canvasSet.mouseLineLength;
                    this.createLine(x, y, arr[i].x, arr[i].y, cxt, this.colorRgb(this.canvasSet.mouseColor).replace(')', ',' + opacity + ')').replace('RGB', 'RGBA'));
                }
            }
        }
    }]);

    return dotRun;
}();