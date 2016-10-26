// add event listener to the shrink button for when the user clicks on it

$('.btn-shorten').on('click', function(){
	// AJAX call to /api/shorten with the URL that the user entered in the input box

	$.ajax({
		url: '/api/shorten',
		type: 'POST',
		dataType: 'JSON',
		data: {url: $('#url-field').val()},
		success: function(data) {
			var resultHTML = '<a class="result" href="' + data.shortUrl + '">' + data.shortUrl + '</a>';
			$('#link').html(resultHTML);
			$('#link').hide().fadeIn('slow');
		}
	});
});