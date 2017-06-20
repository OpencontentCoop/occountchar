$(document).ready(function () {
    var countChar = function (input) {
        var tx = input.val();
        tx = tx.replace(/\s/g, '');
        tx = tx.replace(/\.\.\./g, ' '); // convert ellipses to spaces
        tx = tx.replace(/<.[^<>]*?>/g, ' ').replace(/&nbsp;|&#160;/gi, ' '); // remove html tags and space chars
        tx = tx.replace(/(\w+)(&.+?;)+(\w+)/, "$1$3").replace(/&.+?;/g, ' ');
        tx = tx.replace(/[.(),;:!?%#$?\'\"_+=\\\/-]*/g, ''); // remove punctuation

        input.next('.inputCharCount').text("Chars: " + tx.length);
    };
    $("input[name^='ContentObjectAttribute_ezstring_data_text_'], textarea[name^='ContentObjectAttribute_data_text_']").each(function () {
        if (!$(this).next().hasClass('inputCharCount')
            && $(this).is(':visible')
            && !$(this).parent().hasClass('oe-window')) {

            var marginBottom = $(this).css("marginBottom");
            var countCharWrapper = $("<div class='inputCharCountContainer'></div>");
            if($(this).css('width') != $(this).parent().css('width')){
                countCharWrapper.css('display', $(this).css('display'));
            }
            $(this).wrap(countCharWrapper);

            var countCharSpan = $('<span class="inputCharCount">Chars: 0</span>');
            if (parseInt(marginBottom) > 0){
                countCharSpan.css('margin-top', '-'+marginBottom);
            }
            $(this).after(countCharSpan);
            countCharSpan.hide();
        }
        countChar($(this));
    }).bind('keyup', function () {
        countChar($(this));
    }).bind('focus', function () {
        $(this).next('.inputCharCount').show();
    }).bind('blur', function () {
        $(this).next('.inputCharCount').hide();
    });
});
