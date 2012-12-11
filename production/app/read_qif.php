<?php

//Set input file
$file = 'test.qif';
//Read file into array
$lines = file($file);

//Set variables for processing loop
$type = false;
$insert_records = array();
$record = array();

//Process the data
foreach($lines as $line) {

    if($line=="^\n") {
    	//print_r($record);
    	$record = array();	
    } elseif(preg_match("#^!Type:(.*)$#", $line, $match)) {
        $type = mysql_real_escape_string(trim($match[1]));
        $record = array();
        
    } else {
        switch(substr($line, 0, 1))
        {
            case 'D':
                $record['date']   = mysql_real_escape_string(trim(substr($line, 1)));
                break;
            case 'M':
            	$record['category'] = mysql_real_escape_string(trim(substr($line, 1)));
            	break;
            case 'T':
                $record['amount'] = mysql_real_escape_string(trim(substr($line, 1)));
                break;
            case 'P':
                $record['payee']  = mysql_real_escape_string(trim(substr($line, 1)));
                break;
        }
    }

    //if(count($record)==3 && $type!==false) {
    if (count($record)==4 && $type!==false) {
        array_push($insert_records, $record);
        $record = array();
    }

}

function fixPayee($original) {
	/*
	return the corrected payee name via a lookup
	*/
	$payees = array(
		"CITIMORTGAGE" => array("name"=>"CitiMortgage","category"=>"Mortgage","type"=>"e"),
		"DE23 CREATIVE" => array("name"=>"Creative Circus Salary","category"=>"Salary","type"=>"i"),
		"MAC\'S BEER" => array("name"=>"Mac's Beer and Wine","category"=>"Alcohol/Liquor","type"=>"e"),
		"ATM SURCHARGE REBATE" => array("name"=>"ATM Fee Rebate","category"=>"Bank Rebate","type"=>"i"),
		"COMCAST" => array("name"=>"Comcast","category"=>"Utilities - Broadband","type"=>"e"),
		"MINI FINANCIAL" => array("name"=>"MINI Financial","category"=>"Auto - Financing","type"=>"e"),
		"GEORGIA NAT GAS" => array("name"=>"Georgia Natural Gas","category"=>"Utilities - Gas","type"=>"e"),
		"GEORGIA POWER" => array("name"=>"Georgia Power","category"=>"Utilities - Electricity","type"=>"e"),
		"USAA P&C" => array("name"=>"USAA Insurance","category"=>"Insurance - Home/Auto","type"=>"e"),
		"SOTTO SOTTO" => array("name"=>"Sotto Sotto","category"=>"Dining","type"=>"e"),
		"FRITTI" => array("name"=>"Fritti","category"=>"Dining","type"=>"e"),
		"YOUR DEKALB FAR" => array("name"=>"Dekalb Farmer's Market","category"=>"Groceries","type"=>"e"),
		"USAA.COM PAYMNT  CREDIT CRD" => array("name"=>"USAA Credit Card","category"=>"Credit Card Payment","type"=>"e"),
		"@DECATUR DRIVE-IN@DECATUR" => array("name"=>"Cash","category"=>"ATM","type"=>"e"),
		"M ARTHUR GENSLER DIRECT DEP" => array("name"=>"Gensler Salary","category"=>"Salary","type"=>"e"),
		"SY8 GREEN" => array("name"=>"Green's Liquors","category"=>"Alcohol/Liquor","type"=>"e"),
		"MIDTOWN-FINAN" => array("name"=>"Cash","category"=>"ATM","type"=>"e"),
		"GENSLER          PAYROLL" => array("name"=>"Gensler Salary","category"=>"Salary","type"=>"e"),
		"737 PONCE DE LEON AVE" => array("name"=>"Green's Liquors","category"=>"Dining","type"=>"e"),
		"3000 E PONCE DE LEON" => array("name"=>"Dekalb Farmer's Market","category"=>"Groceries","type"=>"e"),
		"INTEREST PAID" => array("name"=>"Interest Earned","category"=>"Interest Earned","type"=>"e"),
		"M Arthur Gensler Employee" => array("name"=>"Gensler Expense Payback","category"=>"Expense Reimbursement","type"=>"i")
	);
	
	foreach($payees as $key => $value) {
		if (substr_count($original, $key)>0) return $value["name"];
	}
	
	return $original;
}


$json = '{"records":[';
for($i=0; $i<count($insert_records); $i++) {
	$rec = $insert_records[$i];
	$json .= '{"date":"' . $rec['date'] . '",';
	$json .= '"amount":"' . $rec['amount'] . '",';
	$json .= '"payee":"' . fixPayee($rec['payee']) . '",';
	$json .= '"category":"' . $rec['category'] . '"}';
	if ($i<count($insert_records)-1) $json .= ',';
}
$json .= ']}';

echo $json;
?>