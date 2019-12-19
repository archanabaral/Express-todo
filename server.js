let express = require("express");
let mongodb = require("mongodb");
let sanitize = require("sanitize-html");
let app = express();
let db;
app.use(express.static("public")); //telling express to allow incoming request to have access to the public folder and its content
let connectionString =
  "mongodb+srv://todoAppUser:mongodbarchu@cluster0-ttfpz.mongodb.net/TodoApp?retryWrites=true&w=majority"; //todoapp is our database name
mongodb.connect(connectionString, { useNewUrlParser: true }, function(
  err,
  client
) {
  db = client.db();

  app.listen(3000);
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
function password(req, res, next) {
  res.set("WWW-Authenticate", 'Basic realm="Simple Todo App"');
  console.log(req.headers.authorization); //to access username and password they typed in
  if (req.headers.authorization == "Basic bGVhcm46amF2YXNjcmlwdA==") {
    next();
  } else {
    res.status(401).send("Authentication reeguired");
  }
}

app.use(password);
app.get("/", function(request, reponse) {
  db.collection("items")
    .find()
    .toArray(function(err, items) {
      //console.log(items);it contains each data from database in the array
      reponse.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App!!!</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id="create-form" action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input id="create-field"
              name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id="item-list" class="list-group pb-5">
    
        </ul>
        
      </div>
      <script>
      let items=${
        JSON.stringify(items) //convert javascript data or json into string of text (doing this server will snend those string to browser )
      }
      
      </script>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script src="/browser.js"></script>
    </body>
    </html>`);
    });
});
//when a web browser sends the post request to this url run this function  (reponding incoming post request to create-item url)
app.post("/create-item", function(request, response) {
  let safeText = sanitize(request.body.text, {
    allowedTags: [],
    allowedAttributes: {}
  });
  db.collection("items").insertOne({ text: safeText }, function(err, info) {
    response.json(info.ops[0]);
  });
});

app.post("/update-item", function(req, res) {
  //console.log(req.body.text);//data the axios is sending to server
  let safeText = sanitize(req.body.text, {
    allowedTags: [],
    allowedAttributes: {}
  });
  db.collection("items").findOneAndUpdate(
    { _id: new mongodb.ObjectID(req.body.id) },
    { $set: { text: safeText } },
    function() {
      res.send("success");
    }
  );
});
app.post("/delete-item", function(req, res) {
  db.collection("items").deleteOne(
    { _id: new mongodb.ObjectID(req.body.id) },
    function() {
      res.send("success");
    }
  );
});
