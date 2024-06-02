var {Subject} = require('rxjs')
var express = require('express')
const webpush = require('web-push');
const cors = require('cors') 
var app = express()
const apiKeys = {
  publicKey: "BIC8gnnjHsk3Sd1HZiOSbu1TFB5ZzhViwoA7kzYmAPW52C7l_y2H9yLPlwCUrpqzWBrJqF4QGZ737kKhgLrmU08",
  privateKey: "tmCaQ4aSPyymQ7psqGnBNamgR7SGyhwpm_dLx_Bk7gM"
}

webpush.setVapidDetails(
  'mailto:imtiazhuda@gmail.com',
  apiKeys.publicKey,
  apiKeys.privateKey
)

const subDatabse = [];

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
  subDatabse.forEach((pushSubscription)=>{
    webpush.sendNotification(pushSubscription, msg);
  })
  
  res.json({ "statue": "Success", "message": "Message sent to push service" });
})

app.post("/save-subscription", (req, res) => {
  subDatabse.push(req.body);
  res.json({ status: "Success", message: "Subscription saved!" })
})

app.get('/clearsubs', function (req, res) {
  subDatabse = [];
  res.send('clearsubs');
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