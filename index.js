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
	problems:Number,
};

var tagCount = {
	tagName : String,
	count : Number
};

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
				for(var i=0;i<numOfTags;i++) {
					console.log(tagsInBook[i].tagName + " " + tagsInBook[i].count);
				}
			}
		})
	})
	
	res.json({success:true});
})
app.listen('8000',function() {
	console.log('Server is working!!');
});

var analyzeBook= function(window,root) {
	var i=0;
	for(i=0;i<numOfTags;i++) {
		if(tagsInBook[i].tagName==root) {
			tagsInBook[i].count++;
			break;
		}
	}
	if(i==numOfTags) {
		var newTag=new Object();
		newTag.tagName=root;
		newTag.count=0;
		tagsInBook[numOfTags++]=newTag;
	}
	var numOfChilds = window.$(root).children().length;
	for(var index=0;index<numOfChilds;index++) {
		analyzeBook(window,window.$(root).children()[index].nodeName);
	}
};