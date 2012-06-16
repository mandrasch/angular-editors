myApp.directive('uiTinymce', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            
            element.tinymce({
                // Location of TinyMCE script
                script_url: 'assets/tiny_mce.js',

                // General options
                theme_advanced_toolbar_location : "top",
                theme: "advanced",
                theme_advanced_buttons1 : "newdocument,|,bold,italic,underline,|,justifyleft,justifycenter,justifyright,fontselect,fontsizeselect,formatselect",
                theme_advanced_buttons2 : "cut,copy,paste,|,bullist,numlist,|,outdent,indent,|,undo,redo,|,link,unlink,anchor,image,|,code,preview,|,forecolor,backcolor",
                theme_advanced_buttons3 : "insertdate,inserttime,|,spellchecker,advhr,,removeformat,|,sub,sup,|,charmap,emotions",      

                // Change from local directive scope -> "parent" scope
                // Update Textarea and Trigger change event
                // you can also use handle_event_callback which fires more often
                onchange_callback: function(e) {

                    if (this.isDirty()) {
                        this.save();

                        // tinymce inserts the value back to the textarea element, so we get the val from element (work's only for textareas)
                        ngModel.$setViewValue(element.val());
                        scope.$apply();
                        
                        return true;
                    }
                }
            });

        }
    }
});