#PHANTOMJS SCRIPT

***********************************************
## FUNZIONALITA'  
***********************************************

Naviga verso l'url di destinazione -->   DONE

Compila i campi del form ed effettua la login -->  DONE

Effettua una ricerca dalla form di ricerca --> TODO

Legge i dati risultanti dalla ricerca, scorre le pagine, archivia i dati in un database  --> TODO



**************************************************
## PREREQUISITI   
**************************************************
- Richiede installazione di nodejs e phantomjs



**************************************************
## NOTE   
**************************************************

- I parametri url, user, password etc.. vengono passati attraverso il file parametri.json

- <b>***IMPORTANTE: rinominare il file es_parametri.json in parametri.json  e inserire i valori.</b>

- I parametri setting di phantomjs sono nel file config.json per ulteriori informazioni: http://phantomjs.org/api/command-line.html


*************************************
##COMANDO DI ESECUZIONE
************************************
Per eseguire l'applicazione digitare:

<pre><code>phantomjs --config=config.json fiera.js
</code></pre>


************************************


*************************************
##DESCRIZIONE FILE PARAMETRI.JSON
************************************
<b>url</b> = è l'url iniziale da cui parte lo script

<b>credenziali.user</b> = username che verrà iserita nella form

<b>credenziali.pwd</b> = password che verrà iserita nella form.

<b>Url_no_load</b> = Array di valori per escludere il caricamento durante httprequest.
				per esludere un url basta undicare una parola in esso contenuto:
				es: se volessimo escludere questo url "www.iosonounindirizzo/articoli/comptuter.html" basta
				inserire la parola "ndirizzo/artic" oppure "tuter.html".

************************************





