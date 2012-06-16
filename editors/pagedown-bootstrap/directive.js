/*
 *usage: <textarea ui:pagedown-bootstrap ng:model="box.content"></textarea>
 */
myApp.directive('uiPagedownBootstrap', function($compile) {
    var nextId = 0;
    return {
        require: 'ngModel',
        replace:true,
        template:'<div class="pagedown-bootstrap-editor"></div>',
        link:function (scope, iElement, iAttrs, ngModel) {
                    
            var editorUniqueId = nextId++;
            
            var newElement = $compile('<div>'+
                '<div class="wmd-panel">'+
                '<div id="wmd-button-bar-'+editorUniqueId+'"></div>'+
                '<textarea class="wmd-input" id="wmd-input-'+editorUniqueId+'">{{modelValue()}}'+
                '</textarea>'+
                '</div>'+
                '<div id="wmd-preview-'+editorUniqueId+'" class="wmd-panel wmd-preview"></div>'+
                '</div>')(scope);
            
            iElement.html(newElement);
            
            var converter = new Markdown.Converter();
            
            var help = function () {
                // 2DO: add nice modal dialog
                alert("Do you need help?");
            }
            
            var editor = new Markdown.Editor(converter, "-"+editorUniqueId, {
                handler: help
            });
            
            editor.run();
                    
                    
            // local -> parent scope change (model)
            $("#wmd-input-"+editorUniqueId).on('change',function(){
                console.log('change - raw content: ',$(this).val());
                var rawContent = $(this).val();
                ngModel.$setViewValue(rawContent);
                scope.$apply();
            });
            
            
           
            // parent scope -> local change
            scope.modelValue = function() {
                return ngModel.$viewValue;
            };
            
            
        // 2DO: do we have to do this?
        // we watch the view value, otherwise the editor is not updated
        // editor.refreshPreview() forces the editor to re-render the preview according to the contents of the input, e.g. after you have programmatically changed the input box content. This method is only available after editor.run() has been called.
            
        }
    }
});
