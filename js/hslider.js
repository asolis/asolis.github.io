// JavaScript Document
// JavaScript Document
(function( $ ) {
 
    $.fn.hslider = function() {
 	
		var transform = {
			construction: {"tag":"div","class":"thumbnail",
								"style":"background-image:url(${image});","children":[
								{"tag":"div","class":"caption","children":[
									{"tag":"h5","html":"${title}"},
									{"tag":"div","class":"links","children": 
										[{"tag":"span", "html":'Under Construction '},
						  			    {"tag":"span","type":"button","class":"glyphicon glyphicon-wrench", "html":'  '}]
									}
								  ]}
							]},
			page: {"tag":"a", "href":"${page}", "data-title":"${title}$", 'target':'project', 'onclick':core.viewProject, "children":[
								{"tag":"div","class":"thumbnail",
								"style":"background-image:url(${image});","children":[
								{"tag":"div","class":"caption","children":[
									{"tag":"h5","html":"${title}"},
									{"tag":"div","class":"links","children": [
										{"tag":"span","type":"button","class":"glyphicon glyphicon-globe", "href":"${page}","html":'  '}
									]}
								  ]}
							  ]}
							]},
			projects: {"tag":"div","class":"col-sm-4 col-md-4 col-xs-6 ","children":function(){
						if (this.page)
							return json2html.transform(this, transform.page, {'events':true});
						else
							return json2html.transform(this, transform.construction);
			}},
			indicator: {"tag":"li","data-target":"#carousel-example-generic","data-slide-to":"${number}","class":"${active}","html":""},
			caption:{"tag":"div","class":"carousel-caption","html":"Page: ${page} / ${totalPages}"},
			slide:{"tag":"div","class":"item ${active}","children":function(){
				    
					var _obj = json2html.transform(this.inpage, transform.projects, {'events':true});
					//var _caption = json2html.transform(this, transform.caption);
					//_obj.html += _caption;
					return _obj;
				}},
			slider:{"tag":"div","id":"carousel-example-generic","class":"carousel slide","data-ride":"carousel","children":[
						{"tag":"ol","class":"carousel-indicators","children":function(){
							return json2html.transform(this.pages, transform.indicator, {'events':true});	
						}},
						{"tag":"div","class":"carousel-inner","role":"listbox","children":function(){
							return json2html.transform(this.projects, transform.slide, {'events':true});	
						}}/*,
						{"tag":"a","class":"left carousel-control","href":"#carousel-example-generic","role":"button","data-slide":"prev","children":[
							{"tag":"span","class":"glyphicon glyphicon-chevron-left","aria-hidden":"true","html":""},
							{"tag":"span","class":"sr-only","html":"Previous"}
						  ]},
						{"tag":"a","class":"right carousel-control","href":"#carousel-example-generic","role":"button","data-slide":"next","children":[
							{"tag":"span","class":"glyphicon glyphicon-chevron-right","aria-hidden":"true","html":""},
							{"tag":"span","class":"sr-only","html":"Next"}
						  ]}*/
					  ]}
		};
	
					
  		return this.each(function() {
		  var project = $(this);
		  var dataURL = project.data("url");
		  if (dataURL)
		  {
		  	$.getJSON(dataURL, function(json){
				var slider = {};
				slider.pages = [];
				slider.projects = [];
				var step = 12;
				var totalPages = Math.ceil(json.length/step);
				
				for (var i = 0; i < totalPages; i++)
				{
					var _class = ((i === 0)? "active" : "" );
					slider.pages.push({active:_class, number:i});
					var _slice = json.slice(i * (step ), i * (step ) + step);
					slider.projects.push({ active: _class, inpage: _slice, page: (i+1), totalPages: totalPages});
				}
		
				project.json2html(slider, transform.slider);
			
			});
		  } 
		  return this;
        });
	};
 
}( jQuery ));