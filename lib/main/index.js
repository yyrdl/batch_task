/*
 *   Created By yyrdl on 2015/9/22
 * */
var EventEmitter = require("events").EventEmitter;
var WaterFall = require("../midlewares/waterFall").waterFall;

function BatchTask(options) {
	this.scale = (options.scale && options.scale > 0) ? options.scale : 50;
	this.data = options.data;
	this.atomicOperation = options.operation;
	this.log=options.log||false;
	this.waterFall = new WaterFall();
	this.events=new EventEmitter();
}

BatchTask.prototype.fire = function () {
	var self = this;
	if (!(self.data instanceof Array)) {
		throw new Error("data must be an array");
	}
	function batch(i) {
		var temp = [];
		for (var j = i; (j - i) < self.scale && j < self.data.length; j++) {
			temp.push(self.data[j]);
		};

		var tasks = temp.map(function (item) {
				return Promise.resolve().then(function () {
					return self.atomicOperation(item);
				}).catch (function (err) {
					self.events.emit("error", err)
					return ""; //return undefined
				});
			});

		Promise.all(tasks).then(function (dt) {
			self.events.emit("data", dt);
			if(self.log)
			{
				var p=Math.ceil((i+temp.length)/self.data.length*10000)/100;
				console.log("complete "+p+"%");
			}
			self.waterFall.next(i + self.scale);
		});
	};
	var funcs = [];
	for (var i = 0; i < Math.ceil(self.data.length / self.scale); i++) {
		funcs.push(batch);
	}
	self.waterFall.regist(funcs, function () {
		self.events.emit("end");
	});
	self.waterFall.fire(0);

}
BatchTask.prototype.on=function(event_name,func){
	this.events.on(event_name,func);
}
exports.BatchTask = BatchTask;
