let events = require('events');

class MyEmitter extends events{

}
let myEmitter1 = new MyEmitter();

myEmitter1.on('registersucess',(p)=>{
    console.log('用户注册成功，请发送邮件'+p);
})

setTimeout(()=>{
    let person={
        name:'zhaosi'
    };
    myEmitter1.emit('registersucess',person.name);

},2000);