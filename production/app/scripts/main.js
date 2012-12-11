var TRANSACTIONS = TRANSACTIONS || {};

/*
TRANSACTIONS.model handles the data
*/
TRANSACTIONS.model = (function () {
    'use strict';

    // [ private properties ]
    // note the chaining of var declarations vs a var on each line
    var records; //array of records
    // end var

    // [ private methods ]
    function getRecords() {
    	return records;
    }
    function setRecords(data) {
    	records = data;
    }

    // [ public methods ]
    return {
        init: function () {
        },
        getRecords: getRecords,
        setRecords: setRecords
    };
}());
/*
TRANSACTIONS.ui handles the ui display
*/
TRANSACTIONS.ui = (function() {
	'use strict';

    // [ private properties ]
	var containerId, $container;

    // [ private methods ]
	function draw() {
		var records = TRANSACTIONS.model.getRecords(),
			record,
			i;
		//@TODO remove existing ul.records
		$container.html('<ul class="records"></ul>');
		for(i=0;i<records.length;i++) {
			$('#' + containerId + ' ul.records').append( getRecordHtml(records[i]) );
		}
	}

	function getRecordHtml(record) {
		//date,amount,payee,category
		var html = '<li>';
		html += '<a class="save-button" href="#">[save]</a>';
		html += '<input type="text" size="11" maxlength="10" name="date" value="' + record.date + '" />';
		html += '<input type="text" size="50" maxlength="255" name="payee" value="' + record.payee + '" />';
		html += '<input type="number" size="11" maxlength="12" name="amount" value="' + record.amount + '" />';
		html += '<input type="text" size="30" maxlength="64" name="category" data-id="category id" value="' + record.category + '" />';
		html += '</li>';
		return html;
	}

    // [ public methods ]
	return {
		init: function(elementId){
			containerId = elementId;
			$container = $('#' + containerId);
			draw();
		},
	};
}());

$(function(){	
	$.getJSON("qif.json", function(data){
		TRANSACTIONS.model.init();
		TRANSACTIONS.model.setRecords(data.records);
		TRANSACTIONS.ui.init('transactions');
	});
});