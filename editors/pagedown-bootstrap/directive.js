/*
 *usage: <textarea ui:pagedown-bootstrap ng:model="box.content"></textarea>
 */
myApp.directive('uiPagedownBootstrap',['$compile', function($compile) {
    var nextId = 0;
    
    //Make converter only once to save a bit of load each time - thanks to ajoslin
    var converter = new Markdown.Converter();

    return {
        replace:true,
        scope: {
            markdown: '='
        },
        template:'<div class="pagedown-bootstrap-editor"></div>',
        link:function (scope, iElement, iAttrs) {
                    
            var editorUniqueId = nextId++;
            
            var newElement = $compile('<div>'+
                '<div class="wmd-panel">'+
                '<div id="wmd-button-bar-'+editorUniqueId+'"></div>'+
                '<textarea class="wmd-input" id="wmd-input-'+editorUniqueId+'" ng-model="markdown">'+
                '</textarea>'+
                '</div>'+
                '<div id="wmd-preview-'+editorUniqueId+'" class="wmd-panel wmd-preview"></div>'+
                '</div>')(scope);
            
            iElement.html(newElement);
            
            var help = function () {
                // 2DO: add nice modal dialog
                alert("Do you need help?");
            };

            converter.hooks.chain("preConversion", function (text) {
                //console.log("preconversion", text);
                if(text !== "" && scope.markdown !== text) {
                    scope.markdown = text;
                }
                return text;
            });

            var editor = new Markdown.Editor(converter, "-"+editorUniqueId, {
                handler: help
            });
            
            editor.run();

            // parent scope -> local change
            scope.$watch("markdown", function(value,oldValue) {
                //console.log('ngModel changed','old: ',oldValue,'new: ',value);
                if(angular.isDefined(value)){
                    editor.refreshPreview(); // forces the editor to re-render the preview according to the contents of the input, e.g. after you have programmatically changed the input box content. This method is only available after editor.run() has been called.
                }
               
            });
        }
    };
}]);
