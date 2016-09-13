//"use strict";

//Istanzio oggetto page e variabile URL
var mieUtility = require('/Users/enricoalterani/github/PhantomJs_fiera/modulo_utility.js'); // da cambiare path om ambiente linux
var parametri = require('/Users/enricoalterani/github/PhantomJs_fiera/parametri.json'); // da cambiare path om ambiente linux
var system = require('system');
var page = require('webpage').create();
var url = parametri.url;
var utente = parametri.credenziali.user;
var pwd = parametri.credenziali.pwd;
var errore_gestito = false;
var step = 1;

//import * as gestionerrore from "gestione_errore";

// Gestione evento errore

page.onResourceRequested = function (requestData, networkRequest) {
    //system.stderr.writeLine('= onResourceRequested()');
    //system.stderr.writeLine('  request: ' + JSON.stringify(requestData, undefined, 4));
    console.log('ID: ' + requestData.id + 'URL: ' + requestData.url);
    
    //controllo se l'url è nell'elenco dei no load configurati nel file json
    var match = null;
    var i = 0;
    while(i < parametri.Url_no_load.length && match == null ){
        match = requestData.url.match(parametri.Url_no_load[i]);
        i++;
    }
    if (match != null) {
        //console.log(requestData.url);
        //console.log('Request (#' + requestData.id + '): ' + JSON.stringify(requestData));
        errore_gestito = true;
        networkRequest.abort(); 
    }
    
};

/*page.onResourceReceived = function(response) {
    system.stderr.writeLine('= onResourceReceived()' );
    system.stderr.writeLine('  id: ' + response.id + ', stage: "' + response.stage + '", response: ' + JSON.stringify(response));
};*/

/*page.onLoadStarted = function() {
    system.stderr.writeLine('= onLoadStarted()');
    var currentUrl = page.evaluate(function() {
        return window.location.href;
    });
    system.stderr.writeLine('  leaving url: ' + currentUrl);
};
 */
page.onLoadFinished = function(status) {
    
    system.stderr.writeLine('= onLoadFinished()');
    system.stderr.writeLine('  status: ' + status);
    console.log('Creazione rendering in corso ....');
    
    //Carico Jquery in locale
    page.injectJs('jquery.min.js');

    console.log('slepping...');
    mieUtility.sleep(12000);
    console.log('end sleep');

    
   parametri = page.evaluate(function(parametri){
            
            
           if ($('#username').length > 0 ) {
                 $('#username').val(parametri.credenziali.user);
                 if ($('#password').length > 0 ) {
                    $('#password').val(parametri.credenziali.pwd);
                    if ($('form[name="homesiteccontrol"]').length > 0 ){
                       $('form[name="homesiteccontrol"]').submit();
                    }
                }
           }
           else
           {
                //Se risulta loggato
                if($("a[href$='logout.do']").length > 0  )
                {
                    
                    //Step 2 clicca sul tasto di ricerca generico
                    if($('form[name="frm_search_calendario"]').length > 0 && parametri.step == "1")
                    {
                        parametri.step = "2"
                        $('form[name="frm_search_calendario"]').submit(); 
                         return parametri;  
                    }
                    //Step3 clicca su tutte le aziende
                    if($('a[href$="/portal/companySearchResults.do?CurrentPage=1&tbx_Search_Key="]').length > 0 && parametri.step == "2")
                    {
                        parametri.step = "3"
                        $('a[href$="/portal/companySearchResults.do?CurrentPage=1&tbx_Search_Key="]').submit();
                        return parametri;    
                    }

                    if(parametri.step == "3")
                    {
                        parametri.test = "Fase 4  ";
                    } 
                   
                }    
           }

           
           return parametri;
           
           //headercenterbottom
          
           /*if ($('#Invia').length > 0 ) {
                 $('#Invia').click();
           }*/

    }, parametri);

    
    page.render('printscreen.png');

    console.log('Creato file printscreen.png');

    console.log("finale parametri.test = " + parametri.test + "STEP = " + parametri.step);
    //phantom.exit();
};

/*page.onNavigationRequested = function(url, type, willNavigate, main) {
    system.stderr.writeLine('= onNavigationRequested');
    system.stderr.writeLine('  destination_url: ' + url);
    system.stderr.writeLine('  type (cause): ' + type);
    system.stderr.writeLine('  will navigate: ' + willNavigate);
    system.stderr.writeLine('  from page\'s main frame: ' + main);
};*/

page.onResourceError = function(resourceError) {
    
    if (errore_gestito || resourceError.errorCode == 203 || resourceError.errorCode == 5 ) {
        errore_gestito = false;
    }else{
        page.reason = resourceError.errorString;
        page.reason_url = resourceError.url;
        system.stderr.writeLine('= onResourceError()');
        system.stderr.writeLine('  - unable to load url: "' + resourceError.url + '"');
        system.stderr.writeLine('  - error code: ' + resourceError.errorCode + ', description: ' + resourceError.errorString );
    
        phantom.exit();    
    }
    
};
 
page.onError = function(msg, trace) {
    system.stderr.writeLine('= onError()');
    var msgStack = ['  ERROR: ' + msg];
    if (trace) {
        msgStack.push('  TRACE:');
        trace.forEach(function(t) {
            msgStack.push('    -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
        });
    }
    system.stderr.writeLine(msgStack.join('\n'));
};

mieUtility.log_righe_con_testo(3, 'Apertura pagina in corso ....');
page.open(url, function(status){

if(status === "success"){ 
	mieUtility.my_console_log(4);
}else {
	mieUtility.log_righe_con_testo(3, 'Pagina non raggiungibile!! ' + 'STATUS: ' + status );
    mieUtility.log_righe_con_testo(3, "DETTAGLIO ERRORE \"" + page.reason_url + "\": " + page.reason );

}


console.log("finale parametri.test = " + parametri.test);
mieUtility.log_righe_con_testo(3, 'FINE ESECUZIONE!!' );
mieUtility.my_console_log(2);
});

