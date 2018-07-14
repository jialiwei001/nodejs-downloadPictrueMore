let http = require('http');
let fs = require('fs');
let path = require('path');
let cheerio = require('cheerio');
let iconv = require('iconv-lite');


let abc='';
    for(let i=7;i<10;i++) {
       abc=`http://www.27270.com/ent/meinvtupian/list_11_${i}.html`;
        getmore(abc);
    }
//第一发送get请求 把所有数据都保存到数组里

function getmore(abc) {
  http.get(abc,res => {
    //定义一个数组
    let data = [];
    res.on('data',(chunk)=>{
        data.push(chunk);
    })
    res.on('end',()=>{
        //console.log(data.toString());
       //打印出现乱码
        //处理 乱码的问题
        //解决乱码
        let html = iconv.decode(Buffer.concat(data),'gbk');
         //console.log(html);

        let imgarr = makehtml(html);

        getload(imgarr)
    })

})

}



//第三筛选html页面信息，最后整理出一个src 和title数组
function makehtml(html) {
    let $ = cheerio.load(html);
    //定义一个数组
    let imgarr=[];
    //获取img节点元素
    let arr = $('div.MeinvTuPianBox>ul>li>a>i>img').toArray();
    for(let i= 0;i<arr.length;i++){
        //获取数组的每个img元素
        let obj = arr[i];
        let src = $(obj).attr('src');
        let title = $(obj).attr('alt');
        //将获取到的每个src和title 以json格式存入数组
        imgarr.push({src,title})
    }
    return imgarr;
}
//再次发送get请求，保存到本地
function getload(imgarr) {
    //对这个数组进行遍历
    imgarr.forEach(imgobj=>{
        //发送get请求 请求具体每个的图片地址
        http.get(imgobj.src,res=>{
            //res就是个reader读取流
            //拼接文件存放的地址和名字
            let imgpath = path.join('F:\\img',imgobj.title+path.extname(imgobj.src));
            //创建一个写入流
            let writeStream = fs.createWriteStream(imgpath);
            res.pipe(writeStream);
        })

    })
}