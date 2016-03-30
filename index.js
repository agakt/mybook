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
}

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
				x=window.$('book').children().length;
				for(var index=0;index<x;index++) {
					console.log(window.$('book').children()[index].nodeName);
				}
				console.log(window.$('book').children()[0].text.length);
			}
		})
		//console.log(xml);
	})
	res.json({success:true});
})
app.listen('8000',function() {
	console.log('Server is working!!');
});
