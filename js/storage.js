/**
 * werner strommer
 */

// Gobal Vars
var alletrans = [];
var urlpopupnew = "popupnewentry.html";
var urlpopupmissingdata = "popupmissingdata.html";
var urlpopupdelete = "popupdeleteentry.html";
var urlpopupkeinkauf = "popupkeinkauf.html";
var urlpopupkeinsteuersatz = "popupkeinsteuersatz.html";
var gvauto = 0;
var steuerncalc = 0;
//var steuersatz = chrome.runtime.getManifest().steuersatzmanifest;
//var steuersatz = 27.5;



//load ReleaseVersion and Steuersazt from Manifest.json
window.onload = $(function () {
    steuersatz = 27.5;
    /** This code runs when everything has been loaded on the page */
    var ReleaseVersion = chrome.runtime.getManifest().version;
    ReleaseVersion = "Release: " + ReleaseVersion;
    console.log(ReleaseVersion);
    window.document.getElementById('Release').innerHTML = ReleaseVersion;
    window.document.getElementById('ReleasenoteRelease').innerHTML = ReleaseVersion;

// Steuersatz auslesen
    steuersatzread = "";
    chrome.storage.local.get('Steuersatz', function (result) {
        steuersatzread = result.Steuersatz;
        console.log(steuersatzread);
        if (steuersatzread == undefined){
            chrome.app.window.create(urlpopupkeinsteuersatz, function (window) {
                //do something with your window
                //window.document.getElementById('newpopupEntry').innerHTML = value;
            });


        }
        steuersatz = steuersatzread;
    });
    console.log(steuersatz + "readfromdb");

});


// Change to Add Page
$(document).ready(function () {
    $("#change2addButton").bind("click",
        function changetwoAddPage() {
            $.mobile.changePage('#page2');
            $("#inputform")[0].reset();
        }
    );
});


// neue SELL Transaktion hinzufügen
$(document).ready(function () {
    $("#addsell").bind("click", function addselltrans() {
        var randomnumber = "trans" + Math.floor((Math.random() * 100000000) + 1);
        var randomnumberstringify = String(randomnumber);
        var Datumget = document.getElementById('Datumsell').value;
        var Transtyp1get = document.getElementById('TransTyp1sell').value;
        var Isinget = document.getElementById('ISINsell').value;
        var Nameget = document.getElementById('Namesell').value;
        var Kursget = document.getElementById('Kurssell').value;
        var Stkget = document.getElementById('Stksell').value;
        var Gebuehrget = document.getElementById('Gebuehrsell').value;
        var Steuernget = document.getElementById('Steuernsell').value;
        var GVget = document.getElementById('GVsell').value;
        var Zustandget = document.getElementById('Zustandsell').value;

        if (Datumget != "" && Stkget != "") {
            var insertkey = randomnumberstringify;
            //alert(insertkey);
            //var insertkey = Ownerget + Datumget + Transtyp1get + Isinget;
            //var key="myKey";

            var heute = new Date().toISOString().slice(11, -8);
            console.log(heute, typeof(heute), Datumget, typeof(Datumget));
            var DateTime = Datumget.concat(" ").concat(heute);
            console.log(DateTime);

            var value = [];
            value = [insertkey, DateTime, Transtyp1get, Isinget, Nameget, Stkget, Kursget, Gebuehrget, Steuernget, GVget, Zustandget];
            var obj = {};
            obj[insertkey] = value;
            chrome.storage.local.set(obj);


            chrome.app.window.create(urlpopupnew, function (window) {
                //do something with your window
                //window.document.getElementById('newpopupEntry').innerHTML = value;
            });

            //chrome.storage.local.set({key:JSON.stringify(value)});
            // var inserttrans = JSON.parse(chrome.storage.local.getItem("insertKey"));
            // alert(1024 * 1024 * 5 - unescape(encodeURIComponent(JSON.stringify(chrome.storage.local))).length);
        } else {
            //alert('Es fehlen Daten! Datum, Kurs, oder Stk?');
            //   console.log('Es fehlen Daten! Datum, Kurs, oder Stk?');
            chrome.app.window.create(urlpopupmissingdata, function (window) {
                //do something with your window
                //window.document.getElementById('newpopupEntry').innerHTML = value;
            });
        }
        ;


        //$("#transaktiontable").load(location.href + "#transaktiontable");
        //var transid = 0;
        var id = "";
        var datum = "";
        var typ = "Eingang";
        var isin = "";
        var name = "";
        var stk = "";
        var kurs = "";
        var gebuehr = "";
        var steuern = "";
        var gv = "";
        var status = "abgrechnet";
        buyanzeige = "";

        //console.log(transid);
        //console.log(typeof transid);
        console.log(id + datum + typ + isin + name);
        $("#Transid").val(id).change();
        $("#Datumsell").val(datum).change();
        $("#TransTyp1sell").val(typ).change();
        $("#ISINsell").val(isin).change();
        $("#Namesell").val(name).change();
        $("#Stksell").val(stk).change();
        $("#Kurssell").val(kurs).change();
        $("#Gebuehrsell").val(gebuehr).change();
        $("#Steuernsell").val(steuern);
        $("#GVsell").val(gv);
        $("#Zustandsell").val(status).change();
        window.document.getElementById('buyinfo').innerHTML = " ";


        $.mobile.changePage('#page1');

        //refresh alltrans
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


// neue Transaktion hinzufügen
$(document).ready(function () {
    $("#add").bind("click", function addtrans() {
        var randomnumber = "trans" + Math.floor((Math.random() * 100000000) + 1);
        var randomnumberstringify = String(randomnumber);
        var Datumget = document.getElementById('Datum').value;
        var Transtyp1get = document.getElementById('TransTyp1').value;
        var Isinget = document.getElementById('ISIN').value;
        var Nameget = document.getElementById('Name').value;
        var Kursget = document.getElementById('Kurs').value;
        var Stkget = document.getElementById('Stk').value;
        var Gebuehrget = document.getElementById('Gebuehr').value;
        var Steuernget = document.getElementById('Steuern').value;
        var GVget = document.getElementById('GV').value;
        var Zustandget = document.getElementById('Zustand').value;

        if (Datumget != "" && Stkget != "") {
            var insertkey = randomnumberstringify;
            //alert(insertkey);
            //var insertkey = Ownerget + Datumget + Transtyp1get + Isinget;
            //var key="myKey";
            var heute = new Date().toISOString().slice(11, -8);
            console.log(heute, typeof(heute), Datumget, typeof(Datumget));
            var DateTime = Datumget.concat(" ").concat(heute);
            console.log(DateTime);


            var value = [];
            value = [insertkey, DateTime, Transtyp1get, Isinget, Nameget, Stkget, Kursget, Gebuehrget, Steuernget, GVget, Zustandget];
            var obj = {};
            obj[insertkey] = value;
            chrome.storage.local.set(obj);


            chrome.app.window.create(urlpopupnew, function (window) {
                //do something with your window
                //window.document.getElementById('newpopupEntry').innerHTML = value;
            });
            //refresh alltrans
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

            //chrome.storage.local.set({key:JSON.stringify(value)});
            // var inserttrans = JSON.parse(chrome.storage.local.getItem("insertKey"));
            // alert(1024 * 1024 * 5 - unescape(encodeURIComponent(JSON.stringify(chrome.storage.local))).length);
        } else {
            //alert('Es fehlen Daten! Datum, Kurs, oder Stk?');
            //   console.log('Es fehlen Daten! Datum, Kurs, oder Stk?');
            chrome.app.window.create(urlpopupmissingdata, function (window) {
                //do something with your window
                //window.document.getElementById('newpopupEntry').innerHTML = value;
            });
        }
        ;


        $("#Transaktion-table-div").load();

        $.mobile.changePage('#page1');

    });
});


// gelesene Transaktion editieren
$(document).ready(function () {
    $("#edit").bind("click", function edittrans() {
        var Transid = document.getElementById('Transidedit').value;
        var Datumget = document.getElementById('Datumedit').value;
        var Transtyp1get = document.getElementById('TransTyp1edit').value;
        var Isinget = document.getElementById('ISINedit').value;
        var Nameget = document.getElementById('Nameedit').value;
        var Kursget = document.getElementById('Kursedit').value;
        var Stkget = document.getElementById('Stkedit').value;
        var Gebuehrget = document.getElementById('Gebuehredit').value;
        var Steuernget = document.getElementById('Steuernedit').value;
        var GVget = document.getElementById('GVedit').value;
        var Zustandget = document.getElementById('Zustandedit').value;
        if (Datumget != "" && Kursget != "" && Stkget != "") {
            var insertkey = Transid;
            //alert(insertkey);
            //var insertkey = Ownerget + Datumget + Transtyp1get + Isinget;
            //var key="myKey";

            var value = [];
            value = [insertkey, Datumget, Transtyp1get, Isinget, Nameget, Stkget, Kursget, Gebuehrget, Steuernget, GVget, Zustandget];
            var obj = {};
            obj[insertkey] = value;
            chrome.storage.local.set(obj);


            //refresh alltrans
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
            //chrome.storage.local.set({key:JSON.stringify(value)});
            // var inserttrans = JSON.parse(chrome.storage.local.getItem("insertKey"));
            // alert(1024 * 1024 * 5 - unescape(encodeURIComponent(JSON.stringify(chrome.storage.local))).length);
        } else
        //alert('Es fehlen Daten! Datum, Kurs, oder Stk?');
            console.log('Es fehlen Daten! Datum, Kurs, oder Stk?');
        $.mobile.changePage('#page1');

    });
});

//Eine Transaktion löschen
$(document).ready(function () {
    $("#deleteButton").bind("click",
        function deleteonetrans() {
            var d = document.getElementsByName('selectedtrans');
            for (var i = 0; i < d.length; i++) {
                if (d[i].checked) {
                    //console.log(d[i].parentNode.innerText);
                    console.log(d[i]);
                    //var transid = d[i];
                    var transid = d[i].getAttribute('value');
                    chrome.storage.local.remove(transid);
                    console.log(transid + " gelöscht");


                    chrome.app.window.create(urlpopupdelete, function (window) {
                        //do something with your window
                        //window.document.getElementById('newpopupEntry').innerHTML = value;
                    });
                    //$("#transaktiontable").load(location.href + "#transaktiontable");

                    //refresh alltrans
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

                }
            }
        });

});


//Eine Transaktion auslesen und auf die Edit-Page wechseln
$(document).ready(function () {
    $("#editButton").bind("click",
        function editonetrans() {
            buyanzeige = 0;
            var d = document.getElementsByName('selectedtrans');
            for (var i = 0; i < d.length; i++) {
                if (d[i].checked) {
                    //console.log(d[i].parentNode.innerText);
                    //console.log(d[i]);
                    //var transid = d[i];
                    var transid = d[i].getAttribute('value');
                    chrome.storage.local.get(transid, function (result) {
                        trans1 = result;
                        //console.log(trans1 + " ausgewählt");
                        var trans = Object.keys(result).map(function (key) {
                            return result[key];
                        });

                        var transid = trans[0];
                        var id = transid[0];
                        var datum = transid[1];
                        var typ = transid[2];
                        var isin = transid[3];
                        var name = transid[4];
                        var stk = transid[5];
                        var kurs = transid[6];
                        var gebuehr = transid[7];
                        var steuern = transid[8];
                        var gv = transid[9];
                        var status = transid[10];
                        console.log(transid);
                        console.log(typeof transid);
                        console.log(id + datum + typ + isin + name);
                        $("#Transidedit").val(id).change();
                        $("#Datumedit").val(datum).change();
                        $("#TransTyp1edit").val(typ).change();
                        $("#ISINedit").val(isin).change();
                        $("#Nameedit").val(name).change();
                        $("#Stkedit").val(stk).change();
                        $("#Kursedit").val(kurs).change();
                        $("#Gebuehredit").val(gebuehr).change();
                        $("#Steuernedit").val(steuern).change();
                        $("#GVedit").val(gv).change();
                        $("#Zustandedit").val(status).change();
                        window.document.getElementById('buyinfo').innerHTML = " ";

                        $.mobile.changePage('#page8');

                        /*console.log(datum);
                         console.log(typeof datum);
                         var sDate = new Date(Date.parse(datum,"dd/mm/yyyy"));
                         console.log(sDate);
                         var mm = sDate.getMonth() + 1;
                         console.log(mm);
                         var yy = sDate.getFullYear();
                         console.log(yy);*/
                    });

                }
            }
        });
});

//Eine Transaktion auslesen(sell) und auf die SELL-Page wechseln
$(document).ready(function () {
    $("#sellButton").bind("click",
        function sellonetrans() {
            var aktstkkauf = 0;
            var aktstkverkauf = 0;
            var aktwertkauf = 0;
            var aktwertverkaufaktkurs = 0;
            var aktstk = 0;
            var aktkurs = 0;
            var typausdb = 0;
            var isin = 0;
            buyanzeige = 0;

            chrome.storage.local.get('Steuersatz', function (result) {
                steuersatzread = result.Steuersatz;
                console.log(steuersatzread);
                if (steuersatzread == undefined){
                    chrome.app.window.create(urlpopupkeinsteuersatz, function (window) {
                        //do something with your window
                        //window.document.getElementById('newpopupEntry').innerHTML = value;
                    });


                }
                steuersatz = steuersatzread;
            });


            var d = document.getElementsByName('selectedtrans');
            for (var i = 0; i < d.length; i++) {
                if (d[i].checked) {
                    //console.log(d[i].parentNode.innerText);
                    //console.log("sellschleife" + d[i]);
                    //var transid = d[i];
                    var transid = d[i].getAttribute('value');
                    chrome.storage.local.get(transid, function (result) {
                        trans1 = result;
                        console.log(trans1 + " ausgewählt");
                        var trans = Object.keys(result).map(function (key) {
                            return result[key];
                        });

                        var transid = trans[0];
                        //var id = transid[0];
                        //var datum = ( "yyyy-mm-dd",  new Date() );
                        //var now = new Date();
                        //var datum = now.getFullYear()+ "-" + (now.getMonth()+1) + "-" + now.getDate();
                        //var datum = transid[1];
                        typausdb = transid[2];
                        var typ = "Verkauf";
                        isin = transid[3];
                        var name = transid[4];
                        //var stk = transid[5];
                        var stk = 0;
                        //var kurs = transid[6];
                        var kurs = 0;
                        var gebuehr = transid[7];
                        //var steuern = transid[8];
                        //var gv = transid[9];
                        var steuern = 0;
                        var gv = 0;
                        var status = transid[10];
                        console.log(transid);
                        //console.log(typeof transid);
                        //console.log(id + datum + typ + isin + name);
                        //$("#Transid").val(id).change();
                        //$("#Datum").val($.datepicker.formatDate('yy-mm-dd', new Date()));
                        //$("#Datum").val(datum).change();
                        $("#TransTyp1sell").val(typ).change();
                        $("#ISINsell").val(isin).change();
                        $("#Namesell").val(name).change();

                        $("#Kurssell").val(kurs).change();
                        $("#Gebuehrsell").val(gebuehr).change();
                        $("#Steuern").val(steuern).change();
                        $("#GV").val(gv).change();
                        $("#Zustand").val(status).change();

                        console.log(typausdb, name);



                        if (typausdb == 'Kauf') {


                            // aktuellen Bestand, Stk, Kurs ermitteln.
                            chrome.storage.local.get(null, function (all) {
                                console.log(all);

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
                                    //Sorter nach Datum
                                    translist.sort(function (a, b) {
                                        var a2 = a[1], b2 = b[1];
                                        if (a2 == b2) return 0;
                                        return a2 > b2 ? 2 : -1;
                                    });

                                    for (var x in translist) {
                                        var transausdb = translist[x];
                                        var isinausdb = transausdb[3];
                                        var isin4calc = isinausdb;
                                        if (isin4calc == isin) {
                                            console.log("Isin4calc " + isin4calc + "isin " + isin + " " + transausdb[2]);

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

                                        }
                                        $("#Stksell").val(aktstk).change();
                                        console.log(aktstk, aktkurs);
                                        buyanzeige = Math.round(aktstk * aktkurs);
                                        console.log(buyanzeige);
                                        window.document.getElementById('buyinfo').innerHTML = "Info Bestand: Stücke: " + aktstk + "  Kurs: " + aktkurs + "  Summe: " + buyanzeige + "  Steuersatz: " + steuersatz + "%";

                                    }
                                });


                                // Automatisch GV Feld berechnen und füllen
                                //$('#inputform').on('change', 'input', function () {
                                $('#inputformsell').on('change', 'input', function () {

                                    var Transtyp1get = document.getElementById('TransTyp1sell').value;
                                    var Kursget = document.getElementById('Kurssell').value;
                                    var Stkget = document.getElementById('Stksell').value;
                                    if (Transtyp1get == 'Verkauf') {

                                        gvauto = (Kursget * Stkget) - (aktkurs * Stkget);

                                    }
                                    steuerncalc = Math.round(((gvauto / 100) * steuersatz) * 100) / 100;
                                    gvauto = Math.round((gvauto - steuerncalc) * 100) / 100;
                                    $('#GVsell').val(gvauto);
                                    $('#Steuernsell').val(steuerncalc);

                                });
                            });


                            $.mobile.changePage('#page4');
                        }


                        else {
                            chrome.app.window.create(urlpopupkeinkauf, function (window) {
                                //do something with your window
                                //window.document.getElementById('newpopupEntry').innerHTML = value;
                            });
                        }
                    });


                }
            }
        });
});

// Gesamtes Local storage löschen
$(document).ready(function () {
    $("#clear_storage").bind("click",
        function resetContent() {
            chrome.storage.local.clear();
            //window.location.reload();


            //refresh alltrans
            chrome.storage.local.get(null, function (all) {
                //console.log(all);
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
            $.mobile.changePage("#page1");


        });
});

// Backup - Read File and write to storage
$(document).ready(function () {
    $("#get_file").bind('click', function (e) {
        chrome.fileSystem.chooseEntry(
            {
                type: 'openFile', accepts: [{
                extensions: ['txt']
            }]
            },
            function (fileEntry) {
                if (!fileEntry) {
                    //$("#OuptutText").html("User did not choose a file");
                    console.log("Kein File gewählt");
                    output.textContent = 'No file selected.';
                    return;
                }
                fileEntry.file(function (file) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        alletrans = e.target.result;
                        //console.log(alletrans);
                        //console.log(typeof alletrans);
                        arrayalltrans = alletrans.split("\n");
                        arrayalltrans = arrayalltrans.filter(Boolean);
                        console.log(arrayalltrans);

                        var index, len;
                        for (index = 0, len = arrayalltrans.length; index < len; ++index) {
                            var transaktionen = arrayalltrans.splice(0, 1);
                            var importarraysingle = transaktionen[0];
                            var transaktionenarray = importarraysingle.split(",");
                            var transidsolo = transaktionenarray[0];
                            //console.log(transaktionenarray);
                            //console.log(transidsolo);
                            var obj = {};
                            obj[transidsolo] = transaktionenarray;
                            chrome.storage.local.set(obj);
                        }

                    };
                    reader.readAsText(file);

                });
            });

    });
});


// Backup - Write File from storage to file
$(document).ready(function () {
    //var trxliste = [];
    $("#save_file").bind('click',

        function saveAs() {
            trxliste = [];
            chrome.storage.local.get(null, function (result) {
                //var allKeys = Object.keys(result);

                // filtere Steuersatz heraus = filteredAry
                var allKeys = Object.keys(result);
                console.log(allKeys, typeof allKeys);
                var filteredTransList = allKeys.filter(function (e) {
                    return e !== 'Steuersatz'
                });
                console.log(filteredTransList, typeof filteredTransList);
                chrome.storage.local.get(filteredTransList, function (result) {
                    //console.log(all);
                    //das sind jetzt die Trans-keys zum auslesen


                    var alltrans = Object.keys(result).map(function (key) {
                        return result[key];

                    });
                    console.log(alltrans);
                    //TRXListe sortieren
                    alltrans.sort(function (a, b) {
                        var a2 = a[1], b2 = b[1];
                        if (a2 == b2) return 0;
                        return b2 > a2 ? 2 : -1;
                    });


                    alltrans.forEach(function (trx) {
                        //var isinnr = isi;
                        var transaktionen = JSON.stringify(trx);
                        var transid = trx[0] + "," + trx [1] + "," + trx[2] + "," + trx[3] + "," + trx[4] + "," + trx[5] + "," + trx[6] + "," + trx[7] + "," + trx[8] + "," + trx[9] + "," + trx[10] + "\n";
                        console.log(transaktionen);
                        //trxliste.push(transid);
                        trxliste += transid.split(",");
                    });

                    console.log("transaktionen ausgelesen");
                    console.log(trxliste);
                    console.log(typeof trxliste);

                }),


                    chrome.fileSystem.chooseEntry({type: 'saveFile'}, function (f) {
                        console.log("File picked");

                        f.createWriter(function (writer) {
                            //var text = "ein eintrag";
                            //var text = document.getElementById('contents').value;
                            writer.onerror = function (e) {
                                console.log("Error");
                                console.log(e);
                            };
                            writer.onwriteend = function (e) {
                                console.log("WriteEnd");
                                console.log(e);
                            };
                            writer.onwrite = function (e) {
                                console.log("Write");
                                console.log(e);
                            };
                            var blob = new Blob([trxliste], {type: 'text/plain'});
                            writer.write(blob);
                        })
                    })
            });
        });
});


//Wechsle auf Steuersatz setzen
$(document).ready(function () {


    $("#TaxRate").bind("click",
        function steuersatzsetzen() {
            chrome.storage.local.get('Steuersatz', function (result) {
                steuersatzread = result.Steuersatz;
                console.log(steuersatzread);
                $("#Steuersatz").val(steuersatzread);
                $.mobile.changePage('#page7');
            });
        });
});

// Steuersatz in db
$(document).ready(function () {
    $("#SaveTaxRate").bind("click",
        function savesteuersatzsetzen() {
            var steuersatztodb = document.getElementById('Steuersatz').value;
            console.log(steuersatztodb);
            chrome.storage.local.set({'Steuersatz': steuersatztodb});
            $.mobile.changePage('#page1');
        });
});










