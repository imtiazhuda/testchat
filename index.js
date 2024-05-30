// const http = require('http');
// const url = require('url');

// const port = 8000;

// http.createServer(async (req, res) => {

//   // get URI path
//   const uri = url.parse(req.url).pathname;

//   // return response
//   switch (uri) {
//     case "/random":
//       sseStart(res);
//       sseRandom(res);
//       break;
//   }

//   // SSE head
//  function sseStart(res) {
//     res.writeHead(200, {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache",
//       "Connection": "keep-alive"
//     });
//   }


//   // SSE random number
// function sseRandom(res) {
//     res.write("data: " + (Math.floor(Math.random() * 1000) + 1) + "\n\n");
//     setTimeout(() => sseRandom(res), Math.random() * 3000);
//   }

// }).listen(port);
var {Subject} = require('rxjs')
var express = require('express')
const cors = require('cors') 
var app = express()

app.use(cors()); 

const subject = new Subject();

app.get('/', function (req, res) {
    
  res.send('hello world')
})
app.get('/ping/:data', function (req, res) {
    subject.next(req.params.data);
    res.send('hello world')
  })

app.get('/random', function (req, res) {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      });
    
    // sseStart(res);
    //  sseRandom(res);
    subject.subscribe({
        next: (v) => {
           //sseStart(res);
           sseRandom(res, v);
            //res.write("data: " + v + "\n\n");
        },
      });
})

  // SSE head
 function sseStart(res) {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    });
  }

    // SSE random number
function sseRandom(res, data) {
    console.log("yes", data);
    res.write("data: " + data + "\n\n");
    
  }

app.listen(3000)