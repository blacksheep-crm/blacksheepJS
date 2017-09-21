/*******************************************************************
 * File:          blacksheep-autocomplete.js
 * Author:        Alexander Hansal (alex@blacksheep-crm.com)
 * Description:   Autocomplete deluxe for blacksheep.js, a professional utility library and API extension for Oracle Siebel CRM.
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


var bs_a=Date.now(); console.log("blacksheep.js : debugger : " + bs_a + " : file " + "blacksheep-autocomplete.js : loading");

var blacksheepAutocompleteModule = "Autocomplete";  //optional (global) variable for the module main function
//the bsco object is already instantiated by the core code, so we can use it
bsco.AddModule(blacksheepAutocompleteModule, //the name of the module
    {  //the JSON object with the configuration
        file : "blacksheep-autocomplete.js", //name of the file that contains the module definition
        enabled : "yes",  //is the module enabled or not?
        mandatory : "no",  //is the module mandatory? This should be "no" for a custom extension
        autostart : "yes",
        //next lines use message types
        // message types must be added to the blacksheep message array (see the SetMsg method calls below)
        label : "MOD_AUTOCOMPLETE_LABEL", //the message type for the translatable display name (e.g. on user preferences dialog)
        description : "MOD_AUTOCOMPLETE_DESC", //the message type for the translatable module description
        dependencies : ["core","BlacksheepStateTracker"], //dependencies for this module. This is an array of other modules (see blacksheep-conf.js for OOB modules)
        userconfig : "yes", //is this module configurable by the user? if "yes", it is displayed in the user preferences dialog.
        scope : ["Applet","Control"], //the scope(s) of this module. This is an array. Valid values are "Application","View","Applet","Control"
        pre_function : "cleanup", //the name of a function to be invoked before the main functionality (see below for an example). Usually for removing DOM manipulations.
        //useroptions allow you to define user-configurable details. The example defines a custom text entry field (used in the main code below).
        useroptions : {
            "autoscan":{
                "description":"MOD_AUTOCOMPLETE_SCAN",  //translatable description, used as label in the options dialog
                "type" : "text",
                "widget" : ["lov","LOV_YES_NO"],
                "value" : "yes",         //value at runtime, initialized with default
                "default" : "yes",        //default value
                "scope" : "Applet"
            },
            "enable_ctrl":{
                "description":"MOD_AUTOCOMPLETE_ECTRL",  //translatable description, used as label in the options dialog
                "type" : "text",
                "widget" : ["lov","LOV_YES_NO"],
                "value" : "yes",         //value at runtime, initialized with default
                "default" : "yes",        //default value
                "scope" : "Control"
            },
            "autoquery":{
                "description":"MOD_AUTOCOMPLETE_QUERY",  //translatable description, used as label in the options dialog
                "type" : "text",
                "widget" : ["lov","LOV_UX_AUTOQUERY"],
                "value" : "contains",         //value at runtime, initialized with default
                "default" : "contains",        //default value
                "scope" : "Control"
            },
            "autosens":{
                "description":"MOD_AUTOCOMPLETE_SENS",  //translatable description, used as label in the options dialog
                "type" : "text",
                "widget" : ["lov","LOV_UX_AUTOSENS"],
                "value" : "caseinsensitive",         //value at runtime, initialized with default
                "default" : "caseinsensitive",        //default value
                "scope" : "Control"
            },
            "minlen":{
                "description":"MOD_AUTOCOMPLETE_MIN",  //translatable description, used as label in the options dialog
                "type" : "text",
                "widget" : ["lov","LOV_AUTO_MINLENGTH"],
                "value" : "3",         //value at runtime, initialized with default
                "default" : "3",        //default value
                "scope" : "Control"
            },
            "operator":{
                "description":"MOD_AUTOCOMPLETE_OP",  //translatable description, used as label in the options dialog
                "type" : "text",
                "widget" : ["lov","LOV_AUTO_OP"],
                "value" : "NO",         //value at runtime, initialized with default
                "default" : "NO",        //default value
                "scope" : "Control"
            },
            "fieldlist":{
                "description":"MOD_AUTOCOMPLETE_FIELDLIST",  //translatable description, used as label in the options dialog
                "type" : "text",
                "value" : "popup",         //value at runtime, initialized with default
                "default" : "popup",        //default value
                "scope" : "Control"
            },

            "storage_default" : "userpref"},   //this parameter drives the default state for the checkbox to save options for the current object ("userpref") or all objects ("all");
        //the optional whitelist definition. If a whitelist definition is available, the module will only be executed for the objects listed
        //keyword "all" is supported to put all objects of the same type in the whitelist
        //if you omit an entry in the whitelist, it is treated like "all"

        whitelist : {
            "applications":["Siebel Universal Agent"],  //array of Application definitions (as in Siebel Repository)
            "screens":["Accounts Screen","Contacts Screen","Opportunities Screen"]  //array of Screens
            //"applets":["LS Medical Agreement Detail Applet","Opportunity Form Applet - Child","SIS Account Entry Applet","Opportunity Form Applet - Child Big"]//array of Applet definitions

        }},
    true //override any existing module definition with the same name?
);


if (SiebelAppFacade.Blacksheep.prototype.ShouldItExist(SiebelAppFacade.BlacksheepAutocomplete,blacksheepAutocompleteModule))  {



    //We're good citizens, so we add the object to the SiebelAppFacade namespace
    SiebelJS.Namespace("SiebelAppFacade.BlacksheepAutocomplete");

    //The object declared as a function
    SiebelAppFacade.BlacksheepAutocomplete = function () {

//look to your right to see the debug blocks. You can enable/disable debug mode in blacksheep-conf.js
//out of the box, we have a debug message at the beginning and at the end of each function and/or file
//notice that we establish variables a (begin time in ms), f (file/function name) and z (end time in ms),
//so DO NOT declare variables named a,f or z in your code!
//it is recommended to keep the debug blocks. If you decide to remove them, make sure you remove the begin and end blocks
//correctly to avoid run-time errors.

        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function SiebelAppFacade.BlacksheepAutocomplete() : "; console.log(bsd + a + f + "begin"); }
        //The constructor function
        function BlacksheepAutocomplete() { console.log(this.GetMsg("INIT_CONSTR",true) + "BlacksheepAutocomplete"); }
        //local instance of Blacksheep
        var bs = new SiebelAppFacade.Blacksheep();
        //get the module definition for later reference
        var md = bsco.GetModule(blacksheepAutocompleteModule);

        //controls controlled by this module;

        //if your module needs translatable strings, you must define them now
        //see the example below for German and any other language
        bs.SetMsg(md.label,"Auto Vervollständigung","deu");
        bs.SetMsg(md.description,"Vereinfachte Dateneingabe, zufriedenere User.","deu");
        bs.SetMsg(md.useroptions.autoquery.description, "Abfragemodus","deu");
        bs.SetMsg(md.useroptions.autosens.description, "Abfrageempfindlichkeit","deu");
        bs.SetMsg(md.useroptions.minlen.description, "Mindestanzahl Zeichen","deu");
        bs.SetMsg(md.useroptions.autoscan.description, "Felder für Auto-Vervollständigen automatisch finden: ","deu");
        bs.SetMsg(md.useroptions.enable_ctrl.description, "Aktiv","deu");
        bs.SetMsg(md.useroptions.operator.description, "Operator","deu");
        bs.SetMsg("LOV_UX_AUTOQUERY",{"begins":"Beginnt mit","contains":"Enthält"},"deu");
        bs.SetMsg("LOV_AUTO_OP",{"OR":"ODER","AND":"UND","NO":"(kein)"},"deu");
        bs.SetMsg(md.useroptions.fieldlist.description, "Anzeigefelder","deu");
        bs.SetMsg("LOV_UX_AUTOSENS",{"casesensitive":"Groß-/Kleinschreibung berÜckSichTigen (schneller)","caseinsensitive":"Groß-/Kleinschreibung egal (langsamer)"},"deu");
        bs.SetMsg("LOV_AUTO_MINLENGTH",{2:"2",3:"3",4:"4",5:"5"},"deu");

        bs.SetMsg(md.label,"Autocomplete Deluxe","enu");
        bs.SetMsg(md.description,"Easier data input, happier end users.","enu");
        bs.SetMsg(md.useroptions.autoscan.description, "Find autocomplete fields automatically: ","enu");
        bs.SetMsg(md.useroptions.autoquery.description, "Query Mode","enu");
        bs.SetMsg(md.useroptions.minlen.description, "Minimum input length","enu");
        bs.SetMsg(md.useroptions.autosens.description, "Sensitivity","enu");
        bs.SetMsg(md.useroptions.enable_ctrl.description, "Active","enu");
        bs.SetMsg(md.useroptions.fieldlist.description, "Display Fields","enu");
        bs.SetMsg(md.useroptions.operator.description, "Operator","enu");
        bs.SetMsg("LOV_UX_AUTOQUERY",{"begins":"Begins with","contains":"Contains"},"enu");
        bs.SetMsg("LOV_AUTO_OP",{"OR":"OR","AND":"AND","NO":"(none)"},"enu");
        bs.SetMsg("LOV_UX_AUTOSENS",{"casesensitive":"Case seNsiTivE (faster)","caseinsensitive":"case insensitive (slower)"},"enu");
        bs.SetMsg("LOV_AUTO_MINLENGTH",{2:"2",3:"3",4:"4",5:"5"},"enu");

        //In blacksheep.js, we use our own Extender function to add extension functions to the core module
        //So we declare a container object that will hold all functions we define
        var extensions = {};

        //This is the main function (aka module). All blacksheep.js modules should have at least one argument which
        //references the 'context', which usually is a PM, a PR or an object (applet,control) instance
        //see the documentation on context validation
        extensions.Autocomplete = function(context){
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepAutocomplete.prototype.Autocomplete(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["Autocomplete__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            //we should always have a variable retval to hold the return value, usually defaults to false
            var retval = false;

            //It is recommended to keep the following lines to establish a proper module
            //first, we store the module name as a variable so we can reuse it
            var modname = blacksheepAutocompleteModule;

            //then we check if a whitelist exists for the module (see blacksheep-conf.js for example whitelists)
            var wl = bs.GetWhiteList(modname);

            //and we can now process the whitelist
            //if you do not wish to use the whitelisting feature, simply set is_whitelisted = true;

            var is_whitelisted = bs.ProcessWhiteList(wl,context); //pass context as second parameter if you have it, defaults to active PM

            //most functions will require a pm instance so we start with a variable to hold it
            var pm = null;

            //we undo all changes that we implement
            //for example, our module implements a click event handler, so we make sure to remove it
            //we can use the module definition to specify a 'pre' function in the prototype, so this
            //can be externalized nicely
            BlacksheepAutocomplete.prototype[md.pre_function].call(this,bs.ValidateContext(context));

            //when we get inside the next if block, the module is whitelisted for the current context.
            if (is_whitelisted){

                //object is in whitelist, put everything you want to execute in this block
                //for example, we can put a message to the console...
                console.log(bs.GetMsg("WL_TRUE",true) + modname + ", " + bs.GetActivePM().Get("GetName"));

                //now let's verify the context
                if (typeof(context) !== "undefined"){
                    //if we reach this, we have a context argument
                    //let's validate it
                    pm = bs.ValidateContext(context);
                }
                else{
                    //if we reach this, no context has been passed
                    //so we have to get one, what about the active PM?
                    pm = bs.GetActivePM();
                    //actually, the value of pm can be anything (e.g. simply true)
                    //what the pm is, depends on what you want to achieve in the next block
                }
                if (pm){
                    //OK, we have a pm, let's get on with it

                    //if your module is user configurable, you should keep the following lines
                    var propname = bs.GetMsg("PMPROP_MOD_PREFIX") + modname;  //the prefix of the user preference name
                    var propsys = bs.GetMsg("PMPROP_MOD_SYS"); //the 'system' suffix
                    var propuser = bs.GetMsg("PMPROP_MOD_USER"); //the 'user' suffix

                    //see if the module has been enabled/disabled by the user already
                    var is_user_enabled = bs.GetUserPref(pm,propname + propuser);

                    //anyway, the module is system enabled (i.e. enabled and whitelisted) so we can set the system property
                    //note that this needs a proper PM
                    pm.SetProperty(propname + propsys,true);

                    //now we check if the module is enabled by the user
                    if (typeof(is_user_enabled) === "undefined" || is_user_enabled == "true" || is_user_enabled == true){

                        //******************************************************************************************
                        //   CUSTOM CODE STARTS HERE
                        //******************************************************************************************

                        bs.ShowAutocomplete(pm);

                        bs.SetUserPref(pm,propname + propuser,true);
                        retval = true;

                        //******************************************************************************************
                        //   CUSTOM CODE ENDS HERE
                        //******************************************************************************************

                    }
                    else{
                        //if we are here, the user has disabled the module
                        console.log(modname + bs.GetMsg("PMPROP_DISABLED"));
                    }
                }


            }
            else{
                //object is not in whitelist
                console.log(bs.GetMsg("WL_FALSE",true) + modname + ", " + bs.GetActivePM().Get("GetName"));
            }
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes"){var zperf = Date.now(); blacksheep_perf_function_call["Autocomplete__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        //******************************************************************************************
        //   CUSTOM CODE STARTS HERE
        //******************************************************************************************

        //Add custom functions here as needed, best to copy/paste the template function from above
        //an extension function (available via the Blacksheep main object) would look like this
        /*
         extensions.CustomExtension = function(){
         var retval = false
         if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepAutocomplete.prototype.CustomExtension(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["CustomExtension__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
         //do something clever here
         if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes"){var zperf = Date.now(); blacksheep_perf_function_call["CustomExtension__" + "()" + "__" + aperf]["End"]=zperf;}
         return retval;
         };
         */
        extensions.ShowAutocomplete = function(context){
            var retval = false
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepAutocomplete.prototype.ShowAutoComplete(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["ShowAutoComplete__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var pm = bs.ValidateContext(context);

            var u_opt = bs.GetSavedModuleOptions(pm,blacksheepAutocompleteModule);
            var is_autoscan = !!(u_opt.autoscan == "yes");

            if (!is_autoscan){
                //TODO: Retrieve autocomplete config from userprop or DB
            }
            else{
                bs.AutoScan(pm);
            }


            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes"){var zperf = Date.now(); blacksheep_perf_function_call["ShowAutoComplete__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        extensions.GetControlByFieldName = function(context,fieldname){
            var retval = false
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepAutocomplete.prototype.GetControlByFieldName(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetControlByFieldName__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var pm = bs.ValidateContext(context);
            var theControl = null;
            var controls = pm.Get("GetControls");
            for (co in controls){
                if (controls[co].GetFieldName() == fieldname){
                    theControl = controls[co];
                }
            }

            retval = theControl;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes"){var zperf = Date.now(); blacksheep_perf_function_call["GetControlByFieldName__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        extensions.AssociateMVG = function(context,fieldname,rowid){

            var retval = false
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepAutocomplete.prototype.AssociateMVG(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["AssociateMVG__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var pm = bs.ValidateContext(context);

            var bc = pm.Get("GetBusComp").GetName();
            var oSvc = SiebelApp.S_App.GetService("blacksheep Data Retriever");
            var ips = SiebelApp.S_App.NewPropertySet();
            ips.SetProperty("Business Component",bc);
            ips.SetProperty("rowid", rowid);
            ips.SetProperty("Field",fieldname);

            var ops = oSvc.InvokeMethod("Associate",ips);


            retval = true;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes"){var zperf = Date.now(); blacksheep_perf_function_call["AssociateMVG__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        extensions.GetPopupAppletInfo = function(context,control){
            var retval = false
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepAutocomplete.prototype.GetPopupAppletInfo(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetPopupAppletInfo__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var pm = bs.ValidateContext(context);

            var an = pm.Get("GetName");
            var cn;
            var cprops;
            
            if (bs.GetAppletType(pm) == bs.GetMsg("TYPE_LIST")){
                cn = control.GetFieldName();
                cprops = bs.GetRepoProperties("List Column","[Field] = '" + cn + "' AND [GParent Name] = '" + an + "'");
            }
            else{
                cn = control.GetName();
                cprops = bs.GetRepoProperties("Control","[Name] = '" + cn + "' AND [Parent Name] = '" + an + "'");
            }
            var mvgapplet = cprops[cn]["MVG Applet"];
            var pickapplet = cprops[cn]["Pick Applet"];
            var assocapplet;
            var pan = "";
            var type = "";
            if (mvgapplet != ""){
                var mprops = bs.GetRepoProperties("Applet",mvgapplet);
                assocapplet = mprops[mvgapplet]["Associate Applet"];
            }
            if (typeof(assocapplet) !== "undefined"){
                if (assocapplet != ""){
                    pan = assocapplet;
                    type = "Assoc";
                }
            }
            else if (mvgapplet != ""){
                pan = mvgapplet;
                type = "Mvg";
            }
            else if (pickapplet != ""){
                pan = pickapplet
                type = "Pick";
            }
            var lcps = bs.DataRetriever("Repository Details","Repository List Column","[Repository Id] = '" + bs.GetRepositoryId() + "' AND [Inactive] <> 'Y' AND [Show In List] <> 'N' AND [Field] IS NOT NULL AND [GParent Name]='" + pan + "'","Id",{"Field":""},{viewmode:3,log:"false"});

            var popfields = new Array();

            for (i = 0; i < lcps.GetChildCount(); i++){
                popfields.push(lcps.GetChild(i).GetProperty("Field"));
            }
            var response = {};
            response["Applet Type"] = type;
            response["Applet Name"] = pan;
            response["Fields"] = popfields;
            retval = response;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes"){var zperf = Date.now(); blacksheep_perf_function_call["GetPopupAppletInfo__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        extensions.AutoScan = function(context){
            var retval = false;
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepAutocomplete.prototype.AutoScan(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["AutoScan__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var pm = bs.ValidateContext(context);
            var pr = pm.GetRenderer();
            var ce;

            if (typeof(SiebelAppFacade.BlacksheepConfig.config.modules[blacksheepAutocompleteModule].controls) === "undefined"){
                SiebelAppFacade.BlacksheepConfig.config.modules[blacksheepAutocompleteModule].controls = {};
            }

            var mcontrols = SiebelAppFacade.BlacksheepConfig.config.modules[blacksheepAutocompleteModule].controls;
            //find pick fields
            var controls = pm.Get("GetControls");
            //var bcname = "";
            //var fieldname = "";
            var lov = [];
            var cid;

            for (co in controls){
                var success = false;
                var theControl = controls[co];
                var ctype =theControl.GetUIType();
                if (ctype == "Pick" || ctype == "Mvg"){


                    cid = pm.GetObjName() + "|" + theControl.GetName();
                    mcontrols[cid] = {};
                    mcontrols[cid].obj = theControl;
                    if (typeof(mcontrols[cid].useroptions) === "undefined"){
                        mcontrols[cid].useroptions = SiebelAppFacade.BlacksheepConfig.config.modules[blacksheepAutocompleteModule].useroptions;
                    }
                    success =  bs.AddAutoComplete(pm,theControl,lov);


                }

            }
            var an = pm.GetObjName();
            var ln = bs.GetMsg("COOKIE_MOD_PRE") + blacksheepAutocompleteModule + "_" + an  + "_CONTROL_OPTIONS";
            var lsdat = JSON.parse(localStorage.getItem(ln));

            if (lsdat == null || $.isEmptyObject(lsdat)){
                
                //bootstrap local storage
                var opts = {};
                var cds = SiebelAppFacade.BlacksheepConfig.config.modules[blacksheepAutocompleteModule].controls;
                for (ct in cds){
                    if (ct.split("|")[0] == an){
                    var uos = cds[ct].useroptions;
                    for (uo in uos){
                        if (uos[uo].scope == "Control"){
                            var oname = ct + "|" + uo;
                            opts[oname] = uos[uo].value;
                        }
                    }
                    }
                }

                localStorage.setItem(ln,JSON.stringify(opts));

            }
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes"){var zperf = Date.now(); blacksheep_perf_function_call["AutoScan__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };


        extensions.GetPickValues = function(context,control,refresh,filter,queryfield,auxfields,op){
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepAutocomplete.prototype.GetPickValues(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetPickValues__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var pm = bs.ValidateContext(context);
            if (typeof(pm.Get("BLACKSHEEP_STATE")) !== "undefined"){
                var pmstate =  pm.Get("BLACKSHEEP_STATE");
            }
            var rowid;
            if (pmstate == "AFTER_NewRecord" || pmstate == "AFTER_PostChanges" || pmstate == "AFTER_FieldChange"){
                rowid = pm.Get("GetBusComp").GetIdValue();
            }

            var retval = false;
            var ctype = control.GetUIType();
            var svc = SiebelApp.S_App.GetService("blacksheep Data Retriever");
            var ips = SiebelApp.S_App.NewPropertySet();
            var bcname = control.GetApplet().GetBusComp().GetName();
            var fieldname = control.GetFieldName();
            var searchspec = " IS NOT NULL";
            var ops;
            var an = pm.GetObjName();
            var cn = control.GetName();
            
            ips.SetProperty("Business Component",bcname);
            ips.SetProperty("Field",fieldname);
            if (typeof(rowid) !== "undefined"){
                ips.SetProperty("NewId",rowid);
            }
            ips.SetProperty("Filter",filter);
            if (typeof(queryfield) !== "undefined"){
                ips.SetProperty("queryfield", queryfield);
            }
            if (typeof(auxfields) === "undefined"){
                auxfields = "popup";
            }
            if (typeof(op) === "undefined"){
                op = "";
            }
            if (op == "NO"){
                op = "";
            }
            var bl;
            auxfields = auxfields.split(",");
            var auxfieldlist;

            if (auxfields[0] == "popup"){

                var cpopinfo = bs.GetPopupAppletInfo(context,control);
                auxfieldlist = cpopinfo["Fields"];

                if (auxfields.length > 1){
                    for (k = 1; k < auxfields.length; k++){
                        if ($.inArray(auxfields[k],auxfieldlist) == -1){
                            auxfieldlist.push(auxfields[k]);
                        }
                    }
                }

            }
            else if (auxfields[0] != "popup" && auxfields.length > 0){
                auxfieldlist = auxfields;
            }
            if (localStorage.getItem("BLACKSHEEP_AUTOCOMPLETE_BLACKLIST") != null){
                bl = localStorage.getItem("BLACKSHEEP_AUTOCOMPLETE_BLACKLIST");
                bl = bl.split("|");
                for (i = 0; i < bl.length; i++){
                    for (j = 0; j < auxfieldlist.length; j++){
                        if (bl[i].indexOf(auxfieldlist[j]) > 0){
                            auxfieldlist.splice(auxfieldlist[j]);
                        }
                    }
                }
            }
            ips.SetProperty("Auxiliary Fields",auxfieldlist.join("|"));
            ips.SetProperty("Field Type",ctype);
            ips.SetProperty("Operator",op);

            ops = svc.InvokeMethod("GetPickValues",ips);

            //check for errors
            if (ops.GetProperty("Status") == "Error"){
                var errtext = ops.GetChildByType("Errors").GetChild(0).GetProperty("ErrMsg");
                if (errtext.indexOf("00119") > -1){
                    if (localStorage.getItem("BLACKSHEEP_AUTOCOMPLETE_BLACKLIST") == null){
                        localStorage.setItem("BLACKSHEEP_AUTOCOMPLETE_BLACKLIST","");
                    }

                    localStorage.setItem("BLACKSHEEP_AUTOCOMPLETE_BLACKLIST",localStorage.getItem("BLACKSHEEP_AUTOCOMPLETE_BLACKLIST") + "|" + errtext);
                }

            }

            var cname = "BLACKSHEEP_AUTOCOMPLETE_QFIELD_" + bcname + "_" + fieldname;
            if (typeof(queryfield) === "undefined"){
                queryfield = ops.GetChild(0).GetProperty("queryfield");
                if (typeof(queryfield) !== "undefined"){
                    $.cookie(cname,queryfield,{expires:999});
                }
            }
            var res = ops.GetChild(0);
            var lov = res.GetProperty("LOV").split("|");
            var c = res.GetProperty("Record Count");

            //read child prop sets into JSON
            var vals = new Array();
            for (i = 0; i < c; i++){
                var record = {};
                var lbl = res.GetChild(i).GetProperty(queryfield);
                if (auxfieldlist){
                    var tlbl = "";

                    for (j = 0; j < auxfieldlist.length; j++){
                        record[auxfieldlist[j]] =  res.GetChild(i).GetProperty(auxfieldlist[j]);

                        if (auxfieldlist[j] != queryfield){

                            if ( res.GetChild(i).GetProperty(auxfieldlist[j]) != ""){
                                if (tlbl == ""){
                                    tlbl += " (";
                                }
                                tlbl += res.GetChild(i).GetProperty(auxfieldlist[j]);
                                if ((j+1) != auxfieldlist.length){
                                    tlbl += ", ";
                                }
                            }
                        }
                    }
                    if (tlbl.substring(tlbl.length-2) == ", "){
                        tlbl = tlbl.substring(0,tlbl.length-2);
                    }
                    if (tlbl != ""){
                        tlbl += ")";
                    }

                }
                record.hd = lbl;
                record.aux = tlbl;
                record.label = lbl + tlbl;
                record.value = res.GetChild(i).GetProperty(queryfield);
                record.Id = res.GetChild(i).GetProperty("Id");
                vals.push(record);
            }



            var cname = "BLACKSHEEP_AUTOCOMPLETE_QFIELD_" + bcname + "_" + fieldname;
            if (typeof(queryfield) === "undefined"){
                queryfield = ops.GetChild(0).GetProperty("queryfield");
                if (typeof(queryfield) !== "undefined"){
                    $.cookie(cname,queryfield,{expires:999});
                }
            }

            retval = vals;

            //retval = true;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["GetPickValues__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;

        };

        extensions.AddAutoComplete = function(context,control,lov){

            var retval = false;
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepAutocomplete.prototype.AddAutoComplete(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["AddAutoComplete__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}

            var pm = bs.ValidateContext(context);


            var pr = pm.GetRenderer();
            var ctype = control.GetUIType();
            var cname = control.GetName();
            var an = pm.GetObjName();
            var ace = pr.GetUIWrapper(control).GetEl();

            var u_opt = bs.GetSavedModuleOptions(pm,blacksheepAutocompleteModule,true);
            var pref = an + "|" + cname + "|";

            var beg = u_opt[pref + "autoquery"] == "contains" ? "*" : "";
            var sens = u_opt[pref + "autosens"] == "caseinsensitive" ? "~" : "";

            var minlen = u_opt[pref + "minlen"] != "" ? parseInt(u_opt[pref + "minlen"]) : 0;
            var enabled = u_opt[pref + "enable_ctrl"] == "no" ? false : true;
            var fieldlist = u_opt[pref + "fieldlist"];

            var op = u_opt[pref + "operator"];

            if (enabled) {
                if(ctype == "Pick"){
                    $(ace).addClass("blacksheep-autocomplete-pick");
                }
                if(ctype == "Mvg"){
                    $(ace).addClass("blacksheep-autocomplete-mvg");
                    $(ace).removeAttr("aria-readonly");
                    $(ace).removeAttr("readonly");
                    //unbind keydown handler (workaround to enable backspace key...)
                    $(ace).unbind("keydown");
                    //quick reset to writeable on focus
                    $(ace).focus(function(e){
                        //make input writable
                        if($(this).attr("readonly") == "readonly"){
                            $(this).removeAttr("aria-readonly");
                            $(this).removeAttr("readonly");
                            //unbind keydown handler (workaround to enable backspace key...)
                            $(this).unbind("keydown");
                        }
                    });
                }
                else{
                    $(ace).addClass("blacksheep-autocomplete-pick");
                }
                //ctrl click handler
                $(ace).click(function(e){
                    if (e.ctrlKey){
                        e.stopImmediatePropagation();
                        bs.ShowControlOptionsDialog(pm,blacksheepAutocompleteModule,control,this);
                    }
                });
                $(ace).autocomplete({
                    source: autocompleteme,
                    focus:function(e,ui){
                        $(ace).val(ui.item.value);
                        return false;
                    },
                    select:function(e,ui) {
                        var pmstate = pm.Get("BLACKSHEEP_STATE");
                        var rowid = ui.item.Id;
                        if (pmstate != "AFTER_NewQuery"){
                            if (ctype == "Mvg"){
                                bs.AssociateMVG(pm,control.GetFieldName(),rowid);
                            }
                        }


                        return false;
                    }
                })
                    .autocomplete( "instance" )._renderItem = function( ul, item ) {
                    
                    var term = this.term;
                    var hs = 0;
                    var it;
                    if (typeof(item.hd) !== "undefined"){
                        it = item.hd;
                    }
                    else{
                        it = item.value;
                    }
                    if (sens == "~"){
                        term = term.toLowerCase();
                        hs = it.toLowerCase().indexOf(term);
                    }
                    else{
                        hs = it.indexOf(term);
                    }
                    if (typeof(item.hd) === "undefined"){
                        hs = it.toLowerCase().indexOf(term);
                    }
                    var he = 0;
                    var hd = "";
                    var aux = "";
                    if (hs > -1){
                        he = hs + term.length;
                            hd = it.substring(0,hs) + "<span class='blacksheep-autocomplete-highlight-hd'>" + it.substring(hs,he) + "</span>" + it.substring(he,it.length);

                    }
                    else{
                        hd = it;
                    }

                    if (typeof(item.aux) !== "undefined"){
                    if (sens == "~"){
                        term = term.toLowerCase();
                        hs = item.aux.toLowerCase().indexOf(term);
                    }
                    else{
                        hs = item.aux.indexOf(term);
                    }
                    if (hs > -1){
                        he = hs + term.length;
                        aux = item.aux.substring(0,hs) + "<span class='blacksheep-autocomplete-highlight-aux'>" + item.aux.substring(hs,he) + "</span>" + item.aux.substring(he,item.aux.length);
                    }
                    else{
                        aux = item.aux;
                    }
                    }
                    else{
                        aux = "";
                    }
                    hd = "<span class='blacksheep-autocomplete-hd'>" + hd + "</span>";
                    aux =  "<span class='blacksheep-autocomplete-aux'>" + aux + "</span>";
                    var disp =  "<div><div class='blacksheep-autocomplete-label'>" + hd + aux + "</div>";
                    return $( "<li>" )
                        .append(disp)
                        .appendTo( ul );
                };
                retval = true;
            }
            function autocompleteme(req, responseFn) {
                
                var simplelov = false;
                if (lov.length > 0){
                    if (!$.isPlainObject(lov[0])){
                        simplelov = true;
                    }
                }
                var inp = req.term;
                var len = inp.length;
                //var filterfield;
                var filterexp = "";

                if (simplelov == false){
                if (len >= minlen && (lov.length >= 1000 || lov.length <= 1)){
                    var cname = "BLACKSHEEP_AUTOCOMPLETE_QFIELD_" + pm.Get("GetBusComp").GetName() + "_" + control.GetFieldName();
                    var queryfield = jQuery.cookie(cname);
                    if (op == "NO" && sens == "" & beg == ""){
                        filterexp = inp + "*";
                    }
                    else{
                        filterexp = sens + "LIKE'" + beg + inp + "*'";
                    }
                    lov = bs.GetPickValues(pm,control,true,filterexp,queryfield,fieldlist,op);
                }
                if (len < minlen){
                    lov =[];
                }
                }
                //lov.sort();
                var s = inp;
                s = $.ui.autocomplete.escapeRegex(s);

                var matcher;
                if (s.indexOf("\*") >= 0){
                    s = s.replace(/\*/g,".*");
                    s = s.replace(/\\./g,".");
                }
                if (len == 1 && beg == ""){
                    matcher = new RegExp( "^" + s, "i" );
                }
                else {
                    matcher = new RegExp( s, "i" );
                }
                if (simplelov == true){
                    matcher = new RegExp( s, "i" );
                }
                var a = new Array();
                var lov_item;
                for (i = 0; i < lov.length; i++){
                    if (simplelov == false){
                        lov_item = lov[i].label;
                    }
                    else{
                        lov_item = lov[i];
                    }
                    if (matcher.test(lov_item)){
                        a.push(lov[i]);
                    }
                }
                responseFn( a );
            }

            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes"){var zperf = Date.now(); blacksheep_perf_function_call["AddAutoComplete__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };
        //the next is the function defined to run before the main code (aka "cleanup")
        //we add it to the current object prototype but not to extensions because it is not needed outside of this module
        BlacksheepAutocomplete.prototype.cleanup = function(pm){
            //get the PM and applet element
            var ae = bs.GetAppletElem(pm);
            var ctrls = pm.Get("GetControls");
            var pr = pm.GetRenderer();
            var ce;
            for (co in ctrls){
                if (ctrls[co].GetUIType() == "Pick"){
                    ce = pr.GetUIWrapper(ctrls[co]).GetEl();
                    $(ce).removeClass("blacksheep-autocomplete-pick");
                }
                else if (ctrls[co].GetUIType() == "Mvg"){
                    ce = pr.GetUIWrapper(ctrls[co]).GetEl();
                    $(ce).removeClass("blacksheep-autocomplete-mvg");
                    $(ce).attr("aria-readonly","true");
                    $(ce).attr("readonly","readonly");
                    //unbind keydown handler (workaround to enable backspace key...)
                    $(ce).unbind("focus");

                }
            }

        };

        //******************************************************************************************
        //   CUSTOM CODE ENDS HERE
        //******************************************************************************************

        //Do not modify after this line!!!!
        //copy extensions container to prototype
        for (var fName in extensions) {
            BlacksheepAutocomplete.prototype[fName] = extensions[fName];
        }
        //make container public
        BlacksheepAutocomplete.prototype.Extensions = extensions;
        //extend core class
        var bs = new SiebelAppFacade.Blacksheep();
        bs.Extender(SiebelAppFacade.Blacksheep,BlacksheepAutocomplete);

        retval = BlacksheepAutocomplete;
        if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
        return retval;
    }();
}
var bs_z=Date.now(); console.log("blacksheep.js : debugger : " + bs_z + " : file " + "blacksheep-autocomplete.js : loaded : time(ms): " + parseInt(bs_z-bs_a)); blacksheep_perf_file_load["blacksheep-autocomplete.js"] = parseInt(bs_z-bs_a);  bs_z = bs_a = null;
//end of file