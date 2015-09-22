/**
 * Created by yyrdl on 2015/9/22.
 */

var BatchTask=require("../index.js");
var data=[];
for(var i=0;i<1000;i++)
{
    data.push(i+1);
}

var options={
    "scale":100,
    "data":data,
    "operation":function(i){
        //if the operation need time to accomplish(such as http request) ,you can return a Promise;
        //if some error occured ,the result of this operation will return undefined ,each operation is
        //independent
         return new Promise(function(resolve,reject){
             setTimeout(function(){
                if(Math.random()>0.5)
                {
                    resolve(i-1);
                }else{
                    reject(new Error("test error"));
                }
             },200);
         });
    }
};

var batch=new BatchTask(options);

batch.fire();
batch.on("data",function(data){
    console.log(data[data.length-1]);
});

batch.on("end",function(){
    console.log("done");
});
batch.on("error",function(er){
    console.log(er);
});