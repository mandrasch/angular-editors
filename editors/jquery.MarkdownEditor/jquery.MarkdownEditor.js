// jQuery MarkdownEditor for jQuery
// by Daniel Camargo @pererinha 
// http://danielcamargo.com/jquery.MarkdownEditor/
// 
// Version 0.0.1
// Full source at https://github.com/harvesthq/chosen
// https://github.com/pererinha/jquery.MarkdownEditor

(function( $ ){
	var info = {
			name : 'markdownEditor',
			version : '0.0.1',
			soundtrack : 'Requiem for a dream :)',
			author : '@pererinha',
			date : '27/12/2011'
	}
	var Mark = function( attr ){
		this.attr = attr;
		this.toString = function(){
			html = '';
			type = ( this.attr.type ) ? this.attr.type : 'default';
			switch( type ){
				case 'prompt':
					var content = selectedText( this.attr.name );
					html = this.attr.html.replace( utils.content , content );
				break;
				default:
					html = this.attr.html;
			}
			return html;
		}
	}
	var marks = {
			headers : {
				type : 'combo',
				name : 'Headers',
				marks : {
					header1 : new Mark( { name : 'Header 1', html : '\n# {{content}}\n', type : 'prompt' } ),
					header2 : new Mark( { name : 'Header 2', html : '\n## {{content}}\n', type : 'prompt' } ),
					header3 : new Mark( { name : 'Header 3', html : '\n### {{content}}\n', type : 'prompt' } ),
					header4 : new Mark( { name : 'Header 4', html : '\n#### {{content}}\n', type : 'prompt' } ),
					header5 : new Mark( { name : 'Header 5', html : '\n##### {{content}}\n', type : 'prompt' } ),
					header6 : new Mark( { name : 'Header 6', html : '\n###### {{content}}\n', type : 'prompt' } )
				}
			},
			codes : {
				type : 'combo',
				name : 'Code',
				source : 'languages',
				html : '\n\n`#{{content}}\nyour code here\n`\n' 
			},
			link : new Mark( { name : 'Link', html : '[text](url)'} ),
			image : new Mark( { name : 'Image', html : '\n![alt text](source)\n'} ),
			bold : new Mark( { name : 'Bold', html : '**{{content}}**', type : 'prompt' } ),
			italic : new Mark( { name : 'Italic', html : '_{{content}}_', type : 'prompt' } ),
			bullets : new Mark( { name : 'Bullets', html : '\n* item 1\n* item 2\n* item 3\n' } ),
			list : new Mark( { name : 'List', html : '\n1. item 1\n2. item 2\n3. item 3\n' } ),
			blockquotes : new Mark( { name : 'Blockquotes', html : '\n>> your text here'} ),
			line : new Mark( { name : 'Line', html : '\n--------------------------\n' } ),
			table : new Mark( { name : 'Table', html : '\n| Header | Header | Header |\n| ------ | ------ | ------ |\n|  Cell  |  Cell  |  Cell  |\n|  Cell  |  Cell  |  Cell  |\n' } ),
	}
	var utils = {
		newLine : '\n',
		content : '{{content}}',
		breakLine : '<br />'
	}
	var defaults = {
		textarea : {
			height : 400,
			width : 700,
		},
		languages : ['abap','actionscript','actionscript3','ada','apache','applescript','apt_source','asm','asp','autoit','avisynth','bash','basic4gl','bf','blitzbasic','bnf','boo','c_mac','c','caddcl','cadlisp','cfdg','cil','cobol','cpp-qt','cpp','csharp','css','d','dcs','delphi','diff','div','dos','dot','eiffel','email','fortran','freebasic','genero','gettext','glsl','gml','gnuplot','groovy','haskell','hq9plus','html4strict','idl','ini','inno','intercal','io','java','java5','javascript','kixtart','klonec','klonecpp','latex','lisp','locobasic','lolcode','lotusformulas','lotusscript','lscript','lsl2','lua','m68k','make','matlab','mirc','modula3','mpasm','mxml','mysql','nsis','oberon2','objc','ocaml-brief','ocaml','oobas','oracle8','oracle11','pascal','per','perl','php-brief','php','pic16','pixelbender','plsql','povray','powershell','progress','prolog','providex','python','qbasic','rails','rebol','reg','robots','ruby','sas','scala','scheme','scilab','sdlbasic','smalltalk','smarty','sql','tcl','teraterm','text','thinbasic','tsql','typoscript','vb','vbnet','verilog','vhdl','vim','visualfoxpro','visualprolog','whitespace','winbatch','xml','xorg_conf','xpp','z80']
		};
	var MarkDownEditor = function( input ){
		var settings, el;
		function resize(){
			el.width( settings.textarea.width );
			el.height( settings.textarea.height );
		}
		function insertIntoTextArea( content ){
			elDom = document.getElementById( el.attr( 'id' ) );
			if( document.selection ){
				elDom.focus();
				sel = document.selection.createRange();
				sel.text = content;
				return;
			}
			if( elDom.selectionStart || elDom.selectionStart == "0" ){
				var t_start = elDom.selectionStart;
				var t_end = elDom.selectionEnd;
				var val_start = elDom.value.substring (0, t_start );
				var val_end = elDom.value.substring( t_end, elDom.value.length);
				elDom.value = val_start + content + val_end;
			} else {
				elDom.value += content;
			}
			elDom.focus();
			return;
		}
		function insertButtons(){
			var buttons = new Array();
			$.each( settings.marks, function( key, mark ){
				if( mark.type == 'combo' ){
					var $select = $( '<select>' );
					$select.append ( '<option>' + mark.name + '</option>' );
					if( mark.source ){
						source = settings[ mark.source ];
						$.each( source, function( index, value ){
							html = mark.html.replace( utils.content, value ); 
							option = new Mark( { name : value, html : html });
							$select.append ( new InputOption( value, option ) );
						});
					} else {
						$.each( mark.marks, function( key, option ){
							$select.append ( new InputOption( option.attr.name, option ) );
						});
					}
					$select.bind('change', function(){
						var option = $( this ).find( ':selected' );
						option = option.data('option');
						insertIntoTextArea( option.toString() );
						$( this ).find( 'option:first' ).attr( 'selected', 'selected' );
					});
					el.before( $select );
				} else {
					el.before( new InputButton( mark.attr.name, function(){ insertIntoTextArea( mark.toString() ) } ) );	
				}
			} );
			el.before( utils.breakLine );
		}
		return {
			init : function ( options ) {
				el = $( input );
				settings = options;
				resize();
				insertButtons();
			}
		};
	}
	function selectedText( name ){
		var content = '';
		elDom = document.getElementById( 'markdown-it' );
		if( elDom.selectionStart ){
			var start = elDom.selectionStart;
			var end = elDom.selectionEnd;
			var length = end - start;
			content = elDom.value.substr( start, length );
		} else if( document.selection ){
			elDom.focus();
			var range = document.selection.createRange();
			if (range !== null) {
				var re = elDom.createTextRange();
				var rc = re.duplicate();
				re.moveToBookmark(r.getBookmark());
				rc.setEndPoint('EndToStart', re);
				content = r.text;
			}
		}
		if( content == '' ){
			content = prompt( 'Please type the ' + name + ':' );
			if( !content ){ content = name; }
		}
		return content.toString();
	}
	var InputButton = function( name, fn ){
		button = $( '<input type="button" value="' + name + '"/>' );
		button.bind( 'click', fn );
		return button;
	}
	var InputOption = function( name, obj ){
		var option = $( '<option>' + name + '</option>' );
		option.data( 'option', obj )
		return option;
	}
	$.fn.markdownEditor = function( options ) {
		if( !options ){ options = {}; }
		var options = $.extend(defaults, options);
		var instance = $.data( this, 'markdownEditor', new MarkDownEditor( this ));
		options.marks = marks;
		return instance.init.call(this, options);
	};
})( jQuery );