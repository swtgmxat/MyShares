var Cash = 0;
var CashInput = 0;
var isinliste = [];
var d = new Date();
var aktjahr = d.getFullYear();


// Bestand in Euro div id="summary-table"
$(document).ready(function () {
    $("#summary-table").bind("click",
        function showCash() {
            chrome.storage.local.get(null, function (all) {

                // filtere Steuersatz heraus = filteredAry
                var allKeys = Object.keys(all);
                console.log(allKeys, typeof allKeys);
                var filteredTransList = allKeys.filter(function (e) {
                    return e !== 'Steuersatz'
                });
                console.log(filteredTransList, typeof filteredTransList);
                chrome.storage.local.get(filteredTransList, function (all) {
                    //console.log(all);
                    //das sind jetzt die Trans-keys zum auslesen
                    var translist = Object.keys(all).map(function (key) {
                        return all[key];
                    });
                    console.log(translist, typeof translist);
                    //Sorter nach Datum
                    translist.sort(function (a, b) {
                        var a2 = a[1], b2 = b[1];
                        if (a2 == b2) return 0;
                        return a2 > b2 ? 2 : -1;
                    });

                    console.log(translist, typeof translist);
                    var lengthtranslist = translist.length;
                    console.log(lengthtranslist);

                    datumausdb = null;
                    transausdb = null;
                    Kauf = null;
                    Verkauf = null;
                    Eingang = null;
                    Ausgang = null;
                    Dividende = null;
                    Gebuehr = null;
                    Steuern = null;
                    GV = null;
                    Aktienwert = null;
                    Cash = null;
                    WertDivi = null;
                    for (var i = 0; i < lengthtranslist; i++) {
                        transausdb = translist[i];
                        transidausdb = transausdb[0];
                        datumausdb = transausdb[1];
                        transtypausdb = transausdb[2];
                        isinausdb = transausdb[3];
                        nameausdb = transausdb[4];
                        stkausdb = transausdb[5];
                        kursausdb = transausdb[6];
                        gebuehrenausdb = transausdb[7];
                        steuernausdb = transausdb[8];
                        gvausdb = transausdb[9];
                        zustandausdb = transausdb[10];
                        Wert = (stkausdb * kursausdb);//.toLocaleString('de');
                        Wertgebuehren = 1 * gebuehrenausdb;
                        Wertsteuern = 1 * steuernausdb;
                        WertGV = 1 * gvausdb;
                        WertDivi = 1 * stkausdb;


                        //Eingänge
                        if (transtypausdb == "Eingang") {
                            Eingang += Wert;
                        }
                        //Ausgänge
                        if (transtypausdb == "Ausgang") {
                            Ausgang += Wert;
                        }
                        //Käufe
                        if (transtypausdb == "Kauf") {
                            Kauf += Wert;
                        }
                        //Verkäufe
                        if (transtypausdb == "Verkauf") {
                            Verkauf += Wert;
                        }
                        //Dividende
                        //Dividende = 0;
                        if (transtypausdb == "Dividende") {
                            Dividende += WertDivi;
                            console.log(Dividende);

                        }

                        //Gebühren
                        Gebuehr += Wertgebuehren;
                        //Steuern
                        Steuern += Wertsteuern;
                        //GewinnVerlust
                        GV += WertGV;
                        // Verfügbare Cash
                    }
                    GV += Dividende;
                    GV = Math.round(GV - Gebuehr);

                    Cash = Math.round(Eingang - Ausgang - Kauf + Verkauf - Gebuehr - Steuern + Dividende);
                    CashInput = Math.round(Eingang - Ausgang);
                    var summarytable = '<tr><th>Info</th><th>Cash-Input</th><th>Cash-free</th><th>Gew.Netto</th><th>Gebühren</th><th>Steuern</th></tr>';
                    summarytable += "<tr><td>Konto-Status</td><td>" + CashInput.toLocaleString('de') + "</td><td>" + Cash.toLocaleString('de') + "</td><td>" + GV.toLocaleString('de') + "</td><td>" + Gebuehr.toLocaleString('de') + "</td><td>" + Steuern.toLocaleString('de') + "</td></tr>";
                    window.document.getElementById('summarytable').innerHTML = summarytable;

                });
            });

        });
});


//Bestand aktive Wertpapiere gesamt für alle Jahre <div id="stock-table">
$(document).ready(function () {
    $("#stock-table").bind("click",
        function showstocktablefull() {
            var isinlisteunique = [];
            chrome.storage.local.get(null, function (all) {


                // filtere Steuersatz heraus = filteredAry
                var allKeys = Object.keys(all);
                console.log(allKeys, typeof allKeys);
                var filteredTransList = allKeys.filter(function (e) {
                    return e !== 'Steuersatz'
                });
                console.log(filteredTransList, typeof filteredTransList);
                chrome.storage.local.get(filteredTransList, function (all) {
                    //console.log(all);
                    //das sind jetzt die Trans-keys zum auslesen

                    //console.log(all);
                    //alle transaktionen in translist sortiert nach Datum
                    var translist = Object.keys(all).map(function (key) {
                        return all[key];
                    });
                    var stocktablebestand = "<tr><th>Isin</th><th>Name</th><th>Stk</th><th>Kurs</th><th>Bestands-Wert</th><th>Dividenden</th><th>Gewinn/Verlust</th><th>Gebühren</th><th>Steuern</th></tr>";
                    //Sorter nach Datum
                    translist.sort(function (a, b) {
                        var a2 = a[1], b2 = b[1];
                        if (a2 == b2) return 0;
                        return a2 > b2 ? 2 : -1;
                    });
                    //Isinliste unique
                    translist.forEach(function (isi) {
                        var isinnr = isi[3];
                        isinliste.push(isinnr);
                        //isinliste leere werte entfernen
                        isinliste = jQuery.grep(isinliste, function (n) {
                            return (n);
                        });
                        //isinliste unique machen
                        $.each(isinliste,
                            function (i, e) {
                                if ($.inArray(e, isinlisteunique) === -1) isinlisteunique.push(e);
                            });
                        //isinlisteunique;

                    });
                    console.log(isinlisteunique);
                    //console.log(isinliste);
                    //console.log(typeof isinliste);


                    for (var i in isinlisteunique) {
                        var isin4calc = isinlisteunique[i];
                        var aktstkkauf = 0;
                        var aktstkverkauf = 0;
                        var aktwertkauf = 0;
                        var aktwertverkaufaktkurs = 0;
                        var aktstk = 0;
                        var aktkurs = 0;
                        var diviwert = 0;
                        var sumgv = 0;
                        var sumgebuehren = 0;
                        var sumsteuern = 0;
                        //console.log(isin4calc);
                        //console.log(isinliste[i]);

                        for (var x in translist) {
                            var transausdb = translist[x];
                            var isinausdb = transausdb[3];
                            if (isin4calc == isinausdb) {
                                //console.log("Isin4calc " + isin4calc + "isnausdb " + isinausdb);

                                //aktuelle Stuecke und Kursbestimmung
                                //value 4 = kurs, value 5 = stk, value 1 = typ, value 2 = isin value 3 = name
                                if (transausdb[2] == 'Kauf') {
                                    aktstkkauf += transausdb[5] * 1;
                                    aktwertkauf += (transausdb[6] * transausdb[5]);
                                }
                                if (transausdb[2] == 'Verkauf') {
                                    aktstkverkauf += transausdb[5] * 1;
                                    aktwertverkaufaktkurs += transausdb[5] * aktkurs;
                                }
                                aktstk = aktstkkauf - aktstkverkauf;
                                aktkurs = (aktwertkauf - aktwertverkaufaktkurs) / aktstk;
                                if (aktstk == 0) {
                                    aktkurs = 0;
                                }
                                // Ende aktuelle Stk und Kursbestimmung
                                //Summe Dividenden
                                if (transausdb[2] == "Dividende") {
                                    diviwert += ((transausdb[5] * transausdb[6]) - transausdb[7] - transausdb[8]);
                                    //diviwert = diviwert.toFixed(2);
                                    diviwert = diviwert * 1;
                                }
                                //Summe Gebühren,Steuern, Gewinn/Verlust
                                sumgv += transausdb[9] * 1;
                                sumgebuehren += transausdb[7] * 1;
                                sumsteuern += transausdb[8] * 1;
                                //Name aus transaktion
                                var isinname = transausdb[4];
                            }
                        }

                        // Tabelle je Isin für den Bestand erstellen
                        var sumwert = aktstk * aktkurs;
                        //nur bestandswerte anzeigen - für alles einfach if {} entfernen
                        if (sumwert != 0) {
                            stocktablebestand += "<tr><td>" + isin4calc + "</td><td>" + isinname + "</td><td>" + aktstk + "</td><td>" + aktkurs.toFixed(3) + "</td><td>" + sumwert.toFixed(2) + "</td><td>" + diviwert + "</td><td>" + sumgv.toFixed(2)
                                + "</td><td>" + sumgebuehren.toFixed(2) + "</td></td><td>"
                                + sumsteuern.toFixed(2) + "</td></tr>";
                        }
                        window.document.getElementById('stocktable').innerHTML = stocktablebestand;
                    }
                });
            });
        });
});

//Bestand inaktive Wertpapiere gesamt für alle Jahre <div id="stock-table-all">
$(document).ready(function () {
    $("#stock-table-all").bind("click",
        function showstocktableall() {
            var isinlisteunique = [];
            chrome.storage.local.get(null, function (all) {
                //console.log(all);
                // filtere Steuersatz heraus = filteredAry
                var allKeys = Object.keys(all);
                console.log(allKeys, typeof allKeys);
                var filteredTransList = allKeys.filter(function (e) {
                    return e !== 'Steuersatz'
                });
                console.log(filteredTransList, typeof filteredTransList);
                chrome.storage.local.get(filteredTransList, function (all) {
                    //console.log(all);
                    //das sind jetzt die Trans-keys zum auslesen


                    //alle transaktionen in translist sortiert nach Datum
                    var translist = Object.keys(all).map(function (key) {
                        return all[key];
                    });
                    var stocktablebestandall = "<tr><th>Isin</th><th>Name</th><th>Stk</th><th>Kurs</th><th>Bestands-Wert</th><th>Dividenden</th><th>Gewinn/Verlust</th><th>Gebühren</th><th>Steuern</th></tr>";
                    //Sorter nach Datum
                    translist.sort(function (a, b) {
                        var a2 = a[1], b2 = b[1];
                        if (a2 == b2) return 0;
                        return a2 > b2 ? 2 : -1;
                    });
                    //Isinliste unique
                    translist.forEach(function (isi) {
                        var isinnr = isi[3];
                        isinliste.push(isinnr);
                        //isinliste leere werte entfernen
                        isinliste = jQuery.grep(isinliste, function (n) {
                            return (n);
                        });
                        //isinliste unique machen
                        $.each(isinliste,
                            function (i, e) {
                                if ($.inArray(e, isinlisteunique) === -1) isinlisteunique.push(e);
                            });
                        //isinlisteunique;

                    });
                    console.log(isinlisteunique);
                    //console.log(isinliste);
                    //console.log(typeof isinliste);


                    for (var i in isinlisteunique) {
                        var isin4calc = isinlisteunique[i];
                        var aktstkkauf = 0;
                        var aktstkverkauf = 0;
                        var aktwertkauf = 0;
                        var aktwertverkaufaktkurs = 0;
                        var aktstk = 0;
                        var aktkurs = 0;
                        var diviwert = 0;
                        var sumgv = 0;
                        var sumgebuehren = 0;
                        var sumsteuern = 0;
                        //console.log(isin4calc);
                        //console.log(isinliste[i]);

                        for (var x in translist) {
                            var transausdb = translist[x];
                            var isinausdb = transausdb[3];
                            if (isin4calc == isinausdb) {
                                //console.log("Isin4calc " + isin4calc + "isnausdb " + isinausdb);

                                //aktuelle Stuecke und Kursbestimmung
                                //value 4 = kurs, value 5 = stk, value 1 = typ, value 2 = isin value 3 = name
                                if (transausdb[2] == 'Kauf') {
                                    aktstkkauf += transausdb[5] * 1;
                                    aktwertkauf += (transausdb[6] * transausdb[5]);
                                }
                                if (transausdb[2] == 'Verkauf') {
                                    aktstkverkauf += transausdb[5] * 1;
                                    aktwertverkaufaktkurs += transausdb[5] * aktkurs;
                                }
                                aktstk = aktstkkauf - aktstkverkauf;
                                aktkurs = (aktwertkauf - aktwertverkaufaktkurs) / aktstk;
                                if (aktstk == 0) {
                                    aktkurs = 0;
                                }
                                // Ende aktuelle Stk und Kursbestimmung
                                //Summe Dividenden
                                if (transausdb[2] == "Dividende") {
                                    diviwert += ((transausdb[5] * transausdb[6]) - transausdb[7] - transausdb[8]);
                                    diviwert = diviwert * 1;
                                }
                                //Summe Gebühren,Steuern, Gewinn/Verlust
                                sumgv += transausdb[9] * 1;
                                sumgebuehren += transausdb[7] * 1;
                                sumsteuern += transausdb[8] * 1;
                                //Name aus transaktion
                                var isinname = transausdb[4];
                            }
                        }

                        // Tabelle je Isin für den Bestand erstellen
                        var sumwert = aktstk * aktkurs;
                        //nur mit 0 Bestand anzeigen
                        if (sumwert == 0) {
                            stocktablebestandall += "<tr><td>" + isin4calc + "</td><td>" + isinname + "</td><td>" + aktstk + "</td><td>" + aktkurs.toFixed(3) + "</td><td>" + sumwert.toFixed(2) + "</td><td>" + diviwert.toFixed(2) + "</td><td>" + sumgv.toFixed(2)
                                + "</td><td>" + sumgebuehren.toFixed(2) + "</td></td><td>"
                                + sumsteuern.toFixed(2) + "</td></tr>";
                        }
                        window.document.getElementById('stocktableall').innerHTML = stocktablebestandall;
                    }
                });
            });
        });
});


//Transaktionsliste
$(document).ready(function () {
    $("#transaktion-table").bind("click", "onLoad",
        function showstocktablefull() {

            chrome.storage.local.get(null, function (all) {
                //console.log(all);


                // filtere Steuersatz heraus = filteredAry
                var allKeys = Object.keys(all);
                console.log(allKeys, typeof allKeys);
                var filteredTransList = allKeys.filter(function (e) {
                    return e !== 'Steuersatz'
                });
                console.log(filteredTransList, typeof filteredTransList);
                chrome.storage.local.get(filteredTransList, function (all) {
                    //console.log(all);
                    //das sind jetzt die Trans-keys zum auslesen


                    //alle transaktionen in translist sortiert nach Datum
                    var translist = Object.keys(all).map(function (key) {
                        return all[key];
                    });
                    //console.log(translist);
                    var tablealltrans = "<tr><th>Select</th><th>Datum</th><th>Transtyp</th><th>Isin</th><th>Name</th><th>Stk</th><th>Kurs</th><th>Gebuehr</th><th>Steuern</th><th>Euro</th><th>GV</th><th>Status</th></tr><br>";
                    //Sorter nach Datum
                    translist.sort(function (a, b) {
                        var a2 = a[1], b2 = b[1];
                        if (a2 == b2) return 0;
                        return b2 > a2 ? 2 : -1;
                    });

                    var anztrans = translist.length;
                    //console.log(anztrans);
                    //chrome.browserAction.setBadgeText({text: "error"});

                    for (var x in translist) {
                        var transausdb = translist[x];
                        var transidausdb = transausdb[0];
                        var datumausdb = transausdb[1];
                        var transtypausdb = transausdb[2];
                        var isinausdb = transausdb[3];
                        var nameausdb = transausdb[4];
                        var stkausdb = transausdb[5];
                        var kursausdb = transausdb[6];
                        var gebuehrenausdb = transausdb[7];
                        var steuernausdb = transausdb[8];
                        var gvausdb = transausdb[9];
                        var statusausdb = transausdb[10];
                        var wert = stkausdb * kursausdb;

                        tablealltrans += "<tr><td> <input type='radio' id='rownselect' name='selectedtrans' value=" + transidausdb + "></td>"
                            //+ "<td> <button type='button' id='buttondeletetrans'>delete</button>" + transidausdb + "</td></tr>"; //transid

                            + "<td>" + datumausdb + "</td>" //Datum
                            + "<td>" + transtypausdb + "</td>" //Transyp
                            + "<td>" + isinausdb + "</td>" //ISIN
                            + "<td>" + nameausdb + "</td>" //Name
                            + "<td>" + stkausdb + "</td>" //Stk
                            + "<td>" + kursausdb + "</td>" //Kurs
                            + "<td>" + gebuehrenausdb + "</td>" //Gebuehren
                            + "<td>" + steuernausdb + "</td>" //Steuern
                            + "<td>" + wert.toFixed(2) + "</td>"
                            + "<td>" + gvausdb + "</td>" //gv
                            + "<td>" + statusausdb + "</td></tr>";
                        //+ "<td>" + transidausdb + "</td>" //transid
                    }
                    window.document.getElementById('transaktiontable').innerHTML = tablealltrans;
                    var alltransheader = document.getElementById('transaktion-table').innerHTML;
                    window.document.getElementById('transaktion-table').innerHTML = "Alle Transaktionen - Anzahl: " + anztrans;
                });

            });
        });
});



