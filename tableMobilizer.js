
/**
 * The RowBlock is the object that will hold all of the information
 */
var MobileBrokerTable = function (selector) {
    this.selector = selector
    this.head = [];
    this.data = {};
};

MobileBrokerTable.prototype.gather = function () {
    var obj = this;

    obj.element = document.getElementById(obj.selector);

    $.each($(obj.element).find('thead th'), function (i,v) {

        obj.head.push($(v).text().trim());
        // obj[i] = $(v).text().trim();
        // bodyData.head.push(obj);
    });

    var rowObj = {};
    $.each($(obj.element).find('tbody tr'), function (rIdx, rData) {

        var colObj = {};

        $.each($(rData).children(), function (cIdx, cData) {
            var varObj = {};

            varObj.content = $(cData).html().trim().replace(/\s\s+/g, ' ');
            varObj.classes = $(cData).attr('class').split(' ');

            colObj[cIdx] = varObj;
        });

        rowObj[rIdx] = colObj;

    });

    obj.data = rowObj;

    obj.construct();
};

MobileBrokerTable.prototype.construct = function () {

    var obj = this;

    var templateHead = [
        '<tr>',
            '<th colspan="2" class="mobileTable-block-header">{{value}}<th>',
        '</tr>'
    ].join("\n");

    var templateRow = [
        '<tr>',
            '<th class="{{class}} mod-mobile">{{company}}</th>',
            '<td class="{{class}} mod-mobile">{{value}}</td>',
        '</tr>'
    ].join("\n");

    $('.bcc-wrap').append('<table id="bccMobile" class="bcc mod-mobile" cellspacing="0" cellpadding="0"></table>');


    $.each(obj.data, function (rIdx, rVal) {
        var blockHtml;

        $.each(rVal, function (cIdx, cVal) {

            var template;
            var mapObj = {
               '{{class}}': cVal.classes.join(' '),
               '{{value}}': cVal.content,
               '{{company}}': obj.head[cIdx]
            };

            if (cIdx === '0') {
                template = templateHead;
            } else {
                template = templateRow;
            }

            var reg = new RegExp(Object.keys(mapObj).join("|"),"gi");

            blockHtml += template.replace(reg, function(matched){
              return mapObj[matched];
            });

        });

        $('#bccMobile').append(blockHtml);
    });


    // Append it...
};


if(isMobile() === true) {

    var brokerTable = new MobileBrokerTable('PricingDetails');

    brokerTable.gather();

    $('.bcc-desktop').hide();

}
