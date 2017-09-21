/*******************************************************************
 * File:          blacksheep-state.js
 * Author:        Alexander Hansal (alex@blacksheep-crm.com)
 * Description:   PM State Checker for blacksheep.js, a professional utility library and API extension for Oracle Siebel CRM.
 * *******************************************************************
 * Copyright (c)2017 Alexander Hansal

 * USE THIS TEMPLATE FOR GETTING STARTED WITH blacksheep.js
 */

//First thing you want to do is choose a meaningful name for your new file (for example, you could save this file as a new file),
//and the object name (replace 'SiebelAppFacade.BlacksheepState' with it),
//and finally the main function (aka 'module') (replace 'BlacksheepStateTracker' with it)

//log the file load with a timer
//if you have copied this file, make sure the file name in the next line is referencing the new file
var bs_a=Date.now(); console.log("blacksheep.js : debugger : " + bs_a + " : file " + "blacksheep-state.js : loading");

//Everything begins with the module definition
//A module is the main function you would call from e.g. postload to execute the main functionality of your extension
//the following is an example module definition, see line comments for details
var blacksheepStateModule = "BlacksheepStateTracker";  //optional (global) variable for the module main function
//the bsco object is already instantiated by the core code, so we can use it
bsco.AddModule(blacksheepStateModule, //the name of the module
    {  //the JSON object with the configuration
        file : "blacksheep-state.js", //name of the file that contains the module definition
        enabled : "yes",  //is the module enabled or not?
        mandatory : "no",  //is the module mandatory? This should be "no" for a custom extension
        autostart : "yes",
        //next lines use message types
        // message types must be added to the blacksheep message array (see the SetMsg method calls below)
        label : "MOD_STATE_LABEL", //the message type for the translatable display name (e.g. on user preferences dialog)
        description : "MOD_STATE_DESC", //the message type for the translatable module description
        dependencies : ["core"], //dependencies for this module. This is an array of other modules (see blacksheep-conf.js for OOB modules)
        userconfig : "no", //is this module configurable by the user? if "yes", it is displayed in the user preferences dialog.
        scope : ["Applet"], //the scope(s) of this module. This is an array. Valid values are "Application","View","Applet","Control"
        pre_function : "cleanup", //the name of a function to be invoked before the main functionality (see below for an example). Usually for removing DOM manipulations.
        //useroptions allow you to define user-configurable details. The example defines a custom text entry field (used in the main code below).
        //the optional whitelist definition. If a whitelist definition is available, the module will only be executed for the objects listed
        //keyword "all" is supported to put all objects of the same type in the whitelist
        //if you omit an entry in the whitelist, it is treated like "all"

        whitelist : {
            "applications":["Siebel Universal Agent","Siebel Power Communications","Siebel Marketing Enterprise"]  //array of Application definitions (as in Siebel Repository)
          }},
    true //override any existing module definition with the same name?
);

//
//the main if block checks if the new object is still undefined (as is customary in Open UI)
//we also check if blacksheep.js core is enabled and
//if the main function is also enabled

if (SiebelAppFacade.Blacksheep.prototype.ShouldItExist(SiebelAppFacade.BlacksheepState,blacksheepStateModule))  {



    //We're good citizens, so we add the object to the SiebelAppFacade namespace
    SiebelJS.Namespace("SiebelAppFacade.BlacksheepState");

    //The object declared as a function
    SiebelAppFacade.BlacksheepState = function () {

//look to your right to see the debug blocks. You can enable/disable debug mode in blacksheep-conf.js
//out of the box, we have a debug message at the beginning and at the end of each function and/or file
//notice that we establish variables a (begin time in ms), f (file/function name) and z (end time in ms),
//so DO NOT declare variables named a,f or z in your code!
//it is recommended to keep the debug blocks. If you decide to remove them, make sure you remove the begin and end blocks
//correctly to avoid run-time errors.

        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function SiebelAppFacade.BlacksheepState() : "; console.log(bsd + a + f + "begin"); }
        //The constructor function
        function BlacksheepState() { console.log(this.GetMsg("INIT_CONSTR",true) + "BlacksheepState"); }
        //local instance of Blacksheep
        var bs = new SiebelAppFacade.Blacksheep();
        //get the module definition for later reference
        var md = bsco.GetModule(blacksheepStateModule);

        //if your module needs translatable strings, you must define them now
        //see the example below for German and any other language
        bs.SetMsg(md.label,"Statusbeobachtung","deu");
        bs.SetMsg(md.description,"Überwacht den Status von Applets und BCs.","deu");
        bs.SetMsg(md.label,"State Tracker","enu");
        bs.SetMsg(md.description,"State tracking for applets and BCs.","enu");

        //In blacksheep.js, we use our own Extender function to add extension functions to the core module
        //So we declare a container object that will hold all functions we define
        var extensions = {};

        //This is the main function (aka module). All blacksheep.js modules should have at least one argument which
        //references the 'context', which usually is a PM, a PR or an object (applet,control) instance
        //see the documentation on context validation
        extensions.BlacksheepStateTracker = function(context){
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepState.prototype.BlacksheepStateTracker(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["BlacksheepStateTracker__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            //we should always have a variable retval to hold the return value, usually defaults to false
            var retval = false;

            //It is recommended to keep the following lines to establish a proper module
            //first, we store the module name as a variable so we can reuse it
            var modname = blacksheepStateModule;

            //then we check if a whitelist exists for the module (see blacksheep-conf.js for example whitelists)
            var wl = bs.GetWhiteList(modname);

            //and we can now process the whitelist
            //if you do not wish to use the whitelisting feature, simply set is_whitelisted = true;
            var is_whitelisted = bs.ProcessWhiteList(wl); //pass context as second parameter if you have it, defaults to active PM

            //most functions will require a pm instance so we start with a variable to hold it
            var pm = null;

            //we undo all changes that we implement
            //for example, our module implements a click event handler, so we make sure to remove it
            //we can use the module definition to specify a 'pre' function in the prototype, so this
            //can be externalized nicely
            BlacksheepState.prototype[md.pre_function].call(this,bs.ValidateContext(context));

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
                    var is_user_enabled = true;//bs.GetUserPref(pm,propname + propuser);

                    //anyway, the module is system enabled (i.e. enabled and whitelisted) so we can set the system property
                    //note that this needs a proper PM
                    pm.SetProperty(propname + propsys,true);

                    //now we check if the module is enabled by the user
                    if (typeof(is_user_enabled) === "undefined" || is_user_enabled == "true" || is_user_enabled == true){

                        //******************************************************************************************
                        //   CUSTOM CODE STARTS HERE
                        //******************************************************************************************

                        //if we are here, the user has either explicitly enabled the module, or it is the first time
                        //modules in blacksheep.js are enabled by default.
                        if (bsc.debug == "yes"){
                            var ae = bs.GetAppletElem(pm);
                            var sd = bs.GenerateDOMElement("textarea",{class:"blacksheep-state-display",id:"blacksheep_state_display"});
                            $(ae).find(".siebui-btn-grp-applet").prepend(sd);
                        }
                        //BC NotificationHandler
                        var P = "BLACKSHEEP_STATE";
                        pm.SetProperty(P,"START TRACKING");
                        var consts = SiebelJS.Dependency("SiebelApp.Constants");
                        var bcstatechanged = consts.get("SWE_PROP_BC_NOTI_STATE_CHANGED");
                            var generic = consts.get("SWE_PROP_BC_NOTI_GENERIC");

                        pm.AttachNotificationHandler(bcstatechanged, function(ps){
                            var state = ps.GetProperty("state");
                            var value = ps.GetProperty("value");
                            var newval;
                            if (bsc.debug == "yes") {
                                console.log(bsd + Date.now() + " : StateTracker.Notification." + bcstatechanged + " : {state:" + state + ", value:" + value + "}");
                                console.log(bsd + Date.now() + " : StateTracker.Notification." + bcstatechanged + " : propset:");
                                console.log(ps);
                            }
                        newval = "NOTI_" + bcstatechanged + "." + state + "." + value;
                            if (bsc.debug == "yes") {
                            $(sd).text($(sd).text() + "\nNOTI: " + newval);
                            $(sd).scrollTop($(sd)[0].scrollHeight);
                            }
                        });

                            pm.AttachNotificationHandler(generic, function(ps){
                            var type = ps.GetProperty("type");
                            var newval;
                            if (bsc.debug == "yes") {
                                console.log(bsd + Date.now() + " : StateTracker.Notification." + generic + " : {type:" + type + "}");
                                console.log(bsd + Date.now() + " : StateTracker.Notification." + generic + " : propset:");
                                console.log(ps);
                            }


                            newval = "NOTI_" + generic + "." + type;
                            if (bsc.debug == "yes") {
                            $(sd).text($(sd).text() + "\nNOTI: " + newval);
                            $(sd).scrollTop($(sd)[0].scrollHeight);
                            }
                        });

                        //attach PRE proxy binding
                        pm.AttachPreProxyExecuteBinding("ALL",function(m,i,o){
                            
                            if (bsc.debug == "yes") {
                                console.log(bsd + Date.now() + " : StateTracker.PreProxyExecute." + m + " : in_propset:");
                                console.log(i);
                                console.log(bsd + Date.now() + " : StateTracker.PreProxyExecute." + m + " : out_propset:");
                                console.log(o);
                            }
                            var state = this.Get(P);
                            var newval;


                                newval = "BEFORE_" + m;
                                pm.SetProperty(P,newval);
                                if (bsc.debug == "yes") {
                                    console.log(bsd + Date.now() + " : StateTracker.PreProxyExecute." + m + ".SetPMProperty.BLACKSHEEP_STATE" + " : {old:" + state + ", new:" + newval+ "}");
                                }
                            if (bsc.debug == "yes") {
                            $(sd).text($(sd).text() + "\nPROXY: " + newval);
                            if (o.GetProperty("Status") == "Error"){
                                $(sd).text($(sd).text() + "\nERROR: " + o.GetChildByType("Errors").GetChild(0).GetProperty("ErrMsg"));
                            }
                            $(sd).scrollTop($(sd)[0].scrollHeight);
                            }
                        });

                        //attach post proxy binding
                        pm.AttachPostProxyExecuteBinding("ALL",function(m,i,o){
                            if (bsc.debug == "yes") {
                                console.log(bsd + Date.now() + " : StateTracker.PostProxyExecute." + m + " : in_propset:");
                                console.log(i);
                                console.log(bsd + Date.now() + " : StateTracker.PostProxyExecute." + m + " : out_propset:");
                                console.log(o);
                            }
                            var state = this.Get(P);
                            var newval;


                                newval = "AFTER_" + m;
                                pm.SetProperty(P,newval);
                                if (bsc.debug == "yes") {
                                    console.log(bsd + Date.now() + " : StateTracker.PostProxyExecute." + m + ".SetPMProperty.BLACKSHEEP_STATE" + " : {old:" + state + ", new:" + newval+ "}");

                            $(sd).text($(sd).text() + "\nPROXY: " + newval);
                            $(sd).scrollTop($(sd)[0].scrollHeight);
                                }
                        });

                        
                        //attach method handlers
                        pm.AttachPMBinding("InvokeMethod",function(m,ps){
                            if (bsc.debug == "yes") {
                                console.log(bsd + Date.now() + " : StateTracker.PostPMBinding." + m + " : propset:");
                                console.log(ps);
                              }
                            var state = this.Get(P);
                            var newval;


                            newval = "BEFORE_" + m;
                            if (bsc.debug == "yes") {
                            $(sd).text($(sd).text() + "\nPMBIND: " + newval);
                            $(sd).scrollTop($(sd)[0].scrollHeight);
                            }
                        }, {sequence:true});

                        pm.AttachPMBinding("InvokeMethod",function(m,ps){
                            if (bsc.debug == "yes") {
                                console.log(bsd + Date.now() + " : StateTracker.PrePMBinding." + m + " : propset:");
                                console.log(ps);
                            }
                            var state = this.Get(P);
                            var newval;


                            newval = "AFTER_" + m;
                            if (bsc.debug == "yes") {
                            $(sd).text($(sd).text() + "\nPMBIND: " + newval);
                            $(sd).scrollTop($(sd)[0].scrollHeight);
                            }
                        }, {sequence:false});

                        pm.AttachPMBinding("FieldChange",function(control,value){
                            if (bsc.debug == "yes") {
                                console.log(bsd + Date.now() + " : StateTracker.PreFieldChange." + control.GetName() + " : value :" + value);

                            $(sd).text($(sd).text() + "\nPMBIND: " + "BEFORE_FieldChange");
                            $(sd).scrollTop($(sd)[0].scrollHeight);
                            }
                        }, {sequence:true});

                        pm.AttachPMBinding("FieldChange",function(control,value){
                            if (bsc.debug == "yes") {
                                console.log(bsd + Date.now() + " : StateTracker.PostFieldChange." + control.GetName() + " : value :" + value);

                            $(sd).text($(sd).text() + "\nPMBIND: " + "AFTER_FieldChange");
                            $(sd).scrollTop($(sd)[0].scrollHeight);
                            }
                        }, {sequence:false});

                        pm.AttachPMBinding("ShowSelection",function(){
                            if (bsc.debug == "yes") {
                                console.log(bsd + Date.now() + " : StateTracker.PreShowSelection");

                            $(sd).text($(sd).text() + "\nPMBIND: " + "BEFORE_ShowSelection");
                            $(sd).scrollTop($(sd)[0].scrollHeight);
                            }
                        }, {sequence:true});

                        pm.AttachPMBinding("ShowSelection",function(){
                            if (bsc.debug == "yes") {
                                console.log(bsd + Date.now() + " : StateTracker.PostShowSelection");

                            $(sd).text($(sd).text() + "\nPMBIND: " + "AFTER_ShowSelection");
                            $(sd).scrollTop($(sd)[0].scrollHeight);
                            }
                        }, {sequence:false});

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
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes"){var zperf = Date.now(); blacksheep_perf_function_call["BlacksheepStateTracker__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        //******************************************************************************************
        //   CUSTOM CODE STARTS HERE
        //******************************************************************************************

        //Add custom functions here as needed, best to copy/paste the template function from above
        //an extension function (available via the Blacksheep main object) would look like this




        //this template uses a local function to handle the (double) click
        //the scenario is to display a dialog with a simple message
        //the user can define the message as a module option in the user preferences dialog

        //the next is the function defined to run before the main code (aka "cleanup")
        //we add it to the current object prototype but not to extensions because it is not needed outside of this module
        BlacksheepState.prototype.cleanup = function(pm){

        };

        //******************************************************************************************
        //   CUSTOM CODE ENDS HERE
        //******************************************************************************************

        //Do not modify after this line!!!!
        //copy extensions container to prototype
        for (var fName in extensions) {
            BlacksheepState.prototype[fName] = extensions[fName];
        }
        //make container public
        BlacksheepState.prototype.Extensions = extensions;
        //extend core class
        var bs = new SiebelAppFacade.Blacksheep();
        bs.Extender(SiebelAppFacade.Blacksheep,BlacksheepState);

        retval = BlacksheepState;
        if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
        return retval;
    }();
}
var bs_z=Date.now(); console.log("blacksheep.js : debugger : " + bs_z + " : file " + "blacksheep-state.js : loaded : time(ms): " + parseInt(bs_z-bs_a)); blacksheep_perf_file_load["blacksheep-state.js"] = parseInt(bs_z-bs_a);  bs_z = bs_a = null;
//end of file