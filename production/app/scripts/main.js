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

	//private vars & methods
	var $container;

	function draw() {
		$container.html("TRANSACTIONS.display");
	}

	//public interface
	return {
		init: function(element){
			$container = element;
			draw();
		}
	}
}());

$(function(){	
	$.getJSON("qif.json", function(data){
		TRANSACTIONS.model.init();
		TRANSACTIONS.model.setRecords(data.records);
		TRANSACTIONS.ui.init($('#transactions'));
	});
});