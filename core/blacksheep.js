/*******************************************************************
 * File:          blacksheep.js
 * Author:        Alexander Hansal (alex@blacksheep-crm.com)
 * Description:   Core file of blacksheep.js, a professional utility library and API extension for Oracle Siebel CRM.
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
 */




                                                                                                                        var bs_aa=Date.now(); console.log("blacksheep.js : debugger : " + bs_aa + " : file " + "blacksheep.js : loading");
 
var bsco = new SiebelAppFacade.BlacksheepConfig();
var bsc = bsco.GetConfig();
var bsd = "blacksheep.js : debugger : ";

if (typeof( SiebelAppFacade.Blacksheep) === "undefined" &&
    bsc && bsc.enabled == "yes") {

    SiebelJS.Namespace(" SiebelAppFacade.Blacksheep");

     SiebelAppFacade.Blacksheep = function () {
                                                                                                                        if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function  SiebelAppFacade.Blacksheep() : "; console.log(  bsd + a + f + "begin"); }
        var retval = false;
        var bsm = new SiebelAppFacade.BlacksheepMsg();

        function Blacksheep() { console.log(this.GetMsg("INIT_CONSTR",true) + "Blacksheep"); }

        //function GetMsg: retrieves translatable message from the message store
        Blacksheep.prototype.GetMsg = function (key,prefix,lang){
                                                                                                                        //if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.GetMsg(" +  $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(  bsd + a + f + "begin"); }
            retval = bsm.GetMessage(key,prefix,lang);
                                                                                                                        //if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
            return retval;
        };

         //function SetMsg: writes new message to the message store
        Blacksheep.prototype.SetMsg = function (key,msg,lang){
                                                                                                                        //if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.SetMsg(" +  $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(  bsd + a + f + "begin"); }
            retval = bsm.SetMessage(key,msg,lang);
                                                                                                                        //if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
            return retval;
        };

         //simple ErrorHandler, override at will
        Blacksheep.prototype.ErrorHandler = function(e){
                                                                                                                        if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.ErrorHandler(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(  bsd + a + f + "begin"); }
            console.log(this.GetMsg("ERR_GENERIC",true) + e.toString());
                                                                                                                        if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : error: " + e.toString()); }
        };

        /*
         Function ValidateContext: returns a valid PM instance for Applet, PW or PR
         Inputs: Applet object/name/elementID, PM, PW or PR instance
         Returns: PM instance for valid input, null for invalid input
         */
        Blacksheep.prototype.ValidateContext = function(object){                                                        if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.ValidateContext(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(  bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["ValidateContext__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = false;
            try{
                var pm = null;
                //context might be an applet instance
                //the GetPModel function gives it away
                if(typeof(object.GetPModel) === "function"){
                    pm = object.GetPModel();
                }
                //or it is a PM already...
                else if (typeof(object.OnControlEvent) === "function") {
                    pm = object;
                }
                //... or a PR, then we can get the PM easily:
                else if (typeof(object.GetPM) === "function"){
                    pm = object.GetPM();
                }
                //context is neither an applet, PM nor PR...
                //...but could be an id string such as "S_A1" or "Contact List Applet"
                else if (typeof(object) === "string"){
                    var temp = object;
                    var appletmap = SiebelApp.S_App.GetActiveView().GetAppletMap();
                    for (ap in appletmap){
                        if (temp.indexOf("S_") == 0){
                        if (appletmap[ap].GetPModel().Get("GetFullId") == object){
                            pm = appletmap[ap].GetPModel();
                        }
                        }
                        else{ //assume it's the applet name
                            pm = appletmap[temp].GetPModel();
                        }
                    }
                }
                else{
                    throw(this.GetMsg("ERR_CONTEXT"));
                }
            }
            catch(e){
                this.ErrorHandler(e.toString());
            }
            finally{
                retval = pm;
                                                                                                                        if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + (retval == null ? object : retval.GetPMName())); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["ValidateContext__" + "()" + "__" + aperf]["End"]=zperf;}
            }
            return retval;
        };

        /*
         Function GetAppletElem: Gets the DOM element for an applet
         Inputs: applet object, PM or PR
         Returns: applet DOM element or false
         */
        Blacksheep.prototype.GetAppletElem = function(context){                                                         if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.GetAppletElem(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(  bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetAppletElem__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = false;
            //get the PM
            var pm = this.ValidateContext(context);
            var appletElem = null;
            if(pm){
                var appletElemId = pm.Get("GetFullId");
                //we better use some constants, one never knows...
                appletElem = $("#" + this.GetMsg("AP_PREFIX") +  appletElemId + this.GetMsg("AP_POSTFIX"));
            }
            if (appletElem.length > 0){
                retval = appletElem;
            }
            else{
                retval = appletElem;
            }
                                                                                                                        if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + (retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["GetAppletElem__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        /*
         Function GenerateDOMElement: Generates HTML element
         Inputs: Element type (e.g. "DIV"), attributes as object (e.g. {class: "myClass"})
         Returns: HTML element
         */
        Blacksheep.prototype.GenerateDOMElement = function(type, attributes){                                           if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.GenerateDOMElement(" +  $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(  bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GenerateDOMElement__" + type + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = false;
            //create new element using jQuery
            var elem = $("<" + type + ">");
            if (attributes){ //set attributes
                elem.attr(attributes);
            }
            retval = elem;
                                                                                                                        if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["GenerateDOMElement__" + type + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        /*
         Function GetActiveApplet: Gets the active applet
         Inputs: nothing
         Returns: active applet object instance
         */
        Blacksheep.prototype.GetActiveApplet = function(){                                                              if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.GetActiveApplet() : "; console.log(  bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetActiveApplet__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var retval;
            var activeView = SiebelApp.S_App.GetActiveView();
            retval = activeView.GetActiveApplet();
                                                                                                                        if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["GetActiveApplet__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };
        /*
         Function GetActivePM: Gets the PM of the active applet
         Inputs: nothing
         Returns: PM instance of active applet
         */
        Blacksheep.prototype.GetActivePM = function(){                                                                  if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.GetActivePM() : "; console.log(  bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetActivePM__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var retval;
            var activeApplet = this.GetActiveApplet();
            retval = activeApplet.GetPModel();
                                                                                                                        if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["GetActivePM__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        /*
         Function GetActivePR: Gets the PR of the active applet
         Inputs: nothing
         Returns: PR instance of active applet
         */
        Blacksheep.prototype.GetActivePR = function(){                                                                  if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.GetActivePR() : "; console.log(  bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetActivePR__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var retval;
            var activeApplet = this.GetActiveApplet();
            retval = activeApplet.GetPModel().GetRenderer();
                                                                                                                        if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["GetActivePR__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        /*
         Function Overdrive: experimental method to override a method at runtime
         Inputs: context (pm, pr or applet), (prototype) method to override, method to act as override
         returns true/false
         */
        Blacksheep.prototype.Overdrive = function(context,proto,method){                                                if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.Overdrive(" +  $.makeArray(JSON.stringify(arguments)).join() + "," + method.constructor.name + ") : "; console.log(  bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["Overdrive__" + proto + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = true;
            var pm = this.ValidateContext(context);
            if (pm){
                switch(proto){
                    //override EndLife of the PR at runtime
                    case "EndLife"    : pm.GetRenderer().constructor.prototype.EndLife = method;
                        break;
                    //register PM bindings at runtime
                    case "FieldChange":
                    case "ShowSelection":
                    case "HandleRowSelect" : pm.AttachPMBinding(proto,method);
                        break;
                    default           : break;
                }
                retval = true;
            }
                                                                                                                        if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["Overdrive__" + proto + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        /*
         Function SetUserPref: sets a user preference within a PM
         Input: PM,PR or Applet; name(key) of the UP; new value
         Output: returns true or false depending on success
         */
        Blacksheep.prototype.SetUserPref = function(context,key,value){                                                 if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.SetUserPref(" +  $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(  bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["SetUserPref__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            //get PM

            var pm = this.ValidateContext(context);
            var retval = false;
            if (pm){
                //do it by the book...
                var prefPS = SiebelApp.S_App.NewPropertySet();
                prefPS.SetProperty(this.GetMsg("UP_KEY"),key);
                prefPS.SetProperty(key,value);
                pm.OnControlEvent(consts.get("PHYEVENT_INVOKE_CONTROL"), pm.Get(consts.get("SWE_MTHD_UPDATE_USER_PREF")), prefPS);
                pm.SetProperty(key,value);
                retval = true;
            }
                                                                                                                        if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["SetUserPref__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        /*
         Function GetUserPref: gets a user preference from a PM
         Input: PM,PR or Applet; name(key) of the UP
         Output: returns the value or null if not found
         */
        Blacksheep.prototype.GetUserPref = function(context,key){                                                       if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.GetUserPref(" +  $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(  bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetUserPref__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = false;
            //get the PM
            var pm = this.ValidateContext(context);
            if (pm){
                //get the user preference
                retval = pm.Get(key);
            }
                                                                                                                        if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["GetUserPref__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };


        /*
         Function Extender: Adds a custom extension container to the core function
         Inputs: function to extend, extension function (must have Extensions container, see plugins for example)
         returns true/false
         */
        Blacksheep.prototype.Extender = function (ext,base){                                                            if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.Extender(" + ext.name + "," + base.name + ") : "; console.log(  bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["Extender__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = false;
            for (var key in base.prototype.Extensions) {
                console.log(this.GetMsg("EXT_FUN",true) + key);
                ext.prototype[key] = base.prototype.Extensions[key];
                retval = true;
            }
                                                                                                                        if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["Extender__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        /*
        Function GetModuleDefinition: Finds module definition by name or searchspec
            Inputs: searchspec(optional) as object (multiple search specs are treated as OR)
            returns module(s) or false
        */
        Blacksheep.prototype.GetModuleDefinition = function (searchobj){                                                            if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.GetModuleDefinition(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(  bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetModuleDefinition__" + searchobj + "__" + aperf]={"Start":aperf,"End":0};}

            var retval = false;
            var match = 0;
            var sc = 0;
            var modules = {};
            var conf;
            if (searchobj.name){
                conf = bsco.GetModule(searchobj.name);
                modules[searchobj.name] = conf;
            }
            else
            {
                conf = bsco.GetModule();
                
                for (m in conf){
                    match = 0;
                    sc = 0;
                    for (s in searchobj){
                        sc++;

                        if (conf[m][s] == searchobj[s]){

                            match++;
                        }

                    }
                    if (match == sc){
                        modules[m] = conf[m];
                    }
                }
            }
            //for (var key in  SiebelAppFacade.Blacksheep.prototype) {
            retval = modules;

            if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["GetModuleDefinition__" + searchobj + "__" + aperf]["End"]=zperf;}
            return retval;
        };

         /*
         function GetScreenName: returns repository def name of active screen or given tab
          */
        Blacksheep.prototype.GetScreenName = function(tab){
                                                                                                                        if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.GetScreenName(" +  $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(  bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetScreenName__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var retval;
            if (typeof(tab) === "undefined"){
                tab = $(".siebui-nav-tabScreen .siebui-active-navtab").first().text();
            }
            var ps = SiebelApp.S_App.GetAppPropertySet();
            ps = ps.GetChild(0).GetChildByType("nncm").GetChildByType("nci").GetChildByType("SI");
            for (i = 0; i < ps.GetChildCount(); i++){
                var type = ps.GetChild(i).GetType();
                if (type == "II"){
                    if (ps.GetChild(i).GetProperty("CP") == tab){
                        retval = ps.GetChild(i).GetProperty("SN");
                    }
                }
            }
                                                                                                                        if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["GetScreenName__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        /*
         Function ProcessWhiteList: evaluates if the current object context matches a whitelist
         Inputs: whitelist; applet object, PM or PR
         Returns: true if matched, false if not matched
         */
        Blacksheep.prototype.ProcessWhiteList = function(wl,context){                                                   if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.ProcessWhiteList(" +  $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(  bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["ProcessWhiteList__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = true;

            //get the PM
            if (context){
                var pm = this.ValidateContext(context);
            }
            //fall back to active PM in case no context is passed
            else {
                pm = this.GetActivePM();
            }
            if(pm){
                var appName = SiebelApp.S_App.GetAppName();
                var resparr = new Array();
                if (typeof(wl.resp) !== "undefined"){
                    resparr = this.GetRespArray(SiebelApp.S_App.GetProfileAttr("Id"),false);
                }
                var screenName = this.GetScreenName();
                var viewName = SiebelApp.S_App.GetActiveView().GetName();
                var appletName = pm.GetObjName();
                var boName = SiebelApp.S_App.GetActiveBusObj().GetName();
                var bcName = pm.Get("GetBusComp").GetName();
                var seq = ["applications","resp","screens","bos","views","bcs","applets"];
                var val = [appName,resparr,screenName,boName,viewName,bcName,appletName];
                var eval = new Array();
                for (i = 0; i < seq.length; i++){
                    eval.push(true);
                }
                if ($.isEmptyObject(wl)){ //empty whitelist, no restrictions
                    retval = true;
                }
                else{
                    for (i = 0; i < seq.length; i++){

                    if (wl[seq[i]] == "all" || typeof(wl[seq[i]]) === "undefined"){
                            eval[i] = true;
                        }

                        else if ($.inArray(val[i],wl[seq[i]]) > -1){
                            eval[i] = true;
                        }

                        else if (seq[i] == "resp"){
                            eval[i] = false;
                            for (j = 0; j < wl[seq[i]].length; j++){
                                if ($.inArray(wl[seq[i]][j],val[i]) > -1){
                                    eval[i] = true;
                                }
                            }
                        }
                        else{
                            eval[i] = false;
                            //return false;
                        }
                    }
                }
                for (var j = 0; j < eval.length; j++){
                    if (eval[j] == false){
                        retval = false;
                    }
                }
            }
                                                                                                                        if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["ProcessWhiteList__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        /*
         Function CreateTrampStamp: Generates the 'Tramp Stamp'
         Requires CSS! See blacksheep.css
         */
        Blacksheep.prototype.CreateTrampStamp = function(options){                                                      if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.CreateTrampStamp(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(  bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["CreateTrampStamp__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = false;
            //set strings
            var ts_class = "blacksheep-trampstamp";
            var stamp = this.GenerateDOMElement("div", {
                class: ts_class,
                title:this.GetMsg("TS_TITLE"),
                id:"bs_ts"
            });
            var bsd = new SiebelAppFacade.BlacksheepDialog();
            var that = this;
            bsd.AddDialogTemplate("TS_MAIN",
                {
                    buttons: [
                        {
                            text: this.GetMsg("BTN_PERF"),
                            click: function() {
                                that.ShowPerformanceSummary();
                            }
                        },
                        {
                            text: this.GetMsg("BTN_CLOSE"),
                            click: function() {
                                $(this).dialog("destroy");
                            }
                        }

                    ],
                    width: 708,
                    height: 500,
                    modal: true,
                    dialogClass: "blacksheep-dialog",
                    //prepare for jquery 1.12 classes replaces dialogClass
                    classes: {"ui-dialog" : "blacksheep-dialog"},
                    title: this.GetMsg("TS_DLG_TITLE"),
                    //blacksheep specific properties
                    bs_html:this.GetMsg("TS_MAIN"),
                    bs_function:"BuildDialogTSMAIN"
                },
                true );



            stamp.click(function() {
                if ($("." + ts_class).length > 0){
                    that.ShowDialog("TS_MAIN");
                }
            });
            retval = stamp;
                                                                                                                        if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["CreateTrampStamp__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        /*
         Function ShouldItExist: Helper function to check if an object and its main function exist and are enabled
         */
        Blacksheep.prototype.ShouldItExist = function(obj,func){
            var bsc = bsco.GetConfig();
                                                                                                                        if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.ShouldItExist(" +  $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(  bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["ShouldItExist__" + func + "__" + aperf]={"Start":aperf,"End":0};}

            
            var retval = false;
            var moddef = bsco.GetModule(func);


            if (typeof(obj) === "undefined" && bsc && bsc.enabled == "yes"){
                if (typeof(moddef) === "undefined"){
                    retval = true;
                }
                else{
                    if (moddef.enabled == "yes"){
                        retval = true;
                    }
                }
            }


                                                                                                                           if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["ShouldItExist__" + func + "__" + aperf]["End"]=zperf;}
            return retval;
        };

         /*
         function GetWhiteList: returns the whitelist definiton for a given module
          */
         Blacksheep.prototype.GetWhiteList = function(module_name){
                                                                                                                        if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.GetWhiteList(" +  $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(  bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetWhiteList__" + module_name + "__" + aperf]={"Start":aperf,"End":0};}
             var retval = false;
             var wl = {};
             if (module_name != "" && bsc["modules"][module_name]){
                 wl = bsc["modules"][module_name].whitelist;
             }
             if (typeof(wl) === "undefined"){
                 retval = {};
             }
             else{
                 retval = wl;
             }

                                                                                                                        if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["GetWhiteList__" + module_name + "__" + aperf]["End"]=zperf;}
             return retval;
         };
         /*
         function GetSavedModuleOptions: returns saved (user defined) options for a module in the given context
          */

         Blacksheep.prototype.GetSavedModuleOptions = function(context,modname,isctrl){
             if (bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.GetSavedModuleOptions(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetSavedModuleOptions__" + modname + "__" + aperf]={"Start":aperf,"End":0};}
             var retval = {};
             var pm = this.ValidateContext(context);
             if (typeof(isctrl) === "undefined"){
                 isctrl = false;
             }
             if (!isctrl){
                 var m_opt = {};
                 var c_opt;
                 var p_opt;
                 //get current moddef value
                 var moddef = SiebelAppFacade.BlacksheepConfig.config.modules[modname];
                 var uo = moddef.useroptions;
                 for (u in uo){
                     if (u != "storage_default"){
                         m_opt[u] = uo[u].value;
                     }
                 }
                 //check cookie value
                 var cookiename = this.GetMsg("COOKIE_MOD_PRE") + modname + this.GetMsg("COOKIE_MOD_OPT");
                 var cval = $.cookie(cookiename);
                 if (typeof(cval) !== "undefined"){
                     c_opt = JSON.parse(cval);
                 }
                 else{
                     c_opt = {};
                 }
                 //check userpref value
                 var opt_name = this.GetMsg("PMPROP_MOD_PREFIX") + modname + this.GetMsg("PMPROP_MOD_OPT");
                 var pval = this.GetUserPref(pm,opt_name);
                 if (typeof(pval) !== "undefined" && pval != ""){
                     pval = pval.replace(/&quot;/g,"\"");
                     p_opt = JSON.parse(pval);
                 }
                 else{
                     p_opt = {};
                 }
                 //check module native options
                 if (!$.isEmptyObject(m_opt)){
                     retval = m_opt;
                     retval.source = "moddef";
                 }
                 //check if we have cookie storage
                 if (!$.isEmptyObject(c_opt)){
                     //cookie overrules module definition
                     retval = c_opt;
                     retval.source = "cookie";
                 }
                 //any user preference for this applet PM only?
                 if (!$.isEmptyObject(p_opt)){
                     //userpref overrules cookie
                     retval = p_opt;
                     retval.source = "userpref";
                 }
             }
             else{
                 //get control useroptions
                 //get current values
                 
                 var an = pm.GetObjName();
                 var sn = this.GetMsg("COOKIE_MOD_PRE") + modname + "_" + an  + "_CONTROL_OPTIONS";
                 var store = localStorage.getItem(sn);
                 if (store != null){
                     scopt = JSON.parse(store);
                     retval = scopt;
                     retval.source = "localstorage"
                 }
                 else{
                     var controls = SiebelAppFacade.BlacksheepConfig.config.modules[modname].controls;
                     //var an = pm.GetObjName();
                     var mcopt = {};
                     var scopt;
                     //storage: Appletname|controlname|prop:value
                     //moddef: Appletname|controlname.useroptions.prop.value
                     //var uo = moddef.useroptions;
                     for (co in controls){
                         for (prop in controls[co].useroptions){
                             if (controls[co].useroptions[prop].scope == "Control"){
                                 uon = co + "|" + prop;
                                 mcopt[uon] = controls[co].useroptions[prop].value;
                             }
                         }

                     }
                     retval = mcopt;
                     retval.source = "controlopts"

                 }




             }
             if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["GetSavedModuleOptions__" + modname + "__" + aperf]["End"]=zperf;}
             return retval;
         };

         /*
         function InitWhiteList: example for a function that returns an array
         to be referenced in whitelist definition
         This example retrieves applets for a given searchspec
          */
         Blacksheep.prototype.InitWhiteList = function(inp){
             
             if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.InitWhiteList(" +  $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(  bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["InitWhiteList__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
             var retval = false;
             var modname = inp.module;
             var item = inp.item;
             var searchspec = inp.options.searchspec;
             searchspec += " AND [Repository Id] = '" + this.GetRepositoryId() + "' AND [Inactive] <> 'Y'";
             var arr = new Array();
             var key = this.GetMsg("WL_STORAGE_PREFIX") + item + "_" + modname;
             var insessionstorage = false;
             //check session storage for faster retrieval
             var applist = sessionStorage.getItem(key);
             if (applist != null){
                 arr = applist.split("|");
                 insessionstorage = true;
             }
             if (!insessionstorage){
                 //ok, we have to query the database
                 var bo = "";
                 var bc = "";
                 switch (inp.item){
                     case "applets" : bo = bc = "Repository Applet";
                         break;
                     default: break;
                 }
                 var temp = this.DataRetriever(bo,bc,searchspec,"Id",{"Name":""},{viewmode:3,log:false});
                 for (j = 0; j < temp.GetChildCount(); j++){
                     arr.push(temp.GetChild(j).GetProperty("Name"));
                 }
                 //write to session storage for next time
                 sessionStorage.setItem(key,arr.join("|"));
             }
             retval = arr;
             if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["InitWhiteList__" + "()" + "__" + aperf]["End"]=zperf;}
             return retval;
         };

         /*
         function AutoStart: to be invoked from e.g. postload.
         Launches all modules that have autostart:true
          */
         Blacksheep.prototype.AutoStart = function(){
             if ( bsc.debug == "yes") { var a=Date.now(); var f=" : function Blacksheep.prototype.AutoStart(" +  $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(  bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["AutoStart__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
             var retval = false;
             var modules = this.GetModuleDefinition({"enabled":"yes","autostart":"yes"});
             for (mod in modules){
                 //Load modules with applet scope for each applet in current view
                 if ($.inArray("Applet",modules[mod].scope) > -1){
                     var appletmap = SiebelApp.S_App.GetActiveView().GetAppletMap();
                     for (applet in appletmap){
                         SiebelAppFacade.Blacksheep.prototype[mod].call(this,applet);
                     }
                 }
                 if ($.inArray("Application",modules[mod].scope) > -1 || $.inArray("View",modules[mod].scope) > -1){
                     SiebelAppFacade.Blacksheep.prototype[mod].call(this);
                 }
             }
             retval = true;
             if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["AutoStart__" + "()" + "__" + aperf]["End"]=zperf;}
             return retval;
         };

        //var bsm = new SiebelAppFacade.BlacksheepMsg();

        console.log(bsm.GetMessage("INIT_SUCCESS",true));
        retval = Blacksheep;
                                                                                                                        if ( bsc.debug == "yes") { var z = Date.now(); console.log(  bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
        return retval;
    }();
}

var bs_zz=Date.now(); console.log("blacksheep.js : debugger : " + bs_zz + " : file " + "blacksheep.js : loaded : time(ms): " + parseInt(bs_zz-bs_aa)); blacksheep_perf_file_load["blacksheep.js"] = parseInt(bs_zz-bs_aa); bs_zz = bs_aa = bs_z = bs_a = null;
