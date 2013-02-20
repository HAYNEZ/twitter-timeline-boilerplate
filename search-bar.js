(function($) {

  function submitForm(event){
		event.preventDefault();
		
		var searchType = $("#dropdown").val();
		var searchTerm = $("#search-input").val();

		if (searchType == "Username") {
			$("#tweets").twitterTimeline(searchTerm);
		}
		else if (searchType == "Hashtag"){
			$("#tweets").twitterTerm(searchTerm);			
		}
	};

	$(document).ready(function($) {	
		$("#search-form").bind("submit", submitForm);

	});

})(jQuery);		
