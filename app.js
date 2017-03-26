var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

//setting the default view engine

app.set('views', './views');
app.set('view engine','pug');
app.set('port', (process.env.PORT || 5000));

//express will serve up the static domains

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'uploads')));

/*
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});
*/
var markovArray = fs.readFileSync(path.join(__dirname, 'public/assets/markov_01.txt')).toString().split("//");

app.get('/', function(req, res){
  var filesArray = fs.readdirSync('uploads');
  filesArray.shift(); //Used to remove the .DS_Store created on MacOS //REMOVE THIS BEFORE UPLOADING TO CLOUD
  filesArray.reverse();
  console.log(filesArray);
  res.render('index', {
    files: filesArray,
    markov: markovArray
  });
});

app.get('/about', function(req, res){
  res.render('about');
});

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, Date.now().toString())); //path.join(form.uploadDir, file.name)
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
