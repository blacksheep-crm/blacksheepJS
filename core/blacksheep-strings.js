/*******************************************************************
 * File:          blacksheep-strings.js
 * Author:        Alexander Hansal (alex@blacksheep-crm.com)
 * Description:   Message/String repository file of blacksheep.js, a professional utility library and API extension for Oracle Siebel CRM.
 *                Translate the messages in this file for multi-language support.
 * *******************************************************************
 * Copyright (c)2017 Alexander Hansal
 *
 * This software and related documentation are provided under a license agreement.
 * Apart from permissions in this license agreement, you may not
 * use, copy, modify, re-license, distribute this software in any form or by any means.
 * Any reverse engineering of this software is prohibited.
 *
 * This software might change without notice and is not warranted to be error-free.
 *
 * See individual functions for details and comments.
 *
 */

var bs_a=Date.now(); console.log("blacksheep.js : debugger : " + bs_a + " : file " + "blacksheep-strings.js : loading");

function BlacksheepInitStrings(){
    var bsc = SiebelAppFacade.BlacksheepConfig.config;
    if (bsc.debug == "yes") {  var b = "blacksheep.js : debugger : ";  var a=Date.now(); var f=" : function " + "BlacksheepInitStrings (" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(b + a + f + "begin"); }if (bsc.perf == "yes"){var ap = Date.now(); blacksheep_perf_function_call["BlacksheepInitStrings__" + "()" + "__" + ap]={"Start":ap,"End":0};}
    var retval = false;
    //var bsm = SiebelAppFacade.BlacksheepMsg.prototype;
    var _deu = new Array();
    var _enu = new Array();
    //Translatable System Strings

    _deu["INIT_SUCCESS"] = "erfolgreich initialisiert.";
    _deu["INIT_CONSTR"] = "Konstruktoraufruf : ";
    _deu["INIT_PRE"] = "preload Ereignishändler wird ausgeführt : ";
    _deu["INIT_POST"] = "postload Ereignishändler wird ausgeführt : ";
    _deu["ERR_GENERIC"] = "ein Fehler ist aufgetreten : ";
    _deu["ERR_CONTEXT"] = "Kontext konnte nicht validiert werden";
    _deu["EXT_FUN"]  = "Füge Erweiterungsfunktion hinzu : ";
    _deu["HELLO"] = "Hallo Welt!";
    _deu["WL_TRUE"]   = "führe Funktion aus für Objekt auf der weißen Liste : ";
    _deu["WL_FALSE"]   = "Funktion nicht verfügbar, Objekt nicht auf der weißen Liste : ";
    _deu["PMPROP_DISABLED"] = " nicht ausgeführt weil vom Benutzer deaktiviert.";


    _enu["INIT_SUCCESS"] = "successfully initialized.";
    _enu["INIT_CONSTR"] = "in constructor : ";
    _enu["INIT_PRE"] = "preload event handler executing : ";
    _enu["INIT_POST"] = "postload event handler executing : ";
    _enu["ERR_GENERIC"] = "an error occurred : ";
    _enu["ERR_CONTEXT"] = "Context could not be validated";
    _enu["EXT_FUN"]  = "Adding extension function : ";
    _enu["HELLO"] = "Hello World!";
    _enu["WL_TRUE"]   = "executing function for whitelisted object : ";
    _enu["WL_FALSE"]   = "function not available, object not whitelisted : ";
    _enu["PMPROP_DISABLED"] = " not applied because it was disabled by user.";
    
    //TrampStamp and Main Dialog

    var cur_year = new Date().getFullYear();

    _deu["TS_TITLE"] = "blacksheep.js - Erweiterungsbibliothek für Siebel Open UI. Für Optionen klicken.";
    _deu["BTN_CLOSE"] = "Schließen";
    _deu["BTN_CANCEL"] = "Abbrechen";
    _deu["BTN_PERF"] = "Leistung";
    _deu["BTN_SAVE"] = "Speichern";
    _deu["BTN_GET_DEFAULT"] = "Standardwerte";
    _deu["TS_DLG_TITLE"] = "blacksheep.js Infobox";
    _deu["TS_OPT_TITLE"] = "Optionen";
    _deu["TS_OPT_TITLE_FOR"] = "Modul: ";
    _deu["TS_MAIN"]    =
        "<div id='bs_ts_tabs'><ul>" +
            "<li><a href='#bs_ts_tab1'>Allgemein</a></li>" +
            "<li><a href='#bs_ts_tab2'>Benutzereinstellungen</a></li>" +
            "<li><a href='#bs_ts_tab3'>Hilfe</a></li>" + "</ul>" +
            "<div id='bs_ts_tab1'>" +
            "<p>blacksheep.js ist eine professionelle, erweiterbare JavaScript Bibliothek für Siebel Open UI." +
            "<p>Dies ist eine Entwicklerkopie. Nicht in Produktivsystemen einsetzen!" +
            "<p>Für weitere Informationen kontaktieren Sie bitte Ihren Administrator." +
            "</div>" +
            "<div id='bs_ts_tab2'></div>" +
            "<div id='bs_ts_tab3'>" +
            "<p>Tab 3" +
            "</div>" +
            "</div>" +
            "<div class='blacksheep-logo-dlg'></div><span id='blacksheep_dlg_footer'><p align='right'>&#9400;&nbsp;" + cur_year + " <a href='http://blacksheep-crm.com' target='_new'>blacksheep CRM</a></p></span>";

    _deu["TS_DLG_CONF_AV"] = " verfügbar.";
    _deu["TS_DLG_CONF_NA"] = " nicht verfügbar."; 
    _deu["TS_DLG_MOD_HD"] = "Modulauswahl";
    _deu["TS_DLG_MOD_DESC"] = "Wählen Sie ein Modul aus um es zu konfigurieren.";
    _deu["TS_DLG_MOD_NA"] = "Für diese Ansicht sind keine durch Benutzer konfigurierbaren Module vorhanden.";
    _deu["SWITCH_ON"] = "EIN";
    _deu["SWITCH_OFF"] = "AUS";
    _deu["DLG_DEF_TITLE"] = "blacksheep.js Dialog";
    _deu["TS_UO_BTN_TITLE"] = "Einstellungen";
    _deu["TS_DLG_OPT_CB_LABEL_1"] = "Einstellungen nur für aktuelles Applet (";
    _deu["TS_DLG_OPT_CB_LABEL_2"] = ") speichern.";
    _deu["TS_DLG_OPT_CB_HELP_1"] = "Die checkbox anklicken, um die Einstellungen nur für dieses Applet (";
    _deu["TS_DLG_OPT_CB_HELP_2"] = ") zu speichern. Wenn die checkbox leer ist werden die Einstellungen für ALLE Applets gespeichert";
    _deu["TS_DLG_MOD_APP"] = "Ausgewähltes Modul für gesamte Anwendung ein-/ausschalten";
    _deu["TS_DLG_MOD_VIEW"] = "Ausgewähltes Modul für aktuelle View ein-/ausschalten";
    _deu["PERF_TITLE"] = "blacksheep.js Leistung";
    _deu["DLG_CONTROL_OPTIONS"] = "Control Einstellungen";
    _deu["BTN_CONFIG_CONTROLS"] = "Controls konfigurieren";

    _enu["TS_TITLE"] = "blacksheep.js - Extension library for Siebel Open UI. Click for options.";
    _enu["BTN_CLOSE"] = "Close";
    _enu["BTN_CANCEL"] = "Cancel";
    _enu["BTN_PERF"] = "Performance";
    _enu["BTN_SAVE"] = "Save";
    _enu["BTN_GET_DEFAULT"] = "Get Defaults";
    _enu["TS_DLG_TITLE"] = "About blacksheep.js";
    _enu["TS_OPT_TITLE"] = "Options";
    _enu["TS_OPT_TITLE_FOR"] = "Module: ";
    _enu["TS_MAIN"]    =
        "<div id='bs_ts_tabs'><ul>" +
            "<li><a href='#bs_ts_tab1'>General</a></li>" +
            "<li><a href='#bs_ts_tab2'>User Preferences</a></li>" +
            "<li><a href='#bs_ts_tab3'>Help</a></li>" + "</ul>" +

            "<div id='bs_ts_tab1'>" +
            "<p>blacksheep.js is a professional, extensible JavaScript library for Siebel Open UI." +
            "<p>This copy of blacksheep.js is a development version. Do not distribute." +
            "<p>For more information, please contact your administrator." +
            "</div>" +
            "<div id='bs_ts_tab2'></div>" +
            "<div id='bs_ts_tab3'>" +
            "<p>Tab 3" +
            "</div>" +
            "</div>" +
            "<div class='blacksheep-logo-dlg'></div><span id='blacksheep_dlg_footer'><p align='right'>&#9400;&nbsp;" + cur_year + " <a href='http://blacksheep-crm.com' target='_new'>blacksheep CRM</a></p></span>";

    _enu["TS_DLG_CONF_AV"] = " available.";
    _enu["TS_DLG_CONF_NA"] = " not available.";
    _enu["TS_DLG_MOD_HD"] = "Available Modules";
    _enu["TS_DLG_MOD_DESC"] = "Select a module to control it on the map.";
    _enu["TS_DLG_MOD_NA"] = "No user serviceable modules available for this view.";
    _enu["SWITCH_ON"] = "ON";
    _enu["SWITCH_OFF"] = "OFF";
    _enu["DLG_DEF_TITLE"] = "blacksheep.js says:";
    _enu["TS_UO_BTN_TITLE"] = "Settings";
    _enu["TS_DLG_OPT_CB_LABEL_1"] = "Save preferences for current applet (";
    _enu["TS_DLG_OPT_CB_LABEL_2"] = ") only.";
    _enu["TS_DLG_OPT_CB_HELP_1"] = "Check the box to save the settings for this Applet (";
    _enu["TS_DLG_OPT_CB_HELP_2"] = ") only. Uncheck the box to save the settings for ALL Applets";
    _enu["TS_DLG_MOD_APP"] = "Enable/Disable this module for the entire Application";
    _enu["TS_DLG_MOD_VIEW"] = "Enable/Disable this module for current View";
    _enu["PERF_TITLE"] = "blacksheep.js Performance";
    _enu["DLG_CONTROL_OPTIONS"] = "Control Options";
    _enu["BTN_CONFIG_CONTROLS"] = "Configure Controls";

    //Data Retriever
    _enu["DR_LOG_HDR"]     = "blacksheep.js : DataRetriever Log : ";
    _enu["DR_LOG_BO"]      = "Business Object: ";
    _enu["DR_LOG_BC"]      = "Business Component: ";
    _enu["DR_LOG_SRCH"]    = "Search Specification: ";
    _enu["DR_LOG_SORT"]    = "Sort Specification: ";
    _enu["DR_LOG_TIME"]    = "Time Elapsed: ";
    _enu["DR_LOG_COUNT"]   = "Record Count: ";
    _enu["DR_VIEW_MODE"]   = "View Mode: ";
    _enu["DIAG_DR_2"]      = " milliseconds";

    _deu["DR_LOG_HDR"]     = "blacksheep.js : DataRetriever Log : ";
    _deu["DR_LOG_BO"]      = "Business Object: ";
    _deu["DR_LOG_BC"]      = "Business Component: ";
    _deu["DR_LOG_SRCH"]    = "Suchspezifikation: ";
    _deu["DR_LOG_SORT"]    = "Sortierung: ";
    _deu["DR_LOG_TIME"]    = "Laufzeit: ";
    _deu["DR_LOG_COUNT"]   = "Anzahl Datensätze: ";
    _deu["DR_VIEW_MODE"]   = "Sichtbarkeitsmodus: ";
    _deu["DIAG_DR_2"]      = " Millisekunden";

    //3rd Party Helper Strings, LOVs et al
    //{"linear":"","swing":"","easeInQuad":"","easeOutQuad":"","easeInOutQuad":"","easeInCubic":"","easeOutCubic":"","easeInOutCubic":"","easeInQuart":"","easeOutQuart":"","easeInOutQuart":"","easeInQuint":"","easeOutQuint":"","easeInOutQuint":"","easeInExpo":"","easeOutExpo":"","easeInOutExpo":"","easeInSine":"","easeOutSine":"","easeInOutSine":"","easeInCirc":"","easeOutCirc":"","easeInOutCirc":"","easeInElastic":"","easeOutElastic":"","easeInOutElastic":"","easeInBack":"","easeOutBack":"","easeInOutBack":"","easeInBounce":"","easeOutBounce":"","easeInOutBounce"":""}

    _enu["LOV_YES_NO"] = {"yes":"Yes","no":"No"};
    _deu["LOV_YES_NO"] = {"yes":"Ja","no":"Nein"};
    _enu["CTRL_CLICK_TIP"] = "CTRL+Click for options.";
    _deu["CTRL_CLICK_TIP"] = "STRG+Klick für Optionen.";

    for (key in _deu){
        SiebelAppFacade.BlacksheepMsg.msg["deu"][key] = _deu[key];
    }
    key = null;
    for (key in _enu){
        SiebelAppFacade.BlacksheepMsg.msg["enu"][key] = _enu[key];
    }
    retval = true;
    if (bsc.debug == "yes") { var z = Date.now(); console.log(b + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zp = Date.now(); blacksheep_perf_function_call["BlacksheepInitStrings__" + "()" + "__" + ap]["End"]=zp;}
}
var bs_z=Date.now(); console.log("blacksheep.js : debugger : " + bs_z + " : file " + "blacksheep-strings.js : loaded : time(ms): " + parseInt(bs_z-bs_a)); blacksheep_perf_file_load["blacksheep-strings.js"] = parseInt(bs_z-bs_a); bs_z = bs_a = null;