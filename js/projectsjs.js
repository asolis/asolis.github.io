// JavaScript Document
(function( $ ) {
 
    $.fn.projectsjs = function() {
 	
		var transform = {
			construction: [{"tag":"span", "html":'Under Construction '},
						   {"tag":"span","type":"button","class":"glyphicon glyphicon-wrench", "html":'  '}],
			page:{"tag":"a","type":"button","class":"glyphicon glyphicon-globe",
					"href":"${page}","html":'  ',"data-title":"${title}$", 'target':'project', 'onclick':core.viewProject},
			projects: {"tag":"div","class":"col-sm-4 col-md-4 col-xs-6 ","children":[
							{"tag":"div","class":"thumbnail",
								"style":"background-image:url(${image});","children":[
								{"tag":"div","class":"caption","children":[
									{"tag":"h5","html":"${title}"},
									{"tag":"div","class":"links","children": function () {
											var children = [];
											if (this.construction)
												children.push(transform.construction);
											if (this.page)
												children.push(transform.page);
											return json2html.transform(this, children, {'events':true});
										} }
								  ]}
							  ]}
							]}
		};
		
					
  		return this.each(function() {
		  var project = $(this);
		  var dataURL = project.data("url");
		  if (dataURL)
		  {
		  	$.getJSON(dataURL, function(json){
				project.json2html(json, transform.projects);
			});
		  } 
		  return this;
        });
	};
 
}( jQuery ));


