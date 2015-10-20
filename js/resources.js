// JavaScript Document
(function( $ ) {
 
    $.fn.resources = function() {
 	
		var transform = {
			latex: [{"tag":"span","html":"{"}, {"tag":"img","src":"images/latex.png"}, {"tag":"span","html":"} "}],
			resources: {"tag":"div","class":"col-sm-4 col-md-3 ","children":[
						{"tag":"div","class":"thumbnail","children":[
							{"tag":"div","class":"caption","children":[
								{"tag":"a","href":"${url}","target":"download", "onclick":core.downloadResource ,"children":[
									{"tag":"p","children":function(){
											var children = [];
											if (this.latex)
												children.push(transform.latex);
											children.push({"tag":"span","class":"text","html": this.text});
											return json2html.transform(this, children, {'events':true});	
									}}
								  ]}
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
				project.json2html(json, transform.resources);
			});
		  } 
		  return this;
        });
	};
 
}( jQuery ));
// JavaScript Document