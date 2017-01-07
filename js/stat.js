/**
 * Created by werner on 25.05.16.
 */


// Statistic Seite anzeigen
var d = new Date();
var aktjahr = d.getFullYear();
console.log("aktjahr initial setzen" + aktjahr)
var gewverlyearly;
var gebuehrenyearly;

//von Hauptseite
$(document).ready(function () {
    $("#gotostatistics").bind("click",
        function showStats() {


//window.onload = $(function () {
            /** This code runs when everything has been loaded on the page */
                // var d = new Date();
                // var aktjahr =d.getFullYear();
            var d = new Date();
            //var aktjahr = d.getFullYear();
            console.log(aktjahr);
            var d = new Date();
            aktjahr = d.getFullYear();
            var mm_liste = [];
            var mm_uniqueliste = [];
            var gewverlarry = [];
            var translistyear = [];
            gewverlyearly = 0;
            gebuehrenyearly = 0;
            chrome.storage.local.get(null, function (all) {
                //console.log(all);


                // filtere Steuersatz aus storage heraus = filteredAry
                var allKeys = Object.keys(all);
                //console.log(allKeys, typeof allKeys);
                var filteredTransList = allKeys.filter(function (e) {
                    return e !== 'Steuersatz'
                });
                //console.log(filteredTransList, typeof filteredTransList);


                chrome.storage.local.get(filteredTransList, function (all) {
                    //console.log(all);
                    //das sind jetzt die Trans-keys zum auslesen


                    //alle transaktionen in translist sortiert nach Datum
                    var translist = Object.keys(all).map(function (key) {
                        return all[key];
                    });
                    //Sorter nach Datum
                    translist.sort(function (a, b) {
                        var a2 = a[1], b2 = b[1];
                        if (a2 == b2) return 0;
                        return a2 > b2 ? 2 : -1;
                    });


                    // Filtere alle Transaktionen für aktjahr heraus = übergabe zur Weiterbearbeitung
                    translist.forEach(function (trx) {
                        var datum = trx[1];
                        var sDate = new Date(Date.parse(datum, "dd/mm/yyyy"));
                        //console.log(sDate);
                        //var mm = sDate.getMonth() + 1;
                        //console.log(mm);
                        var yy = sDate.getFullYear();
                        //console.log(yy);
                        if (yy == aktjahr) {
                            translistyear.push(trx);
                        }
                    });
                    var translistlength = translistyear.length;
                    console.log("anzahl trx: " + translistlength);
                    window.document.getElementById('AnzTrans').innerHTML = "Anzahl Transaktionen: " + translistlength;


                    //Monat unique
                    translistyear.forEach(function (trx) {
                        var datum = trx[1];
                        var sDate = new Date(Date.parse(datum, "dd/mm/yyyy"));
                        //console.log(sDate);
                        var mm = sDate.getMonth() + 1;
                        //console.log(mm);
                        //var yy = sDate.getFullYear();
                        //console.log(yy);
                        mm_liste.push(mm);

                        //Monatsliste leere werte entfernen
                        mm_liste = jQuery.grep(mm_liste, function (n) {
                            return (n);
                        });
                        //Monatsliste unique machen
                        $.each(mm_liste,
                            function (i, e) {
                                if ($.inArray(e, mm_uniqueliste) === -1) mm_uniqueliste.push(e);
                            });
                        //Monatslisteunique = mm_uniqueliste;
                    });
                    // Gewinnberechnung je Monat
                    for (var i in mm_uniqueliste) {
                        var mmgewverlsum = 0;
                        var mmgebuehrensum = 0;
                        var mmdivisum = 0;
                        var mmnegativsteuernsum = 0;
                        var mmgewverl = 0;
                        var mmforcalc = mm_uniqueliste[i];

                        for (var x in translistyear) {
                            var transausdb = translistyear[x];
                            var datumdb = transausdb[1];
                            var dbDate = new Date(Date.parse(datumdb, "dd/mm/yyyy"));
                            var mmdb = dbDate.getMonth() + 1;
                            var gewverldb = transausdb[9] * 1;
                            var gebuehrensum = transausdb[7] * 1;
                            //var stkausdb = transausdb[5];

                            if (mmforcalc == mmdb) {
                                //console.log("Monatberechung " + mmforcalc + "MonatausDB " + mmdb);
                                //Gewinnsummierung
                                //value 4 = kurs, value 5 = stk, value 1 = typ, value 2 = isin value 3 = name
                                mmgewverlsum += gewverldb;
                                mmgebuehrensum += gebuehrensum;
                                //mmgewverl = Math.round(mmgewverlsum - mmgebuehrensum);

                                //Summe Dividenden
                                if (transausdb[2] == "Dividende") {
                                    var diviwert = +(transausdb[5] * 1);
                                    mmdivisum = +diviwert;
                                }

                                //Negativ Steuern
                                if (transausdb[8] < 0) {
                                    var negativsteuern = +((transausdb[8]) * -1);
                                    mmnegativsteuernsum = +negativsteuern;
                                }
                            }
                        }
                        //console.log("Monat: " + mmforcalc + "GWSum: " + mmgewverlsum + " GebSum: " + mmgebuehrensum + "DiviSum: " +  mmdivisum + "SteuSum: "+ mmnegativsteuernsum);
                        //console.log(mmgewverlsum - mmgebuehrensum + mmdivisum + mmnegativsteuernsum);
                        mmgewverl = Math.round(mmgewverlsum - mmgebuehrensum + mmdivisum + mmnegativsteuernsum);
                        gewverlyearly += mmgewverl;
                        gebuehrenyearly += Math.round(mmgebuehrensum);
                        gewverlarry.push(mmgewverl);
                        //console.log("Array GV: " + gewverlarry);
                    }
                    //});
                    window.document.getElementById('GewinnVerlust').innerHTML = "Gewinn/Verlust: " + gewverlyearly;
                    window.document.getElementById('GebuehrenproJahr').innerHTML = "Gesamt Gebühren: " + gebuehrenyearly;


                    // Replace the chart canvas element
// Diagram erstellen
                    var ctx = document.getElementById("myChart");
                    console.log("Schreibe Diagramm");
                    var myChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: mm_uniqueliste,
                            //labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                            datasets: [{
                                label: aktjahr + ' - Gew. ges/mon: ' + gewverlyearly,
                                data: gewverlarry
                                //data: [1, 2, 3, 4, 5, 6]
                            }]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        }
                    });
                });
            });
        });
});

// Aktuelles Jahr
$(document).ready(function () {
    $("#DiesesJahr").bind("click",
        function showStats() {


//window.onload = $(function () {
            /** This code runs when everything has been loaded on the page */
            var d = new Date();
            aktjahr = d.getFullYear();

            //console.log(aktjahr);
            var mm_liste = [];
            var mm_uniqueliste = [];
            var gewverlarry = [];
            gewverlyearly = 0;
            gebuehrenyearly = 0;
            var translistyear = [];
            chrome.storage.local.get(null, function (all) {
                //console.log(all);


                // filtere Steuersatz aus storage heraus = filteredAry
                var allKeys = Object.keys(all);
                //console.log(allKeys, typeof allKeys);
                var filteredTransList = allKeys.filter(function (e) {
                    return e !== 'Steuersatz'
                });
                //console.log(filteredTransList, typeof filteredTransList);


                chrome.storage.local.get(filteredTransList, function (all) {
                    //console.log(all);
                    //das sind jetzt die Trans-keys zum auslesen


                    //alle transaktionen in translist sortiert nach Datum
                    var translist = Object.keys(all).map(function (key) {
                        return all[key];
                    });
                    //Sorter nach Datum
                    translist.sort(function (a, b) {
                        var a2 = a[1], b2 = b[1];
                        if (a2 == b2) return 0;
                        return a2 > b2 ? 2 : -1;
                    });


                    // Filtere alle Transaktionen für aktjahr heraus = übergabe zur Weiterbearbeitung
                    translist.forEach(function (trx) {
                        var datum = trx[1];
                        var sDate = new Date(Date.parse(datum, "dd/mm/yyyy"));
                        //console.log(sDate);
                        //var mm = sDate.getMonth() + 1;
                        //console.log(mm);
                        var yy = sDate.getFullYear();
                        //console.log(yy);
                        if (yy == aktjahr) {
                            translistyear.push(trx);
                        }
                    });
                    var translistlength = translistyear.length;
                    console.log("anzahl trx: " + translistlength);
                    console.log(translistyear);
                    window.document.getElementById('AnzTrans').innerHTML = "Anzahl Transaktionen: " + translistlength;


                    //Monat unique
                    translistyear.forEach(function (trx) {
                        var datum = trx[1];
                        var sDate = new Date(Date.parse(datum, "dd/mm/yyyy"));
                        //console.log(sDate);
                        var mm = sDate.getMonth() + 1;
                        //console.log(mm);
                        //var yy = sDate.getFullYear();
                        //console.log(yy);

                        mm_liste.push(mm);


                        //Monatsliste leere werte entfernen
                        mm_liste = jQuery.grep(mm_liste, function (n) {
                            return (n);
                        });
                        //Monatsliste unique machen
                        $.each(mm_liste,
                            function (i, e) {
                                if ($.inArray(e, mm_uniqueliste) === -1) mm_uniqueliste.push(e);
                            });
                        //Monatslisteunique = mm_uniqueliste;

                    });
                    //console.log(mm_uniqueliste);


                    // Gewinnberechnung je Monat
                    for (var i in mm_uniqueliste) {
                        var mmgewverlsum = 0;
                        var mmgebuehrensum = 0;
                        var mmdivisum = 0;
                        var mmnegativsteuernsum = 0;
                        var mmgewverl = 0;
                        var mmforcalc = mm_uniqueliste[i];

                        for (var x in translistyear) {
                            var transausdb = translistyear[x];
                            var datumdb = transausdb[1];
                            var dbDate = new Date(Date.parse(datumdb, "dd/mm/yyyy"));
                            var mmdb = dbDate.getMonth() + 1;
                            var gewverldb = transausdb[9] * 1;
                            var gebuehrensum = transausdb[7] * 1;
                            //var stkausdb = transausdb[5];

                            if (mmforcalc == mmdb) {
                                //console.log("Monatberechung " + mmforcalc + "MonatausDB " + mmdb);
                                //Gewinnsummierung
                                //value 4 = kurs, value 5 = stk, value 1 = typ, value 2 = isin value 3 = name
                                mmgewverlsum += gewverldb;
                                mmgebuehrensum += gebuehrensum;
                                //mmgewverl = Math.round(mmgewverlsum - mmgebuehrensum);

                                //Summe Dividenden
                                if (transausdb[2] == "Dividende") {
                                    var diviwert = +(transausdb[5] * 1);
                                    mmdivisum = +diviwert;
                                }

                                //Negativ Steuern
                                if (transausdb[8] < 0) {
                                    var negativsteuern = +((transausdb[8]) * -1);
                                    mmnegativsteuernsum = +negativsteuern;
                                }
                            }
                        }
                        //console.log("Monat: " + mmforcalc + "GWSum: " + mmgewverlsum + " GebSum: " + mmgebuehrensum + "DiviSum: " +  mmdivisum + "SteuSum: "+ mmnegativsteuernsum);
                        //console.log(mmgewverlsum - mmgebuehrensum + mmdivisum + mmnegativsteuernsum);
                        mmgewverl = Math.round(mmgewverlsum - mmgebuehrensum + mmdivisum + mmnegativsteuernsum);
                        gewverlyearly += mmgewverl;
                        gebuehrenyearly += Math.round(mmgebuehrensum);
                        gewverlarry.push(mmgewverl);
                        //console.log("Array GV: " + gewverlarry);
                    }
                    //});
                    window.document.getElementById('GewinnVerlust').innerHTML = "Gewinn/Verlust: " + gewverlyearly;
                    window.document.getElementById('GebuehrenproJahr').innerHTML = "Gesamt Gebühren: " + gebuehrenyearly;


                    // Replace the chart canvas element
// Diagram erstellen
                    var ctx = document.getElementById("myChart");
                    console.log("Schreibe Diagramm");
                    var myChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: mm_uniqueliste,
                            //labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                            datasets: [{
                                label: aktjahr + ' - Gew. ges/mon: ' + gewverlyearly,
                                data: gewverlarry
                                //data: [1, 2, 3, 4, 5, 6]
                            }]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        }
                    });
                });
            });
        });
});

// Ein Jahr zurück
$(document).ready(function () {
    $("#JahrZurueck").bind("click",
        function showStats() {


//window.onload = $(function () {
            /** This code runs when everything has been loaded on the page */
            // var d = new Date();
            // var aktjahr =d.getFullYear();
            aktjahr = aktjahr - 1;
            //console.log(aktjahr);
            var mm_liste = [];
            var mm_uniqueliste = [];
            var gewverlarry = [];
            gewverlyearly = 0;
            gebuehrenyearly = 0;
            var translistyear = [];
            chrome.storage.local.get(null, function (all) {
                //console.log(all);


                // filtere Steuersatz aus storage heraus = filteredAry
                var allKeys = Object.keys(all);
                //console.log(allKeys, typeof allKeys);
                var filteredTransList = allKeys.filter(function (e) {
                    return e !== 'Steuersatz'
                });
                //console.log(filteredTransList, typeof filteredTransList);


                chrome.storage.local.get(filteredTransList, function (all) {
                    //console.log(all);
                    //das sind jetzt die Trans-keys zum auslesen


                    //alle transaktionen in translist sortiert nach Datum
                    var translist = Object.keys(all).map(function (key) {
                        return all[key];
                    });
                    //Sorter nach Datum
                    translist.sort(function (a, b) {
                        var a2 = a[1], b2 = b[1];
                        if (a2 == b2) return 0;
                        return a2 > b2 ? 2 : -1;
                    });


                    // Filtere alle Transaktionen für aktjahr heraus = übergabe zur Weiterbearbeitung
                    translist.forEach(function (trx) {
                        var datum = trx[1];
                        var sDate = new Date(Date.parse(datum, "dd/mm/yyyy"));
                        //console.log(sDate);
                        //var mm = sDate.getMonth() + 1;
                        //console.log(mm);
                        var yy = sDate.getFullYear();
                        //console.log(yy + "aktjahr= " + aktjahr);
                        if (yy == aktjahr) {
                            translistyear.push(trx);
                        }
                    });
                    var translistlength = translistyear.length;
                    console.log("anzahl trx: " + translistlength);
                    window.document.getElementById('AnzTrans').innerHTML = "Anzahl Transaktionen: " + translistlength;


                    //Monat unique
                    translistyear.forEach(function (trx) {
                        var datum = trx[1];
                        var sDate = new Date(Date.parse(datum, "dd/mm/yyyy"));
                        //console.log(sDate);
                        var mm = sDate.getMonth() + 1;
                        //console.log(mm);
                        //var yy = sDate.getFullYear();
                        //console.log(yy);

                        mm_liste.push(mm);


                        //Monatsliste leere werte entfernen
                        mm_liste = jQuery.grep(mm_liste, function (n) {
                            return (n);
                        });
                        //Monatsliste unique machen
                        $.each(mm_liste,
                            function (i, e) {
                                if ($.inArray(e, mm_uniqueliste) === -1) mm_uniqueliste.push(e);
                            });
                        //Monatslisteunique = mm_uniqueliste;

                    });
                    //console.log("Monatsliste: " + mm_uniqueliste);


                    // Gewinnberechnung je Monat
                    for (var i in mm_uniqueliste) {
                        var mmgewverlsum = 0;
                        var mmgebuehrensum = 0;
                        var mmdivisum = 0;
                        var mmnegativsteuernsum = 0;
                        var mmgewverl = 0;
                        var mmforcalc = mm_uniqueliste[i];

                        for (var x in translistyear) {
                            var transausdb = translistyear[x];
                            var datumdb = transausdb[1];
                            var dbDate = new Date(Date.parse(datumdb, "dd/mm/yyyy"));
                            var mmdb = dbDate.getMonth() + 1;
                            var gewverldb = transausdb[9] * 1;
                            var gebuehrensum = transausdb[7] * 1;
                            //var stkausdb = transausdb[5];

                            if (mmforcalc == mmdb) {
                                //console.log("Monatberechung " + mmforcalc + "MonatausDB " + mmdb);
                                //Gewinnsummierung
                                //value 4 = kurs, value 5 = stk, value 1 = typ, value 2 = isin value 3 = name
                                mmgewverlsum += gewverldb;
                                mmgebuehrensum += gebuehrensum;
                                //mmgewverl = Math.round(mmgewverlsum - mmgebuehrensum);

                                //Summe Dividenden
                                if (transausdb[2] == "Dividende") {
                                    var diviwert = +(transausdb[5] * 1);
                                    mmdivisum = +diviwert;
                                }

                                //Negativ Steuern
                                if (transausdb[8] < 0) {
                                    var negativsteuern = +((transausdb[8]) * -1);
                                    mmnegativsteuernsum = +negativsteuern;
                                }
                            }
                        }
                        //console.log("Monat: " + mmforcalc + "GWSum: " + mmgewverlsum + " GebSum: " + mmgebuehrensum + "DiviSum: " +  mmdivisum + "SteuSum: "+ mmnegativsteuernsum);
                        //console.log(mmgewverlsum - mmgebuehrensum + mmdivisum + mmnegativsteuernsum);
                        mmgewverl = Math.round(mmgewverlsum - mmgebuehrensum + mmdivisum + mmnegativsteuernsum);
                        gewverlyearly += mmgewverl;
                        gebuehrenyearly += Math.round(mmgebuehrensum);
                        gewverlarry.push(mmgewverl);
                        //console.log("Array GV: " + gewverlarry);
                    }
                    //});
                    window.document.getElementById('GewinnVerlust').innerHTML = "Gewinn/Verlust: " + gewverlyearly;
                    window.document.getElementById('GebuehrenproJahr').innerHTML = "Gesamt Gebühren: " + gebuehrenyearly;


                    // Replace the chart canvas element
// Diagram erstellen
                    var ctx = document.getElementById("myChart");
                    console.log("Schreibe Diagramm");
                    var myChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: mm_uniqueliste,
                            //labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                            datasets: [{
                                label: aktjahr + ' - Gew. ges/mon: ' + gewverlyearly,
                                data: gewverlarry
                                //data: [1, 2, 3, 4, 5, 6]
                            }]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        }
                    });
                });
            });
        });
});

// Ein Jahr vor
$(document).ready(function () {
    $("#JahrVoran").bind("click",
        function showStats() {


//window.onload = $(function () {
            /** This code runs when everything has been loaded on the page */
            // var d = new Date();
            // var aktjahr =d.getFullYear();
            aktjahr = aktjahr + 1;
            console.log(aktjahr);
            var mm_liste = [];
            var mm_uniqueliste = [];
            var gewverlarry = [];
            gewverlyearly = 0;
            gebuehrenyearly = 0;
            var translistyear = [];
            chrome.storage.local.get(null, function (all) {
                //console.log(all);


                // filtere Steuersatz aus storage heraus = filteredAry
                var allKeys = Object.keys(all);
                //console.log(allKeys, typeof allKeys);
                var filteredTransList = allKeys.filter(function (e) {
                    return e !== 'Steuersatz'
                });
                //console.log(filteredTransList, typeof filteredTransList);


                chrome.storage.local.get(filteredTransList, function (all) {
                    //console.log(all);
                    //das sind jetzt die Trans-keys zum auslesen


                    //alle transaktionen in translist sortiert nach Datum
                    var translist = Object.keys(all).map(function (key) {
                        return all[key];
                    });
                    //Sorter nach Datum
                    translist.sort(function (a, b) {
                        var a2 = a[1], b2 = b[1];
                        if (a2 == b2) return 0;
                        return a2 > b2 ? 2 : -1;
                    });


                    // Filtere alle Transaktionen für aktjahr heraus = übergabe zur Weiterbearbeitung
                    translist.forEach(function (trx) {
                        var datum = trx[1];
                        var sDate = new Date(Date.parse(datum, "dd/mm/yyyy"));
                        //console.log(sDate);
                        //var mm = sDate.getMonth() + 1;
                        //console.log(mm);
                        var yy = sDate.getFullYear();
                        //console.log(yy);
                        if (yy == aktjahr) {
                            translistyear.push(trx);
                        }
                    });
                    var translistlength = translistyear.length;
                    console.log("anzahl trx: " + translistlength);
                    console.log(translistyear);
                    window.document.getElementById('AnzTrans').innerHTML = "Anzahl Transaktionen: " + translistlength;


                    //Monat unique
                    translistyear.forEach(function (trx) {
                        var datum = trx[1];
                        var sDate = new Date(Date.parse(datum, "dd/mm/yyyy"));
                        //console.log(sDate);
                        var mm = sDate.getMonth() + 1;
                        //console.log(mm);
                        //var yy = sDate.getFullYear();
                        //console.log(yy);

                        mm_liste.push(mm);


                        //Monatsliste leere werte entfernen
                        mm_liste = jQuery.grep(mm_liste, function (n) {
                            return (n);
                        });
                        //Monatsliste unique machen
                        $.each(mm_liste,
                            function (i, e) {
                                if ($.inArray(e, mm_uniqueliste) === -1) mm_uniqueliste.push(e);
                            });
                        //Monatslisteunique = mm_uniqueliste;

                    });
                    //console.log(mm_uniqueliste);


                    // Gewinnberechnung je Monat
                    for (var i in mm_uniqueliste) {
                        var mmgewverlsum = 0;
                        var mmgebuehrensum = 0;
                        var mmdivisum = 0;
                        var mmnegativsteuernsum = 0;
                        var mmgewverl = 0;
                        var mmforcalc = mm_uniqueliste[i];

                        for (var x in translistyear) {
                            var transausdb = translistyear[x];
                            var datumdb = transausdb[1];
                            var dbDate = new Date(Date.parse(datumdb, "dd/mm/yyyy"));
                            var mmdb = dbDate.getMonth() + 1;
                            var gewverldb = transausdb[9] * 1;
                            var gebuehrensum = transausdb[7] * 1;
                            //var stkausdb = transausdb[5];

                            if (mmforcalc == mmdb) {
                                //console.log("Monatberechung " + mmforcalc + "MonatausDB " + mmdb);
                                //Gewinnsummierung
                                //value 4 = kurs, value 5 = stk, value 1 = typ, value 2 = isin value 3 = name
                                mmgewverlsum += gewverldb;
                                mmgebuehrensum += gebuehrensum;
                                //mmgewverl = Math.round(mmgewverlsum - mmgebuehrensum);

                                //Summe Dividenden
                                if (transausdb[2] == "Dividende") {
                                    var diviwert = +(transausdb[5] * 1);
                                    mmdivisum = +diviwert;
                                }

                                //Negativ Steuern
                                if (transausdb[8] < 0) {
                                    var negativsteuern = +((transausdb[8]) * -1);
                                    mmnegativsteuernsum = +negativsteuern;
                                }
                            }
                        }
                        //console.log("Monat: " + mmforcalc + "GWSum: " + mmgewverlsum + " GebSum: " + mmgebuehrensum + "DiviSum: " +  mmdivisum + "SteuSum: "+ mmnegativsteuernsum);
                        //console.log(mmgewverlsum - mmgebuehrensum + mmdivisum + mmnegativsteuernsum);
                        mmgewverl = Math.round(mmgewverlsum - mmgebuehrensum + mmdivisum + mmnegativsteuernsum);
                        gewverlyearly += mmgewverl;
                        gebuehrenyearly += Math.round(mmgebuehrensum);
                        gewverlarry.push(mmgewverl);
                        //console.log("Array GV: " + gewverlarry);
                    }
                    //});
                    window.document.getElementById('GewinnVerlust').innerHTML = "Gewinn/Verlust: " + gewverlyearly;
                    window.document.getElementById('GebuehrenproJahr').innerHTML = "Gesamt Gebühren: " + gebuehrenyearly;


                    // Replace the chart canvas element
// Diagram erstellen
                    var ctx = document.getElementById("myChart");
                    console.log("Schreibe Diagramm");
                    var myChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: mm_uniqueliste,
                            //labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                            datasets: [{
                                label: aktjahr + ' - Gew. ges/mon: ' + gewverlyearly,
                                data: gewverlarry
                                //data: [1, 2, 3, 4, 5, 6]
                            }]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        }
                    });
                });
            });
        });
});