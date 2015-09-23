##简介
  最近总是遇到批量查询处理数据的任务，有时任务量很大就必须将任务分成若干批次，然后分批次
  处理，于是创作了这个工具。

##特别说明

 - **数据格式**: 数据必须是以数组的形式传入，否则将抛出错误
 - **错误处理**: 若某个operation出现错误，模块会捕捉错误，并将该次处理结果置成undefined
 - **异步操作**: 若操作是类似http请求的异步操作，可使用Promise

##配置参数

 - **data**     : 即要处理的数据组成的数组，数组里面的每个数据应该是同类不同值的
 - **operation**: 即针对单个数据所做的操作
 - **scale**    : 每批次操作的数据量
 - **log**      : Bool类型,表示是否显示进度

##事件

 - **data**: 该事件表示某一个批次的处理结果已经来了
 - **end** : 表示所有的数据已经处理完
 - **error**:表示出现错误
 
## Install
```
  npm install batch_task
```
## 用法示例

- **work with Promise**

```javascript
   var BatchTask=require("batch_task");
   var data=[];
   for(var i=0;i<1000;i++)
   {
       data.push(i+1);
   }

   var options={
       "scale":100,//how many datas to deal per time ,they will be lanched at the same time
       "data":data,//the data must be an array
       "log":true,//will log the progress
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
```

```javascript

  var BatchTask=require("batch_task");
  var data=[];
  for(var i=0;i<100000;i++)
  {
     data.push(i+1);
  }

  var options={
     "scale":100,//how many datas to deal per time ,they will be lanched at the same time
     "data":data,//the data must be an array
     "operation":function(i){//your operation toward each data
         return i-1;
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
```
