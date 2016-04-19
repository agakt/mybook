/*
	This is a javascript file which handle the http://localhost:8000/input page
*/ 

var main= function() {
	alert('no error!');

	// Default show of select form
	// input page shows options about books which related Web
	var $titleSelect = document.getElementById('title');
	webBooks.forEach(function(e) {
		var option=document.createElement('option');
		option.text=e;
		$titleSelect.add(option);
	});

	// When the subject changes (ex. Web -> DB), the options which can be selected will change
	$('.subject').on('change',setTitles);

	$('.add_list').click(addList);
	$('.sub_list').click(delList);

	$('.fin_button').click(postData);
}

/*
	Send the post message which have information about user's favorite books to http://localhost:8000/result
*/
var postData = function() {
	alert('post data');
	var likes_length = document.getElementById('likes').options.length;

	// JSON Object { likes : [array]}
	var postMessage = new Object();
	var like_list = new Array();
	for(var index=0;index<likes_length;index++) {
		like_list[index]=document.getElementById('likes').options[index].text;
	}
	postMessage.likes = like_list;

	// Make post request message and send to server.
	xhr = new XMLHttpRequest();
	var url = "http://localhost:8000/result";
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json");
	/*xhr.onreadystatechange = function () { 
    	if (xhr.readyState == 4 && xhr.status == 200) {
     	   var json = JSON.parse(xhr.responseText);
     	   console.log(json.email + ", " + json.password)
   		 }
	}*/
	var data = JSON.stringify(postMessage);
	xhr.send(data);
	alert('data send!');
}

var delList = function() {
	var like_list = document.getElementById('likes');
	var selected=  like_list.options.selectedIndex;
	like_list.remove(selected);
}
var addList = function() {
	var bookTitle = $('.title :selected').text();
	var newOption = document.createElement('option');
	var like_list = document.getElementById('likes');
	newOption.text=bookTitle;
	like_list.add(newOption);
}

var removeOptions = function() {
	var $titleSelect = $('.title');
	$titleSelect.remove();
}
var setTitles = function() {
	var val = $('.subject').val();
	var $titleSelect = document.getElementById('title');
	while($titleSelect.length>0) {
		$titleSelect.remove(0);
	}
	switch(val) {
		case '1' :
		webBooks.forEach(function(e) {
			var option=document.createElement('option');
			option.text=e;
			$titleSelect.add(option);
		});
		break;
		case '2' :
		dbBooks.forEach(function(e) {
			var option=document.createElement('option');
			option.text=e;
			$titleSelect.add(option);
		}); break;
		case '4' :
		newworkBooks.forEach(function(e) {
			var option=document.createElement('option');
			option.text=e;
			$titleSelect.add(option);
		}); break;
	}
}
var webBooks = ['webA', 'webB'];
var dbBooks = ['dbA', 'dbB'];
var newworkBooks = ['networkA', 'networkB'];
$('document').ready(main);