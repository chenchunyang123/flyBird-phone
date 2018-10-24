function Pipe(pipe_down, pipe_up, step, x) {
	// 朝下的管子
	this.pipe_down = pipe_down;
    // 朝上的管子
	this.pipe_up = pipe_up;
	// 随机管子高度
	this.down_height = parseInt(Math.random() * 250) + 1;
	this.up_height = 250 - this.down_height;
	// 定义步长
	this.step = step;
	// 初始进入位置
	this.x = x;
	// 定义走步的次数
	this.count = 0;
}

Pipe.prototype.creatPipe = function() {
	return new Pipe(this.pipe_down, this.pipe_up, this.step, this.x);
}