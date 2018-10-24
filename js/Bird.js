function Bird(imgArr, x, y) {
    this.imgArr = imgArr;
    // 鸟的图片
    this.index = parseInt(Math.random() * imgArr.length);
    this.img = imgArr[this.index];
    // 初始位置
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.status = "D";
}

// 鸟扇翅膀
Bird.prototype.fly = function() {
    this.index++;
    if(this.index === this.imgArr.length) {
        this.index = 0;
    }
    this.img = this.imgArr[this.index];
}

// 鸟下落方法
Bird.prototype.dropDown = function() {
    if(this.status === "D") {
        this.speed++;
        this.y += Math.sqrt(this.speed);
    }else {
        this.speed--;
        if(this.speed === 0) {  
            this.status = "D";
            return;
        }
        this.y -= Math.sqrt(this.speed);
    }
    // console.log(this.y)
}

// 鸟向上
Bird.prototype.up = function() {
    this.speed = 20;
    this.status = "U";
}
