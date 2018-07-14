### cheerio 操作html网页插件

如果想获取html网页上的元素，就用到了这个插件，比较方便，

有这个插件专门的网站各种介绍，以收藏，

### iconv-lite  处理乱码的软件

一般网站编码都是utf-8，但是还有一些老网站，编码还是以前的gbk编码，所以需要转换一下，就用到了这个插件，

### 通过网址下载图片的案例

```js

//引入资源
let http = require('http');
let fs = require('fs');
let path = require('path');
//获取图片的信息，操作html页面的框架，需要安装，有专门的网站
let cheerio = require('cheerio');
//这个是处理乱码问题的框架，需要安装，去github上找
let iconv = require('iconv-lite');

//发送get请求，把数据存到一个数组里
http.get('http://www.27270.com/ent/meinvtupian/list_11_2.html',res=>{
    //创建一个空数组
    let datahtml= [];
    //搞一个监听时间，保存数据
    res.on('data',(chunk)=>{
        datahtml.push(chunk)
    })
    //在搞一个监听结束的时间
    res.on('end',()=>{
        //console.log(datahtml.toString());
        //有乱码，处理乱码问题
        let html = iconv.decode(Buffer.concat(datahtml),'gbk');
        //console.log(html);
        //调用处理页面的方法
        let arrhtml = gethtml(html);
      //调用下载的方法
        imgload(arrhtml)
    })
})

//处理html数组，从中拿到想要的src和title 保存到数组里
function gethtml(html) {
    //把html交给cheerio处理
    let $ = cheerio.load(html);
    //获取html页面里边的所有img节点
    let arr = $('div.MeinvTuPianBox>ul>li>a>i>img').toArray();
    //在创建一个空数组，用来保存src和title
    let arrhtml=[];
    //遍历arr数组，然后获取里边的src和title
    arr.forEach(obj=>{
        //获取每个元素节点上的src和alt属性
        let src = $(obj).attr('src');
        let title = $(obj).attr('alt');
        //把获取的属性以json格式的保存
        arrhtml.push({src,title});
        })
      return arrhtml;
}
//再次发送请求然后拿到想要的数据，保存到文件中
function imgload(arrhtml) {
    //先遍历数组，获取没个元素
    arrhtml.forEach(f=>{
        http.get(f.src,res=>{
            //res就可以认为是一个reader输入流
            //创建一个路径
            let fpath = path.join("imgs",f.title+path.extname(f.src));
            //创建一个写入流
            let wf = fs.createWriteStream(fpath);
            res.pipe(wf)
        })
    })

}

```

### 通过事件监听的方式去执行下载美女图片功能

```
let events = require('events');
let http = require('http');
let fs = require('fs');
let path = require('path');
//获取图片的信息，操作html页面的框架，需要安装，有专门的网站
let cheerio = require('cheerio');
//这个是处理乱码问题的框架，需要安装，去github上找
let iconv = require('iconv-lite');


class myEvents extends events{

    sendget(){
        //发送get请求，把数据存到一个数组里
        http.get('http://www.27270.com/ent/meinvtupian/list_11_2.html',res=>{
            //创建一个空数组
            let datahtml= [];
            //搞一个监听时间，保存数据
            res.on('data',(chunk)=>{
                datahtml.push(chunk)
            })
            //在搞一个监听结束的时间
            res.on('end',()=>{
                //console.log(datahtml.toString());
                //有乱码，处理乱码问题
                let html = iconv.decode(Buffer.concat(datahtml),'gbk');
                //console.log(html);
                //设置一个监听器
              this.emit('sentget',html);
            })
        })
    }

//处理html数组，从中拿到想要的src和title 保存到数组里
    gethtml(html) {
        //把html交给cheerio处理
        let $ = cheerio.load(html);
        //获取html页面里边的所有img节点
        let arr = $('div.MeinvTuPianBox>ul>li>a>i>img').toArray();
        //在创建一个空数组，用来保存src和title
        let arrhtml=[];
        //遍历arr数组，然后获取里边的src和title
        arr.forEach(obj=>{
            //获取每个元素节点上的src和alt属性
            let src = $(obj).attr('src');
            let title = $(obj).attr('alt');
            //把获取的属性以json格式的保存
            arrhtml.push({src,title});
        })
       this.emit('gethtml',arrhtml);
    }

    //再次发送请求然后拿到想要的数据，保存到文件中
    imgload(arrhtml) {
        //先遍历数组，获取没个元素
        arrhtml.forEach(f=>{
            http.get(f.src,res=>{
                //res就可以认为是一个reader输入流
                //创建一个路径
                let fpath = path.join("imgs",f.title+path.extname(f.src));
                //创建一个写入流
                let wf = fs.createWriteStream(fpath);
                res.pipe(wf)
            })
        })
        //设置一个监听事件 
        this.emit('imgload',arrhtml);
    }

    start(){
        this.on('sentget',(html)=>{
            this.gethtml(html);
        })
        this.on('gethtml',(arrhtml)=>{
            this.imgload(arrhtml)
        })
        //首先直接执行这个方法
        this.sendget();
    }
}
//创建一个事件类，然后调用开始方法
let myEvents2 = new myEvents();
myEvents2.start();
```

