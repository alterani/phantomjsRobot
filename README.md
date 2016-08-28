#PHANTOMJS SCRIPT

***********************************************
# FUNZIONALITA'  
***********************************************

Nuaviga verso l'url di destinazione -->   DONE

Compila i campi del form ed effettua la login -->  DONE

Effettua una ricerca dalla form di ricerca --> TODO

Legge i dati risultanti dalla ricerca, scorre le pagine, archivia i dati in un database  --> TODO



**************************************************
# PREREQUISITI   
**************************************************
- Rischiede installazione di nodejs e phantomjs



**************************************************
# NOTE   
**************************************************

- I parametri url, user, password etc.. vengono passati attraverso il file parametri.json

- ***IMPORTANTE: rinominare il file es_parametri.json in parametri.json  e inserire i valori.

- I parametri setting di phantomjs sono nel file config.json per ulteriori informazioni: http://phantomjs.org/api/command-line.html


*************************************
#COMANDO DI ESECUZIONE COME SI ESEGUE
************************************

phantomjs --config=config.json fiera.js

************************************


*************************************
#DESCRIZIONE FILE PARAMETRI.JSON
************************************
url = è l'url iniziale da cui parte lo script

credenziali.user = username che verrà iserita nella form

credenziali.pwd = password che verrà iserita nella form.

Url_no_load = Array di valori per escludere il caricamento durante httprequest.
				per esludere un url basta undicare una parola in esso contenuto:
				es: se volessimo escludere questo url "www.iosonounindirizzo/articoli/comptuter.html" basta
				inserire la parola "ndirizzo/artic" oppure "tuter.html".

************************************





