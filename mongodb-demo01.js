let mongoose = require('mongoose');
let user = require("./model/user");
//设置链接数据库的路径
mongoose.connect('mongodb://localhost/test');
//创建链接对象
let db = mongoose.connection;

db.on('error',err=>{
    console.log(err);
})
db.once('open',()=>{
    console.log('mongodb connection sucess');

    //testInsert();
    //textCRUD();
    highOrederQuery()
})

async function testInsert() {
   /*let res = await user.create({
        name:'123',
        age:15,
        address:"北京",
       fav:['学习','游戏']
    });
   console.log(res);*/

   let arr=[
       {name:'张三',age:15,address:'上海',fav:['上网','看书']},
       {name:'王八',age:19,address:'西安',fav:['钓鱼','游泳']}

   ]
   let res = await user.create(arr);
   console.log(res);
}
//测试删改查
async function textCRUD() {
    //根据条件查询
    //let res = await user.findOne({address:'北京'});
    //查询所有的某个条件
    //let res = await  user.findOne({address:'上海'});
    //console.log(res);

    //let res= await user.updateOne({ _id:"5b4211e16cccc71cdc4bf014"},{age:100,address:'深圳'})
    //console.log(res);
    
    let res = await user.deleteOne({_id:"5b4211e16cccc71cdc4bf014"});
    console.log(res);
}
async function highOrederQuery() {
    //根据条件查询
    //let res = await user.find({age:{$gt:15}});
    /*let res = await user.find({
        fav:'游戏'
    });
*/
    let res = await user.find().skip(0).limit(2).sort('-age').select('-fav');

    console.log(res);

}