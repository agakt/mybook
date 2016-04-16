var main= function() {
	var $titleSelect = document.getElementById('title');
	webBooks.forEach(function(e) {
		var option=document.createElement('option');
		option.text=e;
		$titleSelect.add(option);
	});
	$('.subject').on('change',setTitles);

	$('.add_list').click(addList);
	$('.sub_list').click(delList);
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