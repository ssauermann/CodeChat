/*jslint browser: true, es5: true*/
/*global $, jQuery, alert, console*/
(function () {
    "use strict";

    function editCode() {
        $('#code *').attr('contentEditable', 'true');
        $('#edit').toggleClass('btn-primary');
        $('#edit').toggleClass('btn-success');
        $('#edit').html('Send');
        $('#edit').attr('id', 'sendCode');
    }
    
    $(document).ready(function () {
        
        $('#edit').click(function () {
            editCode();
        });
        
    });
    
}());