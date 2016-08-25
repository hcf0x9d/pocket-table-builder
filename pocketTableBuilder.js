(function ($) {

    $.fn.pocketTableBuilder = function (options) {

        // Prepare to add some settings, right now there are none.
        var settings = $.extend({
            }, options);

            /**
             * The Mobile Table Constructor
             *
             * @param {String} selector - ID name for the table to mobilize
             */
            var MobileTable = function (selector) {
                this.selector = selector;   // Selector attribute TODO: Probably don't need this now
                this.head = [];             // Array of values in the header row of the table
                this.data = {};             // Object housing all of the data within the table
            };

            /**
             * First, gather all of the data from the existing table.
             *
             * After the content has been gathered and added to the Object, then we need
             * to run the table constructor (to build the mobile version of the table)
             */
            MobileTable.prototype.gather = function () {
                'use strict';

                var obj = this;

                // Add the element to the Object for reference later
                obj.element = document.getElementById(obj.selector);

                // For each of the <th> elements within the <thead>...
                // Return the index (column number) and value (text)
                $.each($(obj.element).find('thead th'), function (i,v) {

                    // Push the text of this <th> to the MobileTable.head array. We add trim
                    // to remove the unneccessary white space on the ends of the string
                    obj.head.push($(v).text().trim());
                });

                // Temporarily build a row and column object that we can discard later
                var rowObj = {},
                    colObj = {},
                    varObj = {};

                // For each of the <tr> elements in the <tbody>...
                // Return the row index (row number) and row data (cells)
                $.each($(obj.element).find('tbody tr'), function (rIdx, rData) {

                    // Clear the column object
                    colObj = {};

                    // For each of the cells, get the cell index and cell contents
                    $.each($(rData).children(), function (cIdx, cData) {

                        // Clear the variable object
                        varObj = {};

                        // Add a node to the varObj for the content and push the <td>
                        // contents trimming whitespace from the ends and replacing all other
                        // spaces with a single space.
                        varObj.content = $(cData).html().trim().replace(/\s\s+/g, ' ');

                        // Add a node to the varObj to hold all of the classes for this cell.
                        // We take the class attribute and split it into an array on the spaces
                        varObj.classes = $(cData).attr('class').split(' ');

                        // Add an object to the column object with this columns's index
                        colObj[cIdx] = varObj;
                    });

                    // Add the column object to the row object with this row's index
                    rowObj[rIdx] = colObj;
                });

                // Store the row object in the MobileTable.data object
                obj.data = rowObj;

                // Run the mobile table constructor (bad name choice probably)
                obj.construct();
            };


            /**
             * Build the mobile version of the table
             */
            MobileTable.prototype.construct = function () {
                'use strict';

                var obj = this;

                // The table is broken up into blocks, with the desktop table's first column
                // acting as a mini table head.  Below is the template for this set of elements,
                // using a handlebars style approach to data management.
                var templateHead = [
                    '<tr>',
                        '<th colspan="2" class="mobileTable-block-header">{{value}}<th>',
                    '</tr>'
                ].join("\n");

                // The templateRow template is for each of the data rows, as above it uses
                // a handlebars style data merge syntax.
                var templateRow = [
                    '<tr>',
                        '<th class="{{class}} mod-mobile">{{company}}</th>',
                        '<td class="{{class}} mod-mobile">{{value}}</td>',
                    '</tr>'
                ].join("\n");

                // Find the original table's parent and append a new table to it.  This is
                // what we will turn into our mobile table.
                $('#' + obj.selector).parent().append('<table id="bccMobile" class="bcc mod-mobile" cellspacing="0" cellpadding="0"></table>');

                // Iterate through the MobileTable object's data, returning a row index and
                // row contents
                $.each(obj.data, function (rIdx, rVal) {

                    // Prep the blockHtml variable - we will use this for appending content
                    var blockHtml;

                    // Iterate through the row's contents (a bunch of columns will be returned)
                    // Column index and column values are what we get
                    $.each(rVal, function (cIdx, cVal) {

                        // Prep the template variable and create an object for mapping
                        // the content.  This object will need to be dynamically generated
                        // somehow or switch to an index approach or something.
                        // TODO: Make the mapObj less specific
                        var template = templateRow;
                        var mapObj = {
                           '{{class}}': cVal.classes.join(' '),
                           '{{value}}': cVal.content,
                           '{{company}}': obj.head[cIdx]
                        };

                        // If the column index is zero, then we are dealing with the first
                        // column which turns into the block header, set the template to the
                        // header template and move on.  Otherwise, default to the row template
                        if (cIdx === '0') {
                            template = templateHead;
                        }

                        // Regex Variable.  This is how we will find our replacements
                        var reg = new RegExp(Object.keys(mapObj).join("|"),"gi");

                        // Add the template contents, replacing the handlebar content with
                        // its matched variable before doing so.
                        blockHtml += template.replace(reg, function(matched){
                          return mapObj[matched];
                        });

                    });

                    // Append the html to the template added earlier.
                    // TODO: Make this more obfuscated
                    $('#bccMobile').append(blockHtml);
                });

                // Hide the original table - the desktop version.
                $('#' + obj.selector).hide();
            };

            /**
             * Is this a mobile device?
             *
             * @return {Boolean} :: Either it is or it isn't.
             */
            MobileTable.prototype.mobileTest = function () {
                'use strict';

                // device detection
                if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
                    return true;
                } else {
                    return false;
                }
            };


            // If we are dealing with a mobile experience, start the table builder.
            if(MobileTable.prototype.mobileTest() === true) {

                // Create a new instance of the broker table object
                var brokerTable = new MobileTable(this[0].id);

                // Gather the data, then build a table
                brokerTable.gather();
            }
    };
}(jQuery));
