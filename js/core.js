// JavaScript Document

var core = {
	'ViewPublicationEvent': 1,
	'DownloadPublicationEvent':2,
	'ViewProjectEvent':3,
	'DownloadResource':4,
	'DownloadCV':5,
	'debug': false,
	'notifyClick': function(alink, data, execute)
	{
			var href   = $(alink).attr('href');
			var target = $(alink).attr('target');
			if (data.preventDefault)
				data.preventDefault();
			else
				data.event.preventDefault();
			execute(alink, data);
			setTimeout(function() { 
				window.open(href,(!target?'_self':target)); 
			},300);
			return this;
	},
	'viewPublication': function(e)
	{
		core.notifyClick(this,e, function(alink, data){
					 core.log(['send', 'event', 'Publication', 'link',
					 	 $(alink).text(), core.ViewPublicationEvent]);
					 if (typeof ga !== 'undefined')
					 ga('send', 'event', 'Publication', 'link',
					 	 $(alink).text(), core.ViewPublicationEvent );
		});
	},
	'downloadPublication': function(e)
	{
		core.notifyClick(this,e, function(alink, data){
					core.log(['send', 'event', 'Publication', 'download', 
						alink.data('title'), core.DownloadPublicationEvent]);
					if (typeof ga !== 'undefined')
					ga('send', 'event', 'Publication', 'download', 
						alink.data('title'), core.DownloadPublicationEvent);
		});
		
	},
	'downloadResource': function(e)
	{
		core.notifyClick(this,e, function(alink, data){
					core.log(['send', 'event', 'Resource', 'download', 
						$(alink).text(), core.DownloadResource]);
					if (typeof ga !== 'undefined')
					ga('send', 'event', 'Resource', 'download', 
						$(alink).text(), core.DownloadResource);
		});
		
	},
	'downloadCV': function(e)
	{
		core.notifyClick(this,e, function(alink, data){
					core.log(['send', 'event', 'CV', 'download', 
						$(alink).text(), core.DownloadCV]);
					if (typeof ga !== 'undefined')
					ga('send', 'event', 'CV', 'download', 
						$(alink).text(), core.DownloadCV);
		});
		
	},
	'viewProject': function(e)
	{
		core.notifyClick(this,e, function(alink, data){
					core.log(['send', 'event', 'Project', 'page',
					 	 alink.data('title'), core.ViewProjectEvent]);
					 if (typeof ga !== 'undefined')
					 ga('send', 'event', 'Project', 'page',
					 	 alink.data('title'), core.ViewProjectEvent );
		});
	},
	'viewPageSection': function(e)
	{
		var href   = '/index.html'+ $(this).attr('href');
		core.log(['send', 'pageview', href]);
		if (typeof ga !== 'undefined')
		ga('send', 'pageview', href);
		
	},
	'viewSocial': function(e)
	{
		core.notifyClick(this,e, function(alink, data){
					core.log(['send', 'social', $(alink).text(), 'view', 
						$(alink).attr('href')]);
					
					if (typeof ga !== 'undefined')
					ga('send', 'social', $(alink).text(), 'view', 
						$(alink).attr('href'));
		});
		
	},
	'log':function(e)
	{
		if (core.debug)
			console.log(e);
	}
	
};
