var {Subject} = require('rxjs')
var express = require('express')
const webpush = require('web-push');
const cors = require('cors') 
var app = express()
var { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ port: 8080 });

const apiKeys = {
  publicKey: "BIC8gnnjHsk3Sd1HZiOSbu1TFB5ZzhViwoA7kzYmAPW52C7l_y2H9yLPlwCUrpqzWBrJqF4QGZ737kKhgLrmU08",
  privateKey: "tmCaQ4aSPyymQ7psqGnBNamgR7SGyhwpm_dLx_Bk7gM"
}

webpush.setVapidDetails(
  'mailto:imtiazhuda@gmail.com',
  apiKeys.publicKey,
  apiKeys.privateKey
)

var subDatabse = [];

app.use(cors()); 
app.use(express.json());

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

app.get("/send-notification/:data", (req, res) => {
  var msg = {
    title: "test title",
    body: req.params.data,
    tag: "test tag"
  }
  let payload = JSON.stringify(msg);
  let callback = (a,b)=>{
    console.log(a);
    console.log(b);
    if(!b){
      subDatabse = [];
    }
  }
  
    subDatabse.forEach((pushSubscription)=>{
      
        webpush.sendNotification(pushSubscription, payload).then(
          function (data) {
              return callback(null, data);
          },
          function (err) {
              return callback(err, null);
          }
      )
      .catch(function (ex) {
          return callback(new Error(ex), null);
      })
      
    })
  
  
  
  res.json({ "statue": "Success", "message": "Message sent to push service" });
})

app.post("/save-subscription", (req, res) => {
  subDatabse.push(req.body);
  res.json({ status: "Success", message: "Subscription saved!" })
})

app.get('/clearsubs', function (req, res) {
  subDatabse = [];
  res.json({ status: "Success", message: "Subscription cleared!" })
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
    //console.log("yes", data);
    res.write("data: " + data + "\n\n");
    
  }

wss.on('connection', function connection(ws, req) {
  //console.log(req.socket);
  ws.on('message', function message(data) {
    console.log('received: %s', data);
    console.log( data);
    let msg = data.toString();
    wss.clients.forEach(client => {
      client.send(msg);
    });
  });

  ws.send('something');
});  

app.listen(3000)