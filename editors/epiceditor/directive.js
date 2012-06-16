// thanks to:
// https://groups.google.com/forum/?fromgroups#!searchin/angular/directive$20model/angular/odcpnPa0R2k/r48ov-D2YFgJ
// https://groups.google.com/forum/?fromgroups#!searchin/angular/scope$20ngmodel/angular/WDEsUD5eYck/TLv3XXmv-ZcJ

myApp.directive('uiEpicEditor', function() {
    return {
        require: 'ngModel',
        replace:true,
        template:'<div class="epic-editor"></div>',
        link: function(scope, element, attrs, ngModel) {
            
            var opts = {
                container: element.get(0), // raw element or ID
                basePath: 'assets/', // from js file epiceditor.js
                file:{
                    autoSave:false
                }
                /*
                basePath: 'epiceditor',
                localStorageName: 'epiceditor',
                parser: marked,
                file: {
                    name: 'epiceditor',
                    defaultContent: '',
                    autoSave: 100
                },
                theme: {
                    base:'/themes/base/epiceditor.css',
                    preview:'/themes/preview/preview-dark.css',
                    editor:'/themes/editor/epic-dark.css'
                },
                focusOnLoad: false,
                shortcut: {
                    modifier: 18,
                    fullscreen: 70,
                    preview: 80,
                    edit: 79
                }*/
            }
            
            
            
            var editor = new EpicEditor(opts);
            
            editor.load(function () {
                // editor loaded
                
                // local -> parent scope change
                
                var iFrameEditor = editor.getElement('editor');
               
                // we get body dom element, because this is contenteditable=true                
                // http://stackoverflow.com/questions/6256342/trigger-an-event-when-contenteditable-is-changed
                var contents = $('body',iFrameEditor).html();
                $('body',iFrameEditor).blur(function() {
                    console.log('BLUR!',this,$(this));
                    if (contents!=$(this).html()){
                        // there was a change!
                        console.log('CHAAAANGE!');
                        contents = $(this).html(); // set to new content
                        editor.save(); // important!
                        var rawContent = editor.exportFile();
                        ngModel.$setViewValue(rawContent);
                        scope.$apply();
                    }
                }); // eo blur
            });
            
            // parent -> local scope change
            // 2DO: WATCH NG MODEL VALUE AND TRIGGER EDITOR -> LOAD FILE
            // HOW TO DO IT ??
        }
    }
});