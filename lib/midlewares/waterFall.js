/*
* Designed by yyrdl long ago ,see https://github.com/yyrdl/System
* */

function WaterFall() {
    this.passArgs;
    this.callback;
    this.step = -1;
}
WaterFall.prototype.regist = function (functionArray, callback) {
    var self = this;
    self.functionArray = functionArray;
    self.callback = callback;
}
WaterFall.prototype.next = function (args) {
    var self = this;
    self.step++;
    if (self.step == self.functionArray.length) {
        if (self.callback) {
            self.callback(args);
        }
        return;
    }
    self.functionArray[self.step](args);
};
WaterFall.prototype.fire = function (args) {
    this.next(args);
}
exports.waterFall=WaterFall;