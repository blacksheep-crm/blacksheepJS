/*******************************************************************
 * File:          blacksheep-xray.js
 * Author:        Alexander Hansal (alex@blacksheep-crm.com)
 * Description:   Overlays applets and controls with information from DOM, Logical UI, Business Layer and Database Layer
 * *******************************************************************
 * Copyright (c)2017 Alexander Hansal

 * USE THIS TEMPLATE FOR GETTING STARTED WITH blacksheep.js
 */

//First thing you want to do is choose a meaningful name for your new file (for example, you could save this file as a new file),
//and the object name (replace 'SiebelAppFacade.BlacksheepXRay' with it),
//and finally the main function (aka 'module') (replace 'XRay' with it)

//log the file load with a timer
//if you have copied this file, make sure the file name in the next line is referencing the new file
var bs_a=Date.now(); console.log("blacksheep.js : debugger : " + bs_a + " : file " + "blacksheep-xray.js : loading");

//Everything begins with the module definition
//A module is the main function you would call from e.g. postload to execute the main functionality of your extension
//the following is an example module definition, see line comments for details
var blacksheepXRayModule = "XRay";  //optional (global) variable for the module main function
//the bsco object is already instantiated by the core code, so we can use it
bsco.AddModule(blacksheepXRayModule, //the name of the module
    {  //the JSON object with the configuration
        file : "blacksheep-xray.js", //name of the file that contains the module definition
        enabled : "yes",  //is the module enabled or not?
        mandatory : "no",  //is the module mandatory? This should be "no" for a custom extension
        autostart : "yes",
        //next lines use message types
        // message types must be added to the blacksheep message array (see the SetMsg method calls below)
        label : "MOD_XRAY_LABEL", //the message type for the translatable display name (e.g. on user preferences dialog)
        description : "MOD_XRAY_DESC", //the message type for the translatable module description
        dependencies : ["core"], //dependencies for this module. This is an array of other modules (see blacksheep-conf.js for OOB modules)
        userconfig : "yes", //is this module configurable by the user? if "yes", it is displayed in the user preferences dialog.
        scope : ["Applet"], //the scope(s) of this module. This is an array. Valid values are "Application","View","Applet","Control"
        pre_function : "cleanup", //the name of a function to be invoked before the main functionality (see below for an example). Usually for removing DOM manipulations.
        //useroptions allow you to define user-configurable details. The example defines a custom text entry field (used in the main code below).
        //this parameter drives the default state for the checkbox to save options for the current object ("userpref") or all objects ("all");
        //the optional whitelist definition. If a whitelist definition is available, the module will only be executed for the objects listed
        //keyword "all" is supported to put all objects of the same type in the whitelist
        //if you omit an entry in the whitelist, it is treated like "all"

        whitelist : {
            "applications":["all"],  //array of Application definitions (as in Siebel Repository)
            //"screens":["Accounts Screen","Contacts Screen"],   //array of Screens (note: due to limitations, use the screen tab name displayed in the client
            "views":["all"], //array of View definitions
            "applets":["all"],// ["function","InitWhiteList",{searchspec: "[Class] NOT LIKE '*List*'"}],
            "bos":["all"], //array of Business Object definitions
            "bcs":["all"], //array of Business Component definitions
            "resp":["Siebel Administrator"]
        }},
    true //override any existing module definition with the same name?
);

//
//the main if block checks if the new object is still undefined (as is customary in Open UI)
//we also check if blacksheep.js core is enabled and
//if the main function is also enabled

if (SiebelAppFacade.Blacksheep.prototype.ShouldItExist(SiebelAppFacade.BlacksheepXRay,blacksheepXRayModule))  {



    //We're good citizens, so we add the object to the SiebelAppFacade namespace
    SiebelJS.Namespace("SiebelAppFacade.BlacksheepXRay");

    //The object declared as a function
    SiebelAppFacade.BlacksheepXRay = function () {

//look to your right to see the debug blocks. You can enable/disable debug mode in blacksheep-conf.js
//out of the box, we have a debug message at the beginning and at the end of each function and/or file
//notice that we establish variables a (begin time in ms), f (file/function name) and z (end time in ms),
//so DO NOT declare variables named a,f or z in your code!
//it is recommended to keep the debug blocks. If you decide to remove them, make sure you remove the begin and end blocks
//correctly to avoid run-time errors.

        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function SiebelAppFacade.BlacksheepXRay() : "; console.log(bsd + a + f + "begin"); }
        //The constructor function
        function BlacksheepXRay() { console.log(this.GetMsg("INIT_CONSTR",true) + "BlacksheepXRay"); }
        //local instance of Blacksheep
        var bs = new SiebelAppFacade.Blacksheep();
        //get the module definition for later reference
        var md = bsco.GetModule(blacksheepXRayModule);

        //if your module needs translatable strings, you must define them now
        //see the example below for German and any other language

        bs.SetMsg(md.label,"Röntgenblick","deu");
        bs.SetMsg(md.description,"Durchleuchtet Objekte wie Applets mit Informationen aus dem Repository.","deu");
        bs.SetMsg(md.label,"X-Ray Vision","enu");
        bs.SetMsg("BC_TITLE","BC: ","enu");
        bs.SetMsg("BC_TITLE","BC: ","deu");
        bs.SetMsg(md.description,"Reveals the inner workings of objects such as Applets with Repository information.","enu");
        bs.SetMsg("MOD_XRAY_OPTIONS",{end_user:"End User",open_ui:"Open UI",logical_ui:"Logical UI",business_layer:"Business Layer",database:"Database"},"enu");
        bs.SetMsg("MOD_XRAY_OPTIONS",{end_user:"Endbenutzer",open_ui:"Open UI",logical_ui:"Logisches UI",business_layer:"Geschäftslogik",database:"Datenbank"},"deu");
        bs.SetMsg("BC_SUBTITLE","Showing Field information","enu");
        bs.SetMsg("BC_SUBTITLE","Anzeige von Feld-Informationen","deu");
        bs.SetMsg("LOG_SUBTITLE","Showing Control information","enu");
        bs.SetMsg("LOG_SUBTITLE","Anzeige von Control-Informationen","deu");
        bs.SetMsg("OUI_SUBTITLE","Showing Open UI API information.<span style='font-size:0.6em;'> Hover label for DOM snippet.</span>","enu");
        bs.SetMsg("LOG_SUBTITLE","Anzeige von Open UI API-Informationen.<span style='font-size:0.6em;'> Mauszeiger über Beschriftung zeigt DOM-Ausschnitt.</span>","deu");
        bs.SetMsg("DB_SUBTITLE","Showing Database information.<span style='font-size:0.6em;'> Hover label for column description. Click label for object properties.</span>","enu");
        bs.SetMsg("DB_SUBTITLE","Anzeige von Datenbank-Informationen.<span style='font-size:0.6em;'> Mauszeiger über Beschriftung zeigt Spaltenbeschreibung. Klick zeigt Objektdetails an.</span>","deu");
        bs.SetMsg("APPLET_LINK","Click to display Applet details for this layer.","enu");
        bs.SetMsg("APPLET_LINK","Hier klicken, um Details zum Applet auf dieser Ebene anzuzeigen.","deu");
        bs.SetMsg("BC_LINK","Click to display Business Component details.","enu");
        bs.SetMsg("BC_LINK","Hier klicken, um Details zu dieser Business Component anzuzeigen.","deu");
        bs.SetMsg("XRAY_MANIFEST","Manifest [","enu");
        bs.SetMsg("XRAY_MANIFEST","Manifest [","deu");
        bs.SetMsg("XRAY_PROP","Properties [","enu");
        bs.SetMsg("XRAY_PROP","Eigenschaften [","deu");

        //In blacksheep.js, we use our own Extender function to add extension functions to the core module
        //So we declare a container object that will hold all functions we define
        var extensions = {};

        //This is the main function (aka module). All blacksheep.js modules should have at least one argument which
        //references the 'context', which usually is a PM, a PR or an object (applet,control) instance
        //see the documentation on context validation
        extensions.XRay = function(context){
                                                                                                                        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepXRay.prototype.XRay(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }
            //we should always have a variable retval to hold the return value, usually defaults to false
            var retval = false;
            //most functions will require a pm instance so we start with a variable to hold it
            var pm = null;
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
            //It is recommended to keep the following lines to establish a proper module
            //first, we store the module name as a variable so we can reuse it
            var modname = blacksheepXRayModule;
            
            //override whitelist entries with a function
            //this is a POC to query the repository at runtime for applets etc.
            //performance penalty!!!
            var wlc = md.whitelist;
            
            for (wlc_item in wlc){
                if (wlc[wlc_item][0] == "function"){
                    var arr = new Array();
                    var args = {
                        module:modname,
                        wlc_item:wlc_item,
                        options:wlc[wlc_item][2]
                    }
                    arr = SiebelAppFacade.Blacksheep.prototype[wlc[wlc_item][1]].call(this,args);
                    wlc[wlc_item] = arr;
                }
            }

            //then we check if a whitelist exists for the module (see blacksheep-conf.js for example whitelists)
            //var wl = bs.GetWhiteList(modname);

            //and we can now process the whitelist
            //if you do not wish to use the whitelisting feature, simply set is_whitelisted = true;
            var is_whitelisted = bs.ProcessWhiteList(wlc,pm); //pass context as second parameter if you have it, defaults to active PM



            //we undo all changes that we implement
            //for example, our module implements a click event handler, so we make sure to remove it
            //we can use the module definition to specify a 'pre' function in the prototype, so this
            //can be externalized nicely
            BlacksheepXRay.prototype[md.pre_function].call(this,pm);

            //when we get inside the next if block, the module is whitelisted for the current context.
            if (is_whitelisted){


                //object is in whitelist, put everything you want to execute in this block
                //for example, we can put a message to the console...
                console.log(bs.GetMsg("WL_TRUE",true) + modname + ", " + pm.Get("GetName"));


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
                        
                        var ap = bs.GetAppletElem(pm);
                        var appletId = pm.Get("GetFullId");
                        var btnid = "blacksheep_xray_btn_" + appletId
                        var sel = bs.GenerateDOMElement("select",{id:btnid});
                        var options = bs.GetMsg("MOD_XRAY_OPTIONS");
                        for (opt in options){
                            var temp = $("<option value='" + opt + "'>" + options[opt] + "</option>");
                            $(sel).append(temp);

                        }
                        if ($("#" + btnid).length == 0){
                            if (ap.find(".siebui-appletmenu-btn").length > 0){
                                ap.find(".siebui-appletmenu-btn").after(sel);
                            }
                            /*
                            else if (ap.find("[class*='applet-buttons']").length > 0){
                                $("[class*='applet-buttons']").append(sel);
                            }
                            */

                        }
                        else{
                            $("#" + btnid).show();
                        }
                        $("#" + btnid).change(function(e){

                            var options = e.target.options;
                            var selection;
                            for (opt in options){
                                if (options[opt].selected){
                                   selection = options[opt].value;
                                   switch (selection){
                                       case "end_user" :
                                           bs.ResetLabels(pm);
                                           break;
                                       case "logical_ui" :
                                           bs.ShowLogicalUI(pm);
                                           break;
                                       case "open_ui" :
                                           bs.ShowOpenUI(pm);
                                           break;
                                       case "business_layer":
                                           bs.ShowBCFields(pm);
                                           break;
                                       case "database" :
                                           bs.ShowTableColumns(pm);
                                           break;
                                       default: break;
                                   }

                                }
                            }
                            
                      });

                        //this is important, we have to ensure that the user preference is set to true
                        //so the framework recognizes this module as user enabled
                        bs.SetUserPref(pm,propname + propuser,true);
                        //we are reaching the point were everything seems to have executed OK,
                        //so we set our return value
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
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
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
         if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepXRay.prototype.CustomExtension(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }
         //do something clever here
         if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
         return retval;
         };
         */

        extensions.ShowLogicalUI = function(context){
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepXRay.prototype.ShowLogicalUI(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }
            var retval = false;
            var pm = bs.ValidateContext(context);
            bs.ResetLabels(pm);
            var oBC = pm.Get("GetBusComp"); //get the BC instance
            var arrControls = pm.Get("GetControls");
            //parse array of applet controls
            for(sControlName in arrControls){
                oControl = arrControls[sControlName]; //get a control instance "by name"
                var uitype = oControl.GetUIType();
                sNewLabel = sControlName + " (" + uitype + ")"; //get the BC field name behind the control
                if (arrControls[sControlName].GetFieldName() != "") //control has a field, i.e. is not a button etc...
                {
                    //call helper function to set new label HTML
                    target = bs.SetLabel(pm,oControl,sNewLabel);
                    if (target) { //put some lipstick on it ;-)
                        target.addClass("blacksheep-xray-logicalui");
                    }
                }
                else{ //likely a button
                    var methodName = sControlName;
                    var btnElem;
                    var methodText;
                    if (typeof(methodName) !== "undefined"){
                        btnElem = $("[name='" + arrControls[sControlName].GetInputName() + "']");
                        methodText = bs.GenerateDOMElement("div",{class:"blacksheep-xray-button-logical",id:"blacksheep_xray_btn_logical"});
                        methodText.text(" (" + methodName + ")");
                        btnElem.append(methodText);
                    }
                }
            }

            //Set Applet Title
            var linkid = "blacksheep_applet_details_" + pm.Get("GetFullId");
            var bc_title = "<a href='#' id='" + linkid + "' title='" + bs.GetMsg("APPLET_LINK") + "'>" + pm.GetObjName() + "</a> (" + bs.GetMsg("BC_TITLE") + oBC.GetName() + ")";
            bc_title += "<br>" + bs.GetMsg("LOG_SUBTITLE");
            var newAppletTitle = bs.ReplaceAppletTitle(pm,bc_title);
            newAppletTitle.addClass("blacksheep-xray-logicalui");
            $("#" + linkid).click(function(e){
                bs.ShowProperties("Applet",pm.GetObjName(),pm);
            });
            retval = true;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
            return retval;
        };

        extensions.ShowOpenUI = function(context){
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepXRay.prototype.ShowOpenUI(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }
            var retval = false;
            var pm = bs.ValidateContext(context);
            var pr = pm.GetRenderer();
            bs.ResetLabels(pm);
            var oBC = pm.Get("GetBusComp"); //get the BC instance
            var oBCFieldMap = oBC.GetFieldMap(); //get BC field map, i.e. object array with fields
            var arrControls = pm.Get("GetControls");
            //parse array of applet controls
            for(sControlName in arrControls){
                var html;
                oControl = arrControls[sControlName]; //get a control instance "by name"
                var el = pr.GetUIWrapper(oControl).GetEl();
                if (el && el.length > 0){
                    html = el[0].outerHTML;
                }
                else{
                    el = bs.GetLabelElem(pm,oControl);
                    if (el.length > 0){
                        html = bs.GetLabelElem(pm,oControl)[0].outerHTML;
                    }
                }
                var inputname = oControl.GetInputName();
                var info = html;
                sNewLabel = sControlName + " (" + inputname + ")"; //get the BC field name behind the control
                if (arrControls[sControlName].GetFieldName() != "") //control has a field, i.e. is not a button etc...
                {
                    //call helper function to set new label HTML
                    target = bs.SetLabel(pm,oControl,sNewLabel);
                    if (target) { //put some lipstick on it ;-)
                        target.addClass("blacksheep-xray-openui");
                        target.attr("title",info);
                    }
                }
                else{ //likely a button
                    var methodName = sControlName;
                    var btnElem;
                    var methodText;
                    if (typeof(methodName) !== "undefined"){
                        btnElem = $("[name='" + arrControls[sControlName].GetInputName() + "']");
                        methodText = bs.GenerateDOMElement("div",{class:"blacksheep-xray-button-openui",id:"blacksheep_xray_btn_openui"});
                        methodText.text(" (" + methodName + ")");
                        btnElem.append(methodText);
                        btnElem.find("#blacksheep_xray_btn_openui").attr("title",info);
                    }
                }
            }

            //Set Applet Title
            var linkid = "blacksheep_applet_details_" + pm.Get("GetFullId");
            var bc_title = "<a href='#' id='" + linkid + "' title='" + bs.GetMsg("APPLET_LINK") + "'>" + pm.GetObjName() + "</a> (" + bs.GetMsg("BC_TITLE") + oBC.GetName() + ")";
            bc_title += "<br>" + bs.GetMsg("OUI_SUBTITLE");
            var newAppletTitle = bs.ReplaceAppletTitle(pm,bc_title);
            newAppletTitle.addClass("blacksheep-xray-openui");
            $("#" + linkid).click(function(e){
                bs.ShowManifestData(pm);
            });
            retval = true;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
            return retval;

        };

        extensions.ShowManifestData = function(context){
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepXRay.prototype.ShowManifestData(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }
            var retval = false;
            var mdata = bs.GetManifestData(context);
            var pm = bs.ValidateContext(context);
            var objectname = (pm) ? pm.GetObjName() : context;
            $.getScript(SIEBEL_BUILD + "siebel/custom/blacksheep/3rdParty/prettyprint/prettyPrint.js").complete(function(){
                var tbl = bs.GenerateDOMElement("div");
                for (rec in mdata.obj){
                    $(tbl).append(prettyPrint(mdata.obj[rec],{maxDepth:1}));
                }
                $(tbl).dialog({width:600,height:450,title:bs.GetMsg("XRAY_MANIFEST") + objectname + "]"}).css({height:"350px", overflow:"auto"});
                retval = true;
            });
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
            return retval;
        };

        extensions.ShowProperties = function(type,searchspec,context){
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepXRay.prototype.ShowProperties(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }
            var retval = false;
            var objects = bs.GetRepoProperties(type,searchspec);
            var pm = null;
            if (typeof(pm) !== "undefined"){
                var pm = bs.ValidateContext(context);
            }
            var objectname = (pm) ? pm.GetObjName() : type + " (" + searchspec + ")";
            
            $.getScript(SIEBEL_BUILD + "siebel/custom/blacksheep/3rdParty/prettyprint/prettyPrint.js").complete(function(){
                var tbl = bs.GenerateDOMElement("div");
                for (rec in objects){
                    $(tbl).append(prettyPrint(objects[rec],{maxDepth:1}));
                }
                $(tbl).dialog({width:600,height:500,title:bs.GetMsg("XRAY_PROP") + objectname + "]"}).css({height:"350px", overflow:"auto"});
                retval = true;
            });
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
            return retval;
        };

        extensions.ShowBCFields = function(context){
                                                                                                                        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepXRay.prototype.ShowBCFields(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }
            var retval = false;
            var pm = bs.ValidateContext(context);
            bs.ResetLabels(pm);
            var oBC = pm.Get("GetBusComp"); //get the BC instance
            var oBCFieldMap = oBC.GetFieldMap(); //get BC field map, i.e. object array with fields
            var sDataType; //data type
            var sLength; //field length
            var sCalc; //Calculated flag
            var sRO; //Read only flag
            var oField; //the field object itself
            var arrControls = pm.Get("GetControls");
            //parse array of applet controls
            for(sControlName in arrControls){
                oControl = arrControls[sControlName]; //get a control instance "by name"
                sNewLabel = oControl.GetFieldName(); //get the BC field name behind the control
                if (sNewLabel != "") //control has a field, i.e. is not a button etc...
                {
                    //get field properties from field map
                    oField = oBCFieldMap[sNewLabel]; //the field instance
                    sDataType = oField.GetDataType(); //get the data type (text, bool, etc)
                    sLength = oField.GetLength(); //get the field length (30, 100, etc)
                    sCalc = oField.IsCalc() ? "C" : ""; //get a "C" when field is calculated, otherwise nothing
                    sRO = oField.IsReadOnly() ? "RO" : "";  //get "RO" when field is read only, otherwise nothing
                    //now concatenate a pretty string (could include HTML)
                    sNewLabel += " (" + sDataType + "/" + sLength + ")";
                    sNewLabel += (sRO || sCalc ? " " : "") + sCalc + (sRO && sCalc ? "/" : "") + sRO;
                    //call helper function to set new label HTML
                    target = bs.SetLabel(pm,oControl,sNewLabel);
                    if (target) { //put some lipstick on it ;-)
                        target.removeClass("blacksheep-xray-database");
                        target.addClass("blacksheep-xray-business-layer");
                    }
                }
                else{ //likely a button
                    var methodName = arrControls[sControlName].GetMethodName();
                    var btnElem;
                    var methodText;
                    if (typeof(methodName) !== "undefined"){
                        btnElem = $("[name='" + arrControls[sControlName].GetInputName() + "']");
                        methodText = bs.GenerateDOMElement("div",{class:"blacksheep-xray-button-method",id:"blacksheep_xray_btn_method"});
                        methodText.text(" (" + methodName + ")");
                        btnElem.append(methodText);
                    }
                }
            }

            //Set Applet Title
            var linkid = "blacksheep_bc_details_" + pm.Get("GetFullId");
            var bc_title = pm.GetObjName() + " (" + bs.GetMsg("BC_TITLE") + "<a href='#' id='" + linkid + "' title='" + bs.GetMsg("BC_LINK") + "'>" + oBC.GetName() + "</a>)";
            bc_title += "<br>" + bs.GetMsg("BC_SUBTITLE");
            var newAppletTitle = bs.ReplaceAppletTitle(pm,bc_title);
            newAppletTitle.addClass("blacksheep-xray-business-layer");
            $("#" + linkid).click(function(e){
                bs.ShowProperties("Business Component",oBC.GetName());
            });
            retval = true;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
            return retval;
        };

        //ShowTableColumns: calls a server-side business service to retrieve data layer information and triggers display function
        //only works on DB with repository data
        extensions.ShowTableColumns = function(context){
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepXRay.prototype.ShowTableColumns(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }
            var retval = false;
            var pm = bs.ValidateContext(context);
            bs.ResetLabels(pm);
            var arrControls = pm.Get("GetControls");
            var oBC = pm.Get("GetBusComp"); //get the BC instance
            var sBCName = oBC.GetName(); //get the BC name
            var oSvc = SiebelApp.S_App.GetService("blacksheep Repository Inspector"); //instantiate the server-side BS
            var inPS = SiebelApp.S_App.NewPropertySet(); //instantiate the input PS
            var childPS = SiebelApp.S_App.NewPropertySet(); //temp child PS
            var dbdata; //data from BS output PS
            inPS.SetProperty("BusCompName",sBCName); //write the BC name to the input PS

            //iterate through controls and construct the input PS
            for(sControlName in arrControls){ //parse the controls array
                oControl = arrControls[sControlName]; //get a control object "by name"
                sNewLabel = oControl.GetFieldName(); //get the BC field name
                if (sNewLabel != ""){ //if it is a "real" field
                    childPS.SetProperty(sNewLabel,""); }//add the field to the child PS
            }//end of loop 1


            inPS.AddChild(childPS); //add the child PS to the input PS
            var outPS = oSvc.InvokeMethod("GetTableColumns", inPS); //invoke the custom BS method
            var resultPS = outPS.GetChildByType("ResultSet").GetChild(0); //retrieve result PS
            
            //iterate through controls, create replacement label and call helper function
            for(sControlName in arrControls){ //parse the controls array again
                oControl = arrControls[sControlName]; //get a control object "by name"
                sNewLabel = oControl.GetFieldName(); //get BC field name
                if (sNewLabel != ""){ //if it is a "real" field
                    dbdata = resultPS.GetProperty(sNewLabel); //get the data layer information for the field
                    dbdata = dbdata.split("|");  //data is passed from BS separated by '|', hence the split
                    var tablename = dbdata[0].split(".")[0];
                    var colname = dbdata[0].split(".")[1];
                    var tablelink = "<a href='#' id='" + tablename + "'>" + tablename + "</a>";
                    var columnlink = "<a href='#' id='" + tablename + "___" + colname +"'>" + ((typeof(colname) !== "undefined") ? ("." + colname) : "") + "</a>";
                    //concatenate a nice little piece of HTML
                    //title attribute allows tooltip with additional information
                    sNewLabel = "<span title='" + dbdata[1] + "'>" + tablelink + columnlink + "</span>";
                    //call helper function
                    target = bs.SetLabel(pm,oControl,sNewLabel);
                    if (target) { //toggle classes
                        target.addClass("blacksheep-xray-database");
                    }
                    $("[id='" + tablename + "']").click(function(e){
                        e.stopImmediatePropagation();
                        bs.ShowProperties("Table",$(this).attr("id"));
                    });
                    var colid = tablename + "___" + colname;
                    $("[id='" + colid + "']").click(function(e){
                        e.stopImmediatePropagation();
                        var id = $(this).attr("id");
                        var tablename = id.split("___")[0];
                        var colname = id.split("___")[1];
                       bs.ShowProperties("Column","[Name]='" + colname + "' AND [Parent Name]='" + tablename + "'");
                    });
                }
            }//end of loop 2
            //Set Applet Title
            var bc_title = pm.GetObjName() + " (" + bs.GetMsg("BC_TITLE") + oBC.GetName() + ")";
            bc_title += "<br>" + bs.GetMsg("DB_SUBTITLE");
            var newAppletTitle = bs.ReplaceAppletTitle(pm,bc_title);
            newAppletTitle.addClass("blacksheep-xray-database");
            retval = true;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
            return retval;
        };

        extensions.ResetLabels = function(context) {
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepUtils.prototype.ResetLabels(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }
            var retval = false;
            var pm = bs.ValidateContext(context);
            var arrControls = pm.Get("GetControls");
            for(sControlName in arrControls){  //iterate control array
                oControl = arrControls[sControlName]; //get a control object "by name"
                sNewLabel = oControl.GetDisplayName(); //returns the control label text
                if (sNewLabel != ""){
                    //now call helper function
                    target = bs.SetLabel(pm,oControl,sNewLabel);
                    if (target) {  //remove makeup
                        target.removeClass("blacksheep-xray-business-layer");
                        target.removeClass("blacksheep-xray-database");
                        target.removeClass("blacksheep-xray-logicalui");
                        target.removeClass("blacksheep-xray-openui");
                        target.attr("title","");
                    }
                }
            }
            //reset applet title
            var applet = bs.GetAppletElem(pm);
            if (applet.find("#blacksheep_aux_title").length > 0){
                applet.find("#blacksheep_aux_title").remove();
            }
            var appletTitle = bs.GetAppletTitleElem(pm);
            if (appletTitle.length > 0){
                appletTitle.removeClass("blacksheep-hidden");
            }
            //reset buttons
            applet.find("div#blacksheep_xray_btn_method").remove();
            applet.find("div#blacksheep_xray_btn_openui").remove();
            applet.find("div#blacksheep_xray_btn_logical").remove();
            retval = true;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
            return retval;
        };


        //below is the function defined to run before the main code (aka "cleanup")
        //we add it to the current object prototype but not to extensions because it is not needed outside of this module
        BlacksheepXRay.prototype.cleanup = function(pm){
            var ap = bs.GetAppletElem(pm);
            var appletId = pm.Get("GetFullId");
            var btnid = "blacksheep_xray_btn_" + appletId;
            ap.find($("#" + btnid)).hide();
        };

        //******************************************************************************************
        //   CUSTOM CODE ENDS HERE
        //******************************************************************************************

        //Do not modify after this line!!!!
        //copy extensions container to prototype
        for (var fName in extensions) {
            BlacksheepXRay.prototype[fName] = extensions[fName];
        }
        //make container public
        BlacksheepXRay.prototype.Extensions = extensions;
        //extend core class
        var bs = new SiebelAppFacade.Blacksheep();
        bs.Extender(SiebelAppFacade.Blacksheep,BlacksheepXRay);

        retval = BlacksheepXRay;
        if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
        return retval;
    }();
}
var bs_z=Date.now(); console.log("blacksheep.js : debugger : " + bs_z + " : file " + "blacksheep-xray.js : loaded : time(ms): " + parseInt(bs_z-bs_a)); blacksheep_perf_file_load["blacksheep-xray.js"] = parseInt(bs_z-bs_a);  bs_z = bs_a = null;
//end of file