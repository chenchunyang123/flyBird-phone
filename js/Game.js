function Game(ctx, bird, pipe, land, mountain, title, gameOver_img, scroce) {
    this.ctx = ctx;
    this.bird = bird;
    this.pipeArr = [pipe];
    this.land = land;
    this.mountain = mountain;
    // 开始界面
    this.title = title;
    this.gameOver_img = gameOver_img;
    // 得分系统
    this.scroce = scroce;
    // 个位计分器
    this.i = 0;
    // 十位计分器
    this.j = 0;
    this.timer = null;
    // 定义帧数
    this.iframe = 0;
    // 创建管子的帧数
    this.iframe_pipe = 0;
    // 初始化
    this.init();
    // 游戏状态
    this.status = "Pause";
}

// 初始化方法
Game.prototype.init = function() {
    var me = this;
    this.timer = setInterval(function() {
        // 帧数改变
        me.iframe++;
        // 清屏
        me.clear();
        // 鸟飞翔
        if(!(me.iframe % 8)) {
            me.bird.fly();
        }
        // 渲染
        me.renderMountain();
        me.renderLand();
        me.renderBird();
        // me.renderBirdPoint();
        // me.renderPipePoint();
        // 绑定开始事件
        me.startScreen();
        if(me.status === "start") {
            me.start();
        }
    },20);
}

// 游戏开始方法
Game.prototype.start = function() {
    // 帧数改变
    this.iframe_pipe++;
    // 鸟下降
    this.bindEvent();
    this.bird.dropDown();
    // 创建管子
    if (!(this.iframe_pipe % 60)) {
        this.creatPipe();
    }
    // 管子移动
    this.pipeMove();
    // 清理管子
    this.clearArr();
    // 渲染管子
    this.renderPipe();
    // 渲染分数
    this.renderScroce();
    // 结束游戏的方法
    this.checkBoom();
}
// 清屏方法
Game.prototype.clear = function() {
    this.ctx.clearRect(0, 0, 360, 512);
}

// // 开始界面
Game.prototype.startScreen = function() {
    var me = this;
    this.ctx.canvas.onclick = function() {
        me.status = "start";
    }
    if(this.status === "Pause") {
        this.ctx.drawImage(this.title.img, this.title.x, this.title.y);
        this.ctx.drawImage(this.title.img_tap, 120, 250);
    }
}

// 渲染分数
Game.prototype.renderScroce = function() {
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "#fff";
    this.ctx.fillText("生存秒数:", 220, 28);
    if(!(this.iframe_pipe % 55)) {
        this.i++;
        if(this.i === this.scroce.imgArr.length) {
            this.i = 0;
            this.j++;
            if(this.j === this.scroce.imgArr.length) {
                this.win();
            }
        }
    }
    // 个位
    this.ctx.drawImage(this.scroce.imgArr[this.i], 325, 2);
    // 十位
    this.ctx.drawImage(this.scroce.imgArr[this.j], 298, 2);
}

// 渲染山
Game.prototype.renderMountain = function() {
    var img = this.mountain.img;
    this.mountain.x -= this.mountain.step;
    if(this.mountain.x <= -img.width) {
        this.mountain.x = 0;
    }
    this.ctx.drawImage(img, this.mountain.x, this.mountain.y);
    this.ctx.drawImage(img, img.width + this.mountain.x, this.mountain.y);
    this.ctx.drawImage(img, img.width * 2 + this.mountain.x, this.mountain.y);
}

// 渲染地面
Game.prototype.renderLand = function() {
    var img = this.land.img;
    this.land.x -= this.land.step;
    if(this.land.x <= -img.width) {
        this.land.x = 0;
    }
    this.ctx.drawImage(img, this.land.x, this.land.y);
    this.ctx.drawImage(img, img.width + this.land.x, this.land.y);
    this.ctx.drawImage(img, img.width * 2 + this.land.x, this.land.y);
}

// 渲染鸟
Game.prototype.renderBird = function() {
    var img = this.bird.img;
    this.ctx.save();
    this.ctx.translate(this.bird.x, this.bird.y)
    var deg = this.bird.status == "D"? Math.PI/180 * this.bird.speed: Math.PI/180 * -this.bird.speed;
    this.ctx.rotate(deg);
    this.ctx.drawImage(img, -img.width/2, -img.height/2);
    this.ctx.restore();
}

// 绑定事件
Game.prototype.bindEvent = function() {
    var me = this;
    this.ctx.canvas.onclick = function() {
        me.bird.up();
    }
}

// 渲染管子
Game.prototype.renderPipe = function() {  
    var me = this;
    this.pipeArr.forEach(function(value,index) {
        // 上管子
        var down_img = value.pipe_down;
        var down_img_x = 0;
        var down_img_y = down_img.height - value.down_height;
        var down_img_w = down_img.width;
        var down_img_h = value.down_height;
        var down_canvas_x = me.ctx.canvas.width - value.step * value.count;
        var down_canvas_y = 0;
        var down_canvas_w = down_img.width;
        var down_canvas_h = value.down_height;
        me.ctx.drawImage(down_img, down_img_x, down_img_y, down_img_w, down_img_h, down_canvas_x, down_canvas_y, down_canvas_w, down_canvas_h);
        // 下管子
        var up_img = value.pipe_up;
        var up_img_x = 0;
        var up_img_y = 0;
        var up_img_w = up_img.width;
        var up_img_h = value.up_height;
        var up_canvas_x = me.ctx.canvas.width - value.step * value.count;
        var up_canvas_y = value.down_height + 150;
        var up_canvas_w = up_img.width;
        var up_canvas_h = value.up_height;
        this.ctx.drawImage(up_img, up_img_x, up_img_y, up_img_w, up_img_h, up_canvas_x, up_canvas_y, up_canvas_w, up_canvas_h);
    }) 
}

// 管子移动
Game.prototype.pipeMove = function() {
    // console.log(this.pipeArr[0])
    this.pipeArr.forEach(function(value) {
        value.count++;
    })
}

// 创建多根管子
Game.prototype.creatPipe = function() {
    var pipe = this.pipeArr[0].creatPipe();
    this.pipeArr.push(pipe);
}

// 清理管子数组
Game.prototype.clearArr = function() {
    var pipe = this.pipeArr[0];
    if(pipe.x - pipe.step * pipe.count < -pipe.pipe_up.width) {
        this.pipeArr.shift();
    }
}

// 绘制鸟的四个点
Game.prototype.renderBirdPoint = function() {
    // A点
    var bird_A = {
        x: -this.bird.img.width / 2 + this.bird.x + 8,
        y: -this.bird.img.height / 2 + this.bird.y + 14
    }
    // B点
    var bird_B = {
        x: this.bird.img.width / 2 + this.bird.x - 10,
        y: -this.bird.img.height / 2 + this.bird.y + 14
    }
    // C点
    var bird_C = {
        x: this.bird.img.width / 2 + this.bird.x - 10,
        y: this.bird.img.height / 2 + this.bird.y - 14
    }
    // D点
    var bird_D = {
        x: -this.bird.img.width / 2 + this.bird.x + 8,
        y: this.bird.img.height / 2 + this.bird.y - 14
    }
    // 开启路径
    this.ctx.beginPath();
    // 画
    this.ctx.moveTo(bird_A.x, bird_A.y);
    this.ctx.lineTo(bird_B.x, bird_B.y);
    this.ctx.lineTo(bird_C.x, bird_C.y);
    this.ctx.lineTo(bird_D.x, bird_D.y);
    // 闭合路径
    this.ctx.closePath();
    // this.ctx.strokeStyle = "black";
    this.ctx.stroke();
}
// 绘制管子的八个点
Game.prototype.renderPipePoint = function() {
    var me = this;
    this.pipeArr.forEach(function(value, index) {
        var pipe_down_A = {
            x: me.ctx.canvas.width - value.step * value.count,
            y: 0
        }
        var pipe_down_B = {
            x: me.ctx.canvas.width - value.step * value.count + value.pipe_down.width,
            y: 0
        }
        var pipe_down_C = {
            x: me.ctx.canvas.width - value.step * value.count + value.pipe_down.width,
            y: value.down_height
        }
        var pipe_down_D = {
            x: me.ctx.canvas.width - value.step * value.count,
            y: value.down_height
        }
        me.ctx.beginPath();
        me.ctx.moveTo(pipe_down_A.x, pipe_down_A.y);
        me.ctx.lineTo(pipe_down_B.x, pipe_down_B.y);
        me.ctx.lineTo(pipe_down_C.x, pipe_down_C.y);
        me.ctx.lineTo(pipe_down_D.x, pipe_down_D.y);
        me.ctx.closePath();
        me.ctx.stroke();
        var pipe_up_A = {
            x: me.ctx.canvas.width - value.step * value.count,
            y: value.down_height + 150
        }
        var pipe_up_B = {
            x: me.ctx.canvas.width - value.step * value.count + value.pipe_up.width,
            y: value.down_height + 150
        }
        var pipe_up_C = {
            x: me.ctx.canvas.width - value.step * value.count + value.pipe_up.width,
            y: 400
        }
        var pipe_up_D = {
            x: me.ctx.canvas.width - value.step * value.count,
            y: 400
        }
        me.ctx.beginPath();
        me.ctx.moveTo(pipe_up_A.x, pipe_up_A.y);
        me.ctx.lineTo(pipe_up_B.x, pipe_up_B.y);
        me.ctx.lineTo(pipe_up_C.x, pipe_up_C.y);
        me.ctx.lineTo(pipe_up_D.x, pipe_up_D.y);
        me.ctx.closePath();
        me.ctx.stroke();
    })
}

// 碰撞检测
Game.prototype.checkBoom = function() {
    var me = this;
    // 鸟的
    // A点
    var bird_A = {
        x: -this.bird.img.width / 2 + this.bird.x + 8,
        y: -this.bird.img.height / 2 + this.bird.y + 14
    }
    // B点
    var bird_B = {
        x: this.bird.img.width / 2 + this.bird.x - 10,
        y: -this.bird.img.height / 2 + this.bird.y + 14
    }
    // C点
    var bird_C = {
        x: this.bird.img.width / 2 + this.bird.x - 10,
        y: this.bird.img.height / 2 + this.bird.y - 14
    }
    // D点
    var bird_D = {
        x: -this.bird.img.width / 2 + this.bird.x + 8,
        y: this.bird.img.height / 2 + this.bird.y - 14
    }
    this.pipeArr.forEach(function(value, index) {
        // 上管子
        var pipe_down_A = {
            x: me.ctx.canvas.width - value.step * value.count,
            y: 0
        }
        var pipe_down_B = {
            x: me.ctx.canvas.width - value.step * value.count + value.pipe_down.width,
            y: 0
        }
        var pipe_down_C = {
            x: me.ctx.canvas.width - value.step * value.count + value.pipe_down.width,
            y: value.down_height
        }
        var pipe_down_D = {
            x: me.ctx.canvas.width - value.step * value.count,
            y: value.down_height
        }
        // 下管子
        var pipe_up_A = {
            x: me.ctx.canvas.width - value.step * value.count,
            y: value.down_height + 150
        }
        var pipe_up_B = {
            x: me.ctx.canvas.width - value.step * value.count + value.pipe_up.width,
            y: value.down_height + 150
        }
        var pipe_up_C = {
            x: me.ctx.canvas.width - value.step * value.count + value.pipe_up.width,
            y: 400
        }
        var pipe_up_D = {
            x: me.ctx.canvas.width - value.step * value.count,
            y: 400
        }
        if(bird_B.x > pipe_down_D.x && bird_B.y < pipe_down_D.y && bird_D.x < pipe_down_C.x) {
            me.gameOver();
        }
        if(bird_C.x > pipe_up_A.x && bird_C.y > pipe_up_A.y && bird_D.x < pipe_up_B.x) {
            me.gameOver();
        }
        // 撞地同样结束游戏
        if(bird_C.y > 400) {
            me.gameOver();
        }
    })
}


// 游戏结束的方法
Game.prototype.gameOver = function() {
    clearInterval(this.timer);
    this.ctx.drawImage(this.gameOver_img, 80, 200);
    this.ctx.font = "15px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText("Tips: 双击页面任意位置玩 下一只蠢鸟", 55, 470);    
    // 点击刷新页面并重新开始
    document.ondblclick = function() {
        window.location.reload(true);
    }
}

// 坚持100s后的通过页面
Game.prototype.win = function() {
    clearInterval(this.timer);
    this.ctx.font = "40px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText("You Win !!!", 90, 230);    
}