/*
 	This is main js file in Node.
*/

var express=require('express');
var path=require('path');
var xml2js=require('xml2js');
var parser=new xml2js.Parser();
var fs=require('fs');
var bodyParser=require('body-parser');
var multer = require('multer');
var jsdom=require('jsdom');
var mongoose = require('mongoose');

var upload=multer({dest:'./tmp/uploads/'});
var app=express();
//mongoose.connect("mongodb://agakt:agakt@52.68.212.127:27017/agaktdb10");
//var db=mongoose.connection;

var filename;

// status : The characteristics of book.	
var status = {
	title : String,
	phrase:Number,
	screen:Number,
	code:Number,
	LengthOfChapter:Number,
	totalPages:Number,
	wordsOfPage :Number,
	example:Number,
	question:Number
};

var bookSchema = mongoose.Schema({
	title : String,
	phrase:Number,
	screen:Number,
	code:Number,
	LengthOfChapter:Number,
	totalPages:Number,
	wordsOfPage :Number,
	example:Number,
	question:Number
});

var BookData = mongoose.model('book',bookSchema);

var tagsInBook = new Array();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine','ejs');
app.set('views',__dirname+'/views');
app.get('/',function(req,res) {
	res.render('main');
});

app.get('/result',function(req,res) {
	res.render('result');
});

app.post('/result',function(req,res) {
	console.log(req.body);
})
/*app.post('/result',upload.single('book'),function(req,res,next) {
	//filename=req.file.filename;
	var xml=fs.readFileSync(__dirname+'/docbook.xml','utf-8');
	parser.parseString(xml,function(err,result) {
		if(err) return console.log(err);
		jsdom.env({
			html : xml,
			scripts: ["http://code.jquery.com/jquery.js"],
			done : function(errors, window) {
				analyzeBook(window,'book');		
				for(var k in status) {
					if(tagsInBook[k]==null) status[k]=0;
					else status[k]=tagsInBook[k];
				}
				
				BookData.findOne({title:status.title}, function(err, data) {
					if(err) console.log("DB find error : ", err);
					if(!data) {
						BookData.create(status,function(err,data) {
							if(err) console.log("DB create error : ", err);
							console.log("Data created");
						});
					}
					else {
						console.log(status.title, " already exists");
					}
				});
			}
		})
	})
	res.json({success:true});
})*/
app.listen('8000',function() {
	console.log('Server is working!!');
});

app.get('/input',function(req,res) {
	res.render('input');
});
/*
db.once('open',function() {
	console.log('DB connected');
});

db.on('error', function() {
	console.log("DB Error : " ,error);
});
*/

// analyzeBook : Count the specific tags in book 
var analyzeBook= function(window,root) {
	root=root.toLowerCase();
	if(tagsInBook[root]==null)
		tagsInBook[root]=1;
	else 
		tagsInBook[root]++;
	var numOfChilds = window.$(root).children().length;
	for(var index=0;index<numOfChilds;index++) {
		analyzeBook(window,window.$(root).children()[index].nodeName);
	}
};