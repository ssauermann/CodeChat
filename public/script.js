/*jslint browser: true, es5: true*/
/*global $, jQuery, alert, console*/
(function () {
    "use strict";

    function editCode() {
        $('#code *').attr('contentEditable', 'true');
        $('#sendCode').removeClass('disabled');
        $('#edit').addClass('disabled');
    }
    
    $(document).ready(function () {
        
        $('#edit').click(function () {
            editCode();
        });
        
    });
    
}());