//modulo_utility

var my_console_log = function(argomento) { 
	
	for (var i = argomento - 1; i >= 0; i--) {
		
		console.log('');
	}
 
};

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

var log_righe_con_testo = function(argomento, testo) { 
	
	for (var i = argomento - 1; i >= 0; i--) {
		
		console.log('');
	}
	console.log(testo);
 
};


exports.my_console_log = my_console_log;
exports.log_righe_con_testo = log_righe_con_testo;
exports.sleep = sleep;