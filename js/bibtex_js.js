//Based on Bibtex_js project.
//Modified by Andres Solis Montero 2015. 

// Issues:
//  no comment handling within strings
//  no string concatenation
//  no variable values yet

// Grammar implemented here:
//  bibtex -> (string | preamble | comment | entry)*;
//  string -> '@STRING' '{' key_equals_value '}';
//  preamble -> '@PREAMBLE' '{' value '}';
//  comment -> '@COMMENT' '{' value '}';
//  entry -> '@' key '{' key ',' key_value_list '}';
//  key_value_list -> key_equals_value (',' key_equals_value)*;
//  key_equals_value -> key '=' value;
//  value -> value_quotes | value_braces | key;
//  value_quotes -> '"' .*? '"'; // not quite
//  value_braces -> '{' .*? '"'; // not quite




function BibtexParser() {
			  this.pos = 0;
			  this.input = "";
			  
			  this.entries = {};
			  this.strings = {
				  JAN: "January",
				  FEB: "February",
				  MAR: "March",      
				  APR: "April",
				  MAY: "May",
				  JUN: "June",
				  JUL: "July",
				  AUG: "August",
				  SEP: "September",
				  OCT: "October",
				  NOV: "November",
				  DEC: "December"
			  };
			  this.currentKey = "";
			  this.currentEntry = "";
			  
			
			  this.setInput = function(t) {
				this.input = t;
			  }
			  
			  this.getEntries = function() {
				  return this.entries;
			  }
			  
			  this.listOfEntries = function() {
				  var data = [];
				  var fixValue = this.fixValue;
				  $.each(this.entries, function(key, value){
					  	var newObject = value;
						$.each(newObject, function(subKey, subValue){
							newObject[subKey] = fixValue(subValue);
						});
						data.push(newObject);	 
				  });
				  return data;
			  }
			
			  this.isWhitespace = function(s) {
				return (s == ' ' || s == '\r' || s == '\t' || s == '\n');
			  }
			
			  this.match = function(s) {
				this.skipWhitespace();
				if (this.input.substring(this.pos, this.pos+s.length) == s) {
				  this.pos += s.length;
				} else {
				  throw "Token mismatch, expected " + s + ", found " + this.input.substring(this.pos);
				}
				this.skipWhitespace();
			  }
			
			  this.tryMatch = function(s) {
				this.skipWhitespace();
				if (this.input.substring(this.pos, this.pos+s.length) == s) {
				  return true;
				} else {
				  return false;
				}
				this.skipWhitespace();
			  }
			
			  this.skipWhitespace = function() {
				while (this.isWhitespace(this.input[this.pos])) {
				  this.pos++;
				}
				if (this.input[this.pos] == "%") {
				  while(this.input[this.pos] != "\n") {
					this.pos++;
				  }
				  this.skipWhitespace();
				}
			  }
			
			  this.value_braces = function() {
				var bracecount = 0;
				this.match("{");
				var start = this.pos;
				while(true) {
				  if (this.input[this.pos] == '}' && this.input[this.pos-1] != '\\') {
					if (bracecount > 0) {
					  bracecount--;
					} else {
					  var end = this.pos;
					  this.match("}");
					  return this.input.substring(start, end);
					}
				  } else if (this.input[this.pos] == '{') {
					bracecount++;
				  } else if (this.pos == this.input.length-1) {
					throw "Unterminated value";
				  }
				  this.pos++;
				}
			  }
			
			  this.value_quotes = function() {
				this.match('"');
				var start = this.pos;
				while(true) {
				  if (this.input[this.pos] == '"' && this.input[this.pos-1] != '\\') {
					  var end = this.pos;
					  this.match('"');
					  return this.input.substring(start, end);
				  } else if (this.pos == this.input.length-1) {
					throw "Unterminated value:" + this.input.substring(start);
				  }
				  this.pos++;
				}
			  }
			  
			  this.single_value = function() {
				var start = this.pos;
				if (this.tryMatch("{")) {
				  return this.value_braces();
				} else if (this.tryMatch('"')) {
				  return this.value_quotes();
				} else {
				  var k = this.key();
				  if (this.strings[k.toLowerCase()]) {
					return this.strings[k];
				  } else if (k.match("^[0-9]+$")) {
					return k;
				  } else {
					throw "Value expected:" + this.input.substring(start);
				  }
				}
			  }
			  
			  this.value = function() {
				var values = [];
				values.push(this.single_value());
				while (this.tryMatch("#")) {
				  this.match("#");
				  values.push(this.single_value());
				}
				return values.join("");
			  }
			
			  this.key = function() {
				var start = this.pos;
				while(true) {
				  if (this.pos == this.input.length) {
					throw "Runaway key";
				  }
				
				  if (this.input[this.pos].match("[a-zA-Z0-9_:\\./-]")) {
					this.pos++
				  } else {
					return this.input.substring(start, this.pos).toLowerCase();
				  }
				}
			  }
			
			  this.key_equals_value = function() {
				var key = this.key();
				if (this.tryMatch("=")) {
				  this.match("=");
				  var val = this.value();
				  return [ key, val ];
				} else {
				  throw "... = value expected, equals sign missing:" + this.input.substring(this.pos);
				}
			  }
			
			  this.key_value_list = function() {
				var kv = this.key_equals_value();
				this.entries[this.currentEntry][kv[0]] = kv[1];
				while (this.tryMatch(",")) {
				  this.match(",");
				  // fixes problems with commas at the end of a list
				  if (this.tryMatch("}")) {
					break;
				  }
				  kv = this.key_equals_value();
				  this.entries[this.currentEntry][kv[0]] = kv[1];
				}
			  }
			
			  this.entry_body = function() {
				this.currentEntry = this.key();
				this.entries[this.currentEntry] = new Object();    
				this.match(",");
				this.key_value_list();
			  }
			
			  this.directive = function () {
				this.match("@");
				return "@"+this.key();
			  }
			
			  this.string = function () {
				var kv = this.key_equals_value();
				this.strings[kv[0].toLowerCase()] = kv[1];
			  }
			
			  this.preamble = function() {
				this.value();
			  }
			
			  this.comment = function() {
				this.value(); // this is wrong
			  }
			
			  this.entry = function() {
				this.entry_body();
			  }
			
			  this.bibtex = function() {
				while(this.tryMatch("@")) {
				  var initialPos = this.pos;
				  var d = this.directive().toLowerCase();
				  
				  this.match("{");
				  if (d == "@STRING") {
					this.string();
				  } else if (d == "@PREAMBLE") {
					this.preamble();
				  } else if (d == "@COMMENT") {
					this.comment();
				  } else {
					this.entry();
				  }
				  this.match("}");
				  var finalPos = this.pos;
				  //this.entries[this.currentEntry]['BIBTEX'] = this.input.substring(initialPos, finalPos);
				  this.entries[this.currentEntry]['_directive'] = d.toLowerCase();
				  this.entries[this.currentEntry]['_entryname'] = this.currentEntry.toLowerCase();
				  this.entries[this.currentEntry]['_bibtex'] = this.displayEntry(this.entries[this.currentEntry]);
				}
			  }
			  this.displayEntry = function(entry)
			  {
				  var bibtex = entry['_directive'] + '{ ' + entry['_entryname'] + ',\n';
				  $.each( entry, function( key, value ) {
					  if (key.charAt(0)!= '_' && key != 'url')
  						bibtex = bibtex + '\t' +  key.toLowerCase() + "={" + value + '},\n';
				  });
				  bibtex = bibtex + '}'
				  return bibtex;
			  }
			  this.fixValue = function (value) {
				value = value.replace(/\\glqq\s?/g, "&bdquo;");
				value = value.replace(/\\grqq\s?/g, '&rdquo;');
				value = value.replace(/\\ /g, '&nbsp;');
				value = value.replace(/\\url/g, '');
				value = value.replace(/---/g, '&mdash;');
				value = value.replace(/{\\"a}/g, '&auml;');
				value = value.replace(/\{\\"o\}/g, '&ouml;');
				value = value.replace(/{\\"u}/g, '&uuml;');
				value = value.replace(/{\\"A}/g, '&Auml;');
				value = value.replace(/{\\"O}/g, '&Ouml;');
				value = value.replace(/{\\"U}/g, '&Uuml;');
				value = value.replace(/\\ss/g, '&szlig;');
				value = value.replace(/\{(.*?)\}/g, '$1');
				value = value.replace(/\\'\\?([aeiouAEIOU])/g, '&$1acute;');
				value = value.replace(/\\`\\?([aeiouAEIOU])/g, '&$1grave;');
				value = value.replace(/\\&/g, '&amp;');
				value = value.replace(/--/g, '-');
				return value;
			  }
}

(function( $ ) {
 
    $.fn.bibtexjs = function() {
 	
		var functions = {
			 parseFunction: function(bibtex, data){
			  	 var b = new BibtexParser();
    			 b.setInput(data);
    			 b.bibtex();
				 var entries = b.getEntries();
				 
				 bibtex.json2html(b.listOfEntries(), transform.publications);
				 bibtex.find('[data-toggle="popover"]').popover({
					html: true, 
				 content: function() {
					return 	'<pre>'+entries[$(this).data('entry-name')]['_bibtex']+'</pre>';
				}});
		  	}
		};
		
		
		var transform = {
			author: {"tag":"span","class":"author","html":"${author}, "},
			title:  {"tag":"a","class":"url","href":"${url}", 
					"target":"publication", "onclick": core.viewPublication,
					"children":[ {"tag":"em","children":[
						{"tag":"span","class":"title","html":"${title}"}
					]}
        		]},
			booktitle: 	{"tag":"span","class":"booktitle","html":", ${booktitle}"},
			journal:		{"tag":"span","class":"journal","html":", ${journal}"}, 
			pages: 		{"tag":"span","class":"pages","html":", ${pages}"},
			organization : {"tag":"span","class":"organization","html":", ${organization}"},
			publisher: 	{"tag":"span","class":"publisher","html":", ${publisher}"},
			year: 		{"tag":"span","class":"year","html":", ${year}. "},
			bibtex:  	{"tag":"span","type":"button","class":"glyphicon glyphicon-link",
							"data-toggle":"popover","data-placement":"bottom",
							"data-original-title":"BibTeX", "data-entry-name" :"${_entryname}"},
			download: 	{"tag":"a","class":"glyphicon glyphicon-download-alt bibtex_download",
							"href":"bib/${_entryname}.pdf", "data-title":"${title}", "onclick":core.downloadPublication,
							 "download":"download.pdf","html":"", "target":"download"},
			publications: {"tag":"div","class":"bibtex_item","children":[
							{"tag":"p","children":
								function(){
									var children = [];
									if (this.author)
										children.push(transform.author);
									if (this.title)
										children.push(transform.title);
									if (this.booktitle)
										children.push(transform.booktitle);
									if (this.journal)
										children.push(transform.journal);
									if (this.pages)
										children.push(transform.pages);
									if (this.organization)
										children.push(transform.organization);
									if (this.publisher)
										children.push(transform.publisher);
									if (this.year)
										children.push(transform.year);
									if (!this._hidebibtex)
										children.push(transform.bibtex);
									if (this._download)
										children.push(transform.download);
									return json2html.transform(this, children, {'events':true});	
								}
		}]}};
					
  		return this.each(function() {
		  var bibtex = $(this);
		  var dataURL= bibtex.data("url");
		  if (dataURL)
		  {
		  	$.get(dataURL, function(data){
					functions.parseFunction(bibtex, data);
		  	}, 'text');
		  } 
		  return this;
        });
    };
 
}( jQuery ));


