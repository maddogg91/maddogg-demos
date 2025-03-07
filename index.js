const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
var fs = require('fs');
var redis= require('redis');

app.set("views", path.join(__dirname, "templates"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(express.static("public"));
app.use(express.static("images"));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
const loaded_events= load_events();


const client = redis.createClient({
    password: '6dJRHTxo8VsrdFIf9pus4hTzBmfAWuAS',
    socket: {
        host: 'redis-16482.c1.us-east1-2.gce.redns.redis-cloud.com',
        port: 16482
    }
});

async function makeConnection(){
	await client.connect();
    const events= await client.json.get('events');
	
	fs.writeFile(path.join(__dirname,'public/events.json'), JSON.stringify(events) ,err => {
  if (err) {
    console.error(err);

  } else {
    console.log("New event successfully written");
	
  }
});
}

app.post('/save', async function(req,res, next){
	new_event= req.body;
	loaded_events.data.push("Test");
	fs.writeFile(path.join(__dirname,'public/events.json'), JSON.stringify(events) ,err => {
  if (err) {
    console.error(err);

  } else {
    console.log("New event successfully written");
	
  }
});
});

function load_events(){
	return JSON.parse(fs.readFileSync(path.join(__dirname, 'public/events.json'), 'utf8'));
}

app.get('/', function(req, res) {
res.render(path.join(__dirname, 'templates/index.html'), {events: load_events()});

});

app.listen(8800, () => {	
	makeConnection();
	
	console.log("Loading events");
});


process.on('SIGINT', function() {
   client.quit();
    console.log('redis client quit');
});