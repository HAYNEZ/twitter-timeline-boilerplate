/**
 * super-simple twitter timeline boilerplate
 */

(function($) {

  //
	// -- Private ------------------------------------------------------------------------------------------------------------------
	//
	
	var tweetTemplate = '<li class="tweet">CONTENT<div class="time">TIME</div></li>'; 
	var tweetTemplateTerm = '<li class="tweetTerm">USERPIC<span class="name">USERNAME</span><div class="tweet">CONTENT</div><div class="time">TIME</div></li>';
	var $container = null;

	function deleteTweets(){
		$("#tweets li").remove();
	}

	/**
		* load some tweets using the user_timeline API
		* documentation: https://dev.twitter.com/docs/api/1/get/statuses/user_timeline
		* @param {string} twitter user name (scren name with or without the @-prefix)
		*/
	function loadTweets(user) {
		$.ajax({
			url: 'http://api.twitter.com/1/statuses/user_timeline.json/',
			type: 'GET',
			dataType: 'jsonp',
			data: {
				screen_name: user,
				include_rts: true,				
				include_entities: true
			},			
			success: displayTweets
		});
	};

	/**
		* load some tweets using the search API
		*/
	function loadTweetsTerm(searchTerm){
		var rows = 8;

		$.ajax({
			url: 'http://search.twitter.com/search.json?q='+searchTerm+'&rpp='+rows,
			dataType: 'jsonp',
			success: displayTweetsTerm
		});
	};

	/**
		* add tweets to the DOM using a template
		* @param {object} data, results, ... returned from Twiter API
		*/
	function displayTweetsTerm(data){
		//displays data in console
		deleteTweets();

		console.log("Whut?!", data);

		var tweets = data.results;

		for (var i = 0; i < tweets.length; i++){

			console.log(tweets[i]);

			var tweet = tweetTemplateTerm
				.replace('USERPIC', '<img class="tweetPic" src="'+tweets[i].profile_image_url+'"/>')
				.replace('USERNAME', tweets[i].from_user)
				.replace('CONTENT', ify.clean(tweets[i].text))
				.replace('TIME', timeAgo(tweets[i].created_at));

			$container.append(tweet);
		};
	};

	/**
		* add tweets to the DOM using a simple template
		* @param {object} data returned from Twitter API
		*/
	function displayTweets(data) {

		deleteTweets();

		for (var i = 0; i < data.length; i++) {
			var tweet = tweetTemplate
				.replace('CONTENT', ify.clean(data[i].text))
				.replace('TIME', timeAgo(data[i].created_at));
				
			$container.append(tweet); 
		};		
	};


	//
	// -- Private utility functions ------------------------------------------------------------------------------------------------------------------
	//	the following two functions are helpers for formatting entries. You probably shouldn't change any of that code.
		
	/**
		* relative time calculator
		* borrowed from http://twitter.com/javascripts/widgets/widget.js
		* @param {string} twitter date string returned from Twitter API
		* @return {string} relative time like "2 minutes ago"
		*/
	function timeAgo(dateString) {
			var rightNow = new Date();
			var then = new Date(dateString);
	
			if ($.browser.msie) {
				// IE can't parse these crazy Ruby dates
				then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
			}
	
			var diff = rightNow - then;
	
			var second = 1000,
					minute = second * 60,
					hour = minute * 60,
					day = hour * 24,
					week = day * 7;
	
			if (isNaN(diff) || diff < 0) {
				return ""; // return blank string if unknown
			}
	
			if (diff < second * 2) {
				// within 2 seconds
				return "right now";
			}
	
			if (diff < minute) {
				return Math.floor(diff / second) + " seconds ago";
			}
	
			if (diff < minute * 2) {
				return "about 1 minute ago";
			}
	
			if (diff < hour) {
				return Math.floor(diff / minute) + " minutes ago";
			}
	
			if (diff < hour * 2) {
				return "about 1 hour ago";
			}
	
			if (diff < day) {
				return	Math.floor(diff / hour) + " hours ago";
			}
	
			if (diff > day && diff < day * 2) {
				return "yesterday";
			}
	
			if (diff < day * 365) {
				return Math.floor(diff / day) + " days ago";
			}
	
			else {
				return "over a year ago";
			}
	
		};
	
	
		/**
			* The Twitalinkahashifyer!
			* borrowed from http://twitter.com/javascripts/widgets/widget.js
			* more info: http://dustindiaz.com/linkified-tweets
			* Usage:
			* ify.clean('your tweet text');
			*/
		var ify = {
			link: function(tweet) {
				return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
					var http = m2.match(/w/) ? 'http://' : '';
					return '<a class="twtr-hyperlink" target="_blank" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
				});
			},

			at: function(tweet) {
				return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
					return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
				});
			},

			list: function(tweet) {
				return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
					return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
				});
			},

			hash: function(tweet) {
				return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
					return before + '<a target="_blank" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
				});
			},

			clean: function(tweet) {
				return this.hash(this.at(this.list(this.link(tweet))));
			}
		}



	//
	// -- Public ------------------------------------------------------------------------------------------------------------------
	//	

	/**
		* Initialize the timeline (public)
		* @param {string} twitter user name (scren name with or without the @-prefix)		
		*/	
	$.fn.twitterTimeline = function(user) {
		$container = $(this);	
		loadTweets(user);
	};

	$.fn.twitterTerm = function(searchTerm){
		$container = $(this);
		loadTweetsTerm(searchTerm);
	}
	
})(jQuery);
