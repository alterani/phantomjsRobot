//"use strict";

//Istanzio oggetto page e variabile URL
var mieUtility = require('/Users/enricoalterani/github/PhantomJs_fiera/modulo_utility.js'); // da cambiare path om ambiente linux
var parametri = require('/Users/enricoalterani/github/PhantomJs_fiera/parametri.json'); // da cambiare path om ambiente linux
var system = require('system');
var page = require('webpage').create();
var page2 = require('webpage').create();
var fs = require("fs");
var fs2 = require("fs");
var url = parametri.url;
var utente = parametri.credenziali.user;
var pwd = parametri.credenziali.pwd;
var errore_gestito = false;
var step = 1;
var contatore_enrico = 0;
var path = 'localstorage/clienti.json';
var path_anag = 'localstorage/schede_clienti/anagrafiche';
var LeadArray = new Array;
var num_tentativi_prima_di_errore = 3;
var errori_consecutivi = 0;
var contatoreLead = 36898;





//import * as gestionerrore from "gestione_errore";

// Gestione evento errore

page.onResourceRequested = function (requestData, networkRequest) {
    //system.stderr.writeLine('= onResourceRequested()');
    //system.stderr.writeLine('  request: ' + JSON.stringify(requestData, undefined, 4));
    if(parametri.log_dettaglio == 1)
    {console.log('ID: ' + requestData.id + 'URL: ' + requestData.url);}
    
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
    if(parametri.log_dettaglio == 1){
      system.stderr.writeLine('= onLoadFinished()');
      system.stderr.writeLine('  status: ' + status);
    }
    //console.log('Creazione rendering in corso ....');
    
    //Carico Jquery in locale
    page.injectJs('jquery.min.js');

    if(parametri.log_dettaglio == 1){console.log('slepping...');}

    mieUtility.sleep(12000);
    if(parametri.log_dettaglio == 1){console.log('end sleep');}
    if(parametri.log_dettaglio == 1){console.log(parametri.step);}
    
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
                    if($('[href$="/portal/companySearchResults.do?CurrentPage=1&tbx_Search_Key="]').length > 0 && parametri.step == "2")
                    {
                        // find element to send click to
                        // create a mouse click event
                        //var evento = document.createEvent( 'MouseEvents' );
                        //evento.initMouseEvent( 'click', true, true, window, 1, 0, 0 );
                        // send click to element
                        //element.dispatchEvent(evento);
                    
                        if (parametri.numero_pagina_da_sfogliare < 9999)
                        {parametri.step = "4";}
                        else
                        {
                          parametri.step = "7";
                        }
                        
                        return parametri;    
                    }

                    if(parametri.step == "5"){
                      
                      if($('.form_titolo').length > 0){
                        parametri.step = "6";

                      }
                      else if(parametri.numero_pagina_da_sfogliare > 1)
                      {
                        parametri.step = "Fine";
                      }
                      else{
                        parametri.step = "4";  
                      }  
                      
                      return parametri;  
                    }


                  
                    
                    /*if($('form[name="frm_search"]').length > 0 && parametri.step == "4")
                    {
                        
                        parametri.test = "Fase 5";
                        parametri.step = "4";
                        $('form[name="frm_search"]').submit();   
                        
                    } 
                   if(parametri.test == "Fase 5" && parametri.step == "4")
                    {
                        
                        parametri.test = "Fase 6";
                        parametri.step = "6";
                           
                        
                    }*/


                }    
           }

           
           return parametri;
           
           //headercenterbottom
          
           /*if ($('#Invia').length > 0 ) {
                 $('#Invia').click();
           }*/

    }, parametri);

   /*if(parametri.step == "no"){
                      console.log("entratooooooooooooooooooooooooooooooooooooooo");
                      return parametri;  
   }*/
    

    //console.log("finale parametri.test = " + parametri.test + "STEP = " + parametri.step);
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
    
    if (errore_gestito || resourceError.errorCode == 203 || resourceError.errorCode == 301 || resourceError.errorCode == 5 ) {
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
  if(parametri.log_dettaglio == 1){
        system.stderr.writeLine('= onError()');
        var msgStack = ['  ERROR: ' + msg];
        if (trace) {
            msgStack.push('  TRACE:');
            trace.forEach(function(t) {
                msgStack.push('    -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
            });
        }
        system.stderr.writeLine(msgStack.join('\n'));
  }
};


////////////////////////////////////////////////////////////////
////////////////// M A I N /////////////////////////////////////
/////////// PUNTO DI PARTENZA //////////////////////////////////

mieUtility.log_righe_con_testo(3, 'Apertura pagina in corso ....');
page.open(url, function(status){
    if(status === "success"){ 
    	mieUtility.my_console_log(4);
    }
    else {
    	mieUtility.log_righe_con_testo(3, 'Pagina non raggiungibile!! ' + 'STATUS: ' + status );
        mieUtility.log_righe_con_testo(3, "DETTAGLIO ERRORE \"" + page.reason_url + "\": " + page.reason );
    }
});

// LOOP GENERALE DI CONTROLLO
setInterval(function(){

   if(parametri && parametri.step == "4")
   {
         
      parametri.step = "5";


     if (contatore_enrico == 0){ 
       console.log("SPEP 5 LANCIA -- SPEP 5 LANCIA -- SPEP 5 LANCIA --");   
       //page.open("http://expopage.net/portal/companySearchResults.do?CurrentPage=1&tbx_Search_Key=");
       page.open("http://expopage.net/portal/advancedSearch.do?Frame2=exhibitor_advance_search");
      
     } //end if
     if (contatore_enrico > 0  ){
      console.log("STEP 5 LANCIA CON EVALUATE -- STEP 5 LANCIA CON EVALUATE --");
        page.evaluate(function(){
          subfun();
          //checkDivVisibility("espositori");
          //search();

        }); //end page.evaluate
     }//endif

     contatore_enrico++;
   }
   
   if(parametri && parametri.step == "6"  ){

      console.log("ELABORAZIONE PAGINA NUMERO " + parametri.numero_pagina_da_sfogliare );
      
      parametri.step = 0;
      
      var arr_elenco_link = new Array();

      arr_elenco_link = page.evaluate(function(arr_elenco_link){
                        

                        if($("a[href^='/portal/stand.do?eboothid=']").length > 0 ){
                          //Scorro tutti gli attributi  
                          $("a[href^='/portal/stand.do?eboothid=']").each(function(i){
                             
                             //$(this);
                            //SE l'elemento non è già presente lo aggiunge in arrai  
                            if(arr_elenco_link.indexOf($(this).attr('href')) == -1)
                            {
                              arr_elenco_link.push($(this).attr('href'));
                            }

                          }); //Fine each

                        } //end if
                        
                        // se non ha caricato nessun link restituisco errore
                        if(arr_elenco_link.length == 0)
                        {
                            arr_elenco_link.push("errore");
                        } // end if
                        return arr_elenco_link;
                       }, arr_elenco_link); //end page.evaluate

      
      //Controllo se page.evaluate ha terminato e se ha restituito qualcosa
      if(arr_elenco_link.length > 0 && arr_elenco_link[0] != "errore" )
      {
            
            /////////////////////////////////////
            //ARCHIVIO I LINK NEL FILE IN LOCALE
            /////////////////////////////////////
            var ClientiArray = new Array;
            var codiceCliente = 0;

            if(fs.exists(path)){
              ClientiArray = JSON.parse(fs.read(path));
              codiceCliente = ClientiArray.length;
               
            }
            for (var i=0; i<arr_elenco_link.length; i++)
            {  
                    codiceCliente++;
                    var recordCliente = {"Codice_cliente": codiceCliente, "Link": arr_elenco_link[i], "Pagina": parametri.numero_pagina_da_sfogliare};
                    ClientiArray.push(recordCliente);
                    
            }
            
            //if(parametri.numero_pagina_da_sfogliare > 1377)
            //{  
                        fs.write(path, JSON.stringify(ClientiArray), 'w');
            //}else
            //{
            //  parametri.numero_pagina_da_sfogliare = 1377;
            //}
            /////////////////////////////////////
            //SFOGLIO LA PAGINA SUCCESSIVA
            /////////////////////////////////////
            parametri.numero_pagina_da_sfogliare++;
            
            if(parametri.numero_pagina_da_sfogliare < 1478)
            {       
                    parametri.step  = "5";
                    
                    parametri = page.evaluate(function(parametri){
            
                      setCurrentPage(parametri.numero_pagina_da_sfogliare.toString());

                      return parametri;
                    },parametri);
            }else{

                    console.log("Esportazione Link Terminata con successo!");
                    parametri.step  = "Fine";
            }


      } else if (arr_elenco_link.length > 0 && arr_elenco_link[0] == "errore") // gestione errore
      {

        console.log("Errore su step 6 durante la lettura dei link!");
        parametri.step  = "Fine";
      }
    
    }
    
    ////////////////////////////////////////////////////
    ///INIZIO FASE 2 CERCO CONTATTI E SCRIVO IN DATABASE
    ////////////////////////////////////////////////////


    if(parametri && parametri.step == "7"  )
    {
       parametri.step = "no";
       //Se l'array non è ancora stato caricato lo carico in memoria
       if (LeadArray.length == 0){
          LeadArray = JSON.parse(fs.read(path));
       }
       
       if(contatoreLead < LeadArray.length){
         var url2 = 'http://www.expopage.net' + LeadArray[contatoreLead].Link;
         

         //console.log("Sto aprendo ... "+url2);
         //page.includeJs("https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js");
         page.open(url2, function(status){
              if(status === "success"){ 
                //console.log("Aperta Pagina : " + url2);
                errori_consecutivi = 0;

                //Appena Caricata la pagina faccio evaluate
                var elemento = LeadArray[contatoreLead]; 
                elemento = page.evaluate(function(elemento)
                    {
            
                      // inizio codice evaluate dati
                      //Nome Azienda
                      if($("div.boxleftcontent").children("div.boxleftcontent61").first().children("span.tit_04_nero").children("h1").length > 0)
                      {
                         elemento.nomeazienda = $("div.boxleftcontent").children("div.boxleftcontent61").first().children("span.tit_04_nero").children("h1").html();
                      }

                      //Carico Citta
                      if($( "td:contains('Citt')").filter("td[bgcolor='#ebebeb']").filter(".testo_bold_11").next("td").length > 0)
                      {
                        elemento.citta = $( "td:contains('Citt')").filter("td[bgcolor='#ebebeb']").filter(".testo_bold_11").next("td").html();
                      }
                      //Carico Indirizzo
                      if($( "td:contains('Indirizzo')").filter("td[bgcolor='#ebebeb']").filter(".testo_bold_11").next("td").children("a").first().length > 0)
                      {
                        elemento.indirizzo = $( "td:contains('Indirizzo')").filter("td[bgcolor='#ebebeb']").filter(".testo_bold_11").next("td").children("a").first().html();
                      }
                      //Carico Telefono:
                      if($( "td:contains('Telefono')").filter("td[bgcolor='#ebebeb']").filter(".testo_bold_11").next("td").length > 0)
                      {
                        elemento.telefono = $( "td:contains('Telefono')").filter("td[bgcolor='#ebebeb']").filter(".testo_bold_11").next("td").html();
                      }
                      //Carico Fax:
                      if($( "td:contains('Fax')").filter("td[bgcolor='#ebebeb']").filter(".testo_bold_11").next("td").length > 0)
                      {
                        elemento.fax = $( "td:contains('Fax')").filter("td[bgcolor='#ebebeb']").filter(".testo_bold_11").next("td").html();
                      }  
                      //Carico Fax:
                      if($( "td:contains('Sito web')").filter("td[bgcolor='#ebebeb']").filter(".testo_bold_11").next("td").children("a").first().length > 0)
                      {
                        elemento.sitoweb = $( "td:contains('Sito web')").filter("td[bgcolor='#ebebeb']").filter(".testo_bold_11").next("td").children("a").first().html();
                      }
                      //Carico Mail:
                      if($( "td:contains('Mail')").filter("td[bgcolor='#FABA00']").filter(".testo_bold_11").next("td").children("a").first().length > 0)
                      {
                        elemento.mail = $( "td:contains('Mail')").filter("td[bgcolor='#FABA00']").filter(".testo_bold_11").next("td").children("a").first().html();
                      }
                      //Carico Nome Fiera:
                      if($( "td:contains('Espositore di')").filter("td.tit_02_arancio").next("td").children("a").first().length > 0)
                      {
                        elemento.fiera = $( "td:contains('Espositore di')").filter("td.tit_02_arancio").next("td").children("a").first().html();
                      }
                      // Coordinate Stand
                      if($( "td:contains('Posizione stand')").filter("td.tit_02_arancio").next("td").children("a").first().length > 0)
                      {
                        elemento.padiglione = $( "td:contains('Posizione stand')").filter("td.tit_02_arancio").next("td").children("a").first().html();
                      }
                      // Salone
                      if($( "td:contains('Salone')").filter("td.tit_02_arancio").next("td").children("a").first().length > 0)
                      {
                        elemento.salone = $( "td:contains('Salone')").filter("td.tit_02_arancio").next("td").children("a").first().html();
                      }

                      elemento.caricato = true;
                      return elemento;
                    },elemento); //end evaluate
                LeadArray[contatoreLead] = elemento;
                

                //CICLO setInterval che attende risposta di evaluate
                setInterval(function(){
                  if(LeadArray[contatoreLead].caricato == true && LeadArray[contatoreLead].stato != "Inserito" && LeadArray[contatoreLead].stato != "In lavorazione" && LeadArray[contatoreLead].stato != "Errore Database" ){
                      
                      LeadArray[contatoreLead].stato = "In lavorazione";

                      /*var pagepost = require('webpage').create(),
                      server = 'http://localhost:27080/lead_db/contatti/_insert';
                      var data = 'docs=['+ JSON.stringify(LeadArray[contatoreLead]) +']';  

                      pagepost.open(server, 'post', data, function (status) {
                        if (status == 'success') {
                            
                            LeadArray[contatoreLead].stato = "Inserito";
                            
                        }else
                        {
                          
                          LeadArray[contatoreLead].stato = "Errore Database";
                        }
                      }); //end pagepost.open
                      */

                      // SCRIVO IN UN FILE JSON IN MODALITA APPEND. OGNI 1000 RECORD GENERO UN NUOVO FILE
                      fs2.touch(path_anag + Math.ceil(contatoreLead / 1000).toString() + ".json");
                      fs2.write(path_anag + Math.ceil(contatoreLead / 1000).toString() + ".json", JSON.stringify(LeadArray[contatoreLead]) + ',', 'a');
                      LeadArray[contatoreLead].stato = "Inserito";
                      
                  

                  }
                  if(LeadArray[contatoreLead].stato == "Inserito" || LeadArray[contatoreLead].stato == "Errore Database")
                  {
                      if(LeadArray[contatoreLead].stato == "Inserito")
                      {

                              //inizio codice chiamata post
                          console.log("");
                          console.log("-------------------------------");
                          console.log("       SCHEDA AZIENDA " + contatoreLead);
                          console.log("-------------------------------");
                          console.log("");
                          console.log("Nome Azienda  = " + LeadArray[contatoreLead].nomeazienda);
                          console.log("Citta         = " + LeadArray[contatoreLead].citta);
                          console.log("Indirizzo     = " + LeadArray[contatoreLead].indirizzo);
                          console.log("Telefono      = " + LeadArray[contatoreLead].telefono);
                          console.log("Fax           = " + LeadArray[contatoreLead].fax);  
                          console.log("Sito Web      = " + LeadArray[contatoreLead].sitoweb);
                          console.log("Mail          = " + LeadArray[contatoreLead].mail);
                          console.log("Fiera         = " + LeadArray[contatoreLead].fiera);
                          console.log("Padiglione    = " + LeadArray[contatoreLead].padiglione);
                          console.log("Salone        = " + LeadArray[contatoreLead].salone);
                          console.log("Link Espopage = " + 'http://www.expopage.net' + LeadArray[contatoreLead].Link);


                          //Riparte il ciclo principale
                          contatoreLead++;
                          parametri.step = 7;
                          clearInterval();
                      }else
                      {

                          console.log("");
                          console.log("ERRORE CHIAMATA SERVIZIO API :");
                          console.log("");
                          console.log(JSON.stringify(LeadArray[contatoreLead]));
                          parametri.step = "Fine";
                          clearInterval();
                      }


                  }

                },250); //END setInterval

               
                
              } // FINE if(status === "success")
              else 
              {
                
                if(errori_consecutivi <= num_tentativi_prima_di_errore )
                {
                    
                    window.setTimeout(function () 
                    {
                    
                      errori_consecutivi++;
                      parametri.step = 7;
                    
                    }, 3000);
                    
                }else
                {
                  console.log("ERRORE CARICAMENTO URL :" + url2);
                  console.log("");
                  parametri.step = "Fine";  
                }
                
                  
              }
        }); // fine page2.open(url, function(status)
       } // if (contatoreLead < LeadArray.length)
       else
       {
        console.log("ANAGRAFICHE LEAD CARICATE CON SUCCESSO");
        parametri.step = "Fine";
       }
    } //END IF (parametri && parametri.step == "7"  )
    

    

 
   
   //////////////////////////////////////////////////////
   //////// STEP FINALE ////////////////////////////////
   /////////////////////////////////////////////////////
   if(parametri && (parametri.step == "8" || parametri.step == "Fine") ){
        
        page.render('printscreen.png');
        console.log('Creato file printscreen.png');
        
        console.log("finale parametri.test = " + parametri.test);
        mieUtility.log_righe_con_testo(3, 'FINE ESECUZIONE!!' );
        mieUtility.my_console_log(2);
        window.setTimeout(function () {
        console.log(page.frameUrl); //check url after click
        }, 3000);

        clearInterval();
        phantom.exit();

   }//end if 

}, 250);//fine setInterval




