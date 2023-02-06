const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require ('slugify');


const replaceTemplate = require('./modules/replaceTemplate');


/////////////////////////////
////////Files


// // blocking synchronous way 

// const textIn = fs.readFileSync('./text/input.txt', 'utf-8'); 
// console.log(textIn); 

// const textOut =  `This is wahat we know about the avocado: ${textIn}.\n Created on ${Date.now()}`;
// fs.writtenFileSync('.text/output.txt', textOut);
// console.log('File written!');

// Non Blocking asychronous way

// fs.readFile('./txt/start.txt', 'utf-8', (err,data1) =>{
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err,data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt' , 'utf-8', (err,data3)=>{
//             console.log(data3);

//             fs.writeFile(' ./txt/final.txt', `${data2}\n${data3}`, 'utf-8',err =>{
//                 console.log('Your file has been written ');
//             })

//         });

//     });
// });
// console.log('will read files');
/////////////////////////////////////
///// SERVER



const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj =  JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, {lower : true}));
console.log(slugs);



const server = http.createServer((req,res)=>{

    const{query , pathname } = url.parse(req.url, true);

// Overview Page

 if(pathname ==='/'|| pathname === '/overview'){
    res.writeHead(200, {'content-type' : 'text/html'});

    const cardHtml =  dataObj.map(el => replaceTemplate(tempCard,el)). join('');

    const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardHtml);

    res.end(output);

 // Product page 
 } else if (pathname === '/product'){
    res.writeHead(200, {'content-type' : 'text/html'});
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct,product);
    
    res.end(output);

// Api

 }else if (pathname === '/api'){
    
    res.writeHead(200 , { 'content-type' : 'application/json'});
    res.end(data);
 }
 // page not found    
 else {
    res.writeHead(404,{
        'Content-type' : 'text/html',
        'my-own-header': 'hello-world'
    });
    res.end('<h1> Page Not Found! <h1>');
 }
});
server.listen(8000,'127.0.0.1', () =>  {
console.log('Listening to requests on port 8000') 
});


