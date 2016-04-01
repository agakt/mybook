var express=require('express');
var path=require('path');
var xml2js=require('xml2js');
var parser=new xml2js.Parser();
var fs=require('fs');
var bodyParser=require('body-parser');
var multer = require('multer');
var jsdom=require('jsdom');

var upload=multer({dest:'./tmp/uploads/'});
var app=express();

var filename;
var status = {
	texts:Number,
	pictures:Number,
	codes:Number,
	LengthOfChapter:Number,
	totalPages:Number,
	wordsOfPage :Number,
	examples:Number,
	questions:Number,
};

var tagCount = {
	tagName : String,
	count : Number
};

var enumObj = new Object();
enumObj.tagName = {pharse:0, screen:1, code:2, example:3, question:4};
var tagsInBook = new Array();
var numOfTags=0;

app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');

app.get('/',function(req,res) {
	res.render('main');
});

app.post('/result',upload.single('book'),function(req,res,next) {
	//filename=req.file.filename;
	var xml=fs.readFileSync(__dirname+'/docbook.xml','utf-8');
	parser.parseString(xml,function(err,result) {
		if(err) return console.log(err);
		jsdom.env({
			html : xml,
			scripts: ["http://code.jquery.com/jquery.js"],
			done : function(errors, window) {
				analyzeBook(window,'book');
				status.texts=tagsInBook.PHARSE;
				status.pictures=tagsInBook.SCREEN;
				status.codes=tagsInBook.CODE;
				//status.LengthOfChapter=tagsInBook.PHARSE;
				status.examples=tagsInBook.EXAMPLE;
				status.questions=tagsInBook.QUESTION;
				res.json(status);
			}
		})
	})
})
app.listen('8000',function() {
	console.log('Server is working!!');
});

var analyzeBook= function(window,root) {
	if(tagsInBook[root]==null)
		tagsInBook[root]=1;
	else 
		tagsInBook[root]++;
	var numOfChilds = window.$(root).children().length;
	for(var index=0;index<numOfChilds;index++) {
		analyzeBook(window,window.$(root).children()[index].nodeName);
	}
};