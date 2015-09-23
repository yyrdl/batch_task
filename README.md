##简介
  最近总是遇到批量查询处理数据的任务，有时任务量很大就必须将任务分成若干批次，然后分批次
  处理，于是创作了这个工具。

## 用法示例
`
  npm install batch_task
`
work with Promise

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
