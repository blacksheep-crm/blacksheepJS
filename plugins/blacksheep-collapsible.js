/*******************************************************************
 * File:          blacksheep-collapsible.js
 * Author:        Alexander Hansal (alex@blacksheep-crm.com)
 * Description:   Applet collapsibility with user preference memory for blacksheep.js, a professional utility library and API extension for Oracle Siebel CRM.
 * *******************************************************************
 * Copyright (c)2017 Alexander Hansal
 * This software and related documentation are provided under a license agreement.
 * Apart from permissions in this license agreement, you may not
 * use, copy, modify, re-license, distribute this software in any form or by any means.
 * Any reverse engineering of this software is prohibited.
 *
 * This software might change without notice and is not warranted to be error-free.
 *
 * See individual functions for details and comments.
 */

var bs_a=Date.now(); console.log("blacksheep.js : debugger : " + bs_a + " : file " + "blacksheep-collapsible.js : loading");
var blacksheepCollapsibleModule = "MakeAppletCollapsible";
bsco.AddModule(blacksheepCollapsibleModule, //the name of the module
    {  //the JSON object with the configuration
        file : "blacksheep-collapsible.js", //name of the file that contains the module definition
        enabled : "yes",  //is the module enabled or not?
        autostart : "yes",
        mandatory : "no",  //is the module mandatory? This should be "no" for a custom extension
        //message types must be added to the blacksheep message array
        label : "MOD_COLL_LABEL", //the message type for the translatable display name (e.g. on user preferences dialog)
        description : "MOD_COLL_DESC", //the message type for the translatable module description
        dependencies : ["core"], //dependencies for this module. This is an array of other modules (see blacksheep-conf.js for OOB modules)
        userconfig : "yes", //is this module configurable by the user (user preferences)?
        useroptions : {
            "c_duration":{
                "description":"MOD_COLL_CDUR_DESC",
                "type" : "text",
                "widget" : ["slider",{step:100,min:0,max:5000}],
                "value" : 700,
                "default" : 700
            },
            "c_easing":{
                "description":"MOD_COLL_CEAS_DESC",
                "type":"text",
                "widget" : ["lov","JQ_EASING"],
                "value": "easeInSine",
                "default": "easeInSine"
            },
            "e_duration":{
                "description":"MOD_COLL_EDUR_DESC",
                "type" : "text",
                "widget" : ["slider",{step:100,min:0,max:5000}],
                "value" : 200,
                "default": 200
            },
            "e_easing":{
                "description":"MOD_COLL_EEAS_DESC",
                "type":"text",
                "widget" : ["lov","JQ_EASING"],
                "value": "easeOutSine",
                "default": "easeOutSine"
            },
            "storage_default" : "all"},
        scope : ["Applet"], //the scope(s) of this module. This is an array. Valid values are "Application","View","Applet","Control"
        pre_function : "cleanup",
        //the optional whitelist definition. If a whitelist definition is available, the module will only be executed for the objects listed
        //keyword "all" is supported to put all objects of the same type in the whitelist
        //if you omit an entry in the whitelist, it is treated like "all"
        whitelist : {
            //"applications":["Siebel Universal Agent","Siebel Power Communications"],  //array of Application definitions (as in Siebel Repository)
            "screens":["Accounts Screen","Contacts Screen"],   //array of Screens names (as in Siebel Repository)
            //"views":["all"], //array of View definitions
            "applets":["all"] //array of Applet definitions
            //"bos":["all"], //array of Business Object definitions
            //"bcs":["Service Request","Contact"] //array of Business Component definitions
        }},
    true //override any existing module definition with the same name?
);

//
//the main if block checks if the new object is still undefined (as is customary in Open UI)
//we also check if blacksheep.js core is enabled and
//if the main function is also enabled

if (SiebelAppFacade.Blacksheep.prototype.ShouldItExist(SiebelAppFacade.BlacksheepCollapsible,blacksheepCollapsibleModule))  {



    //We're good citizens, so we add the object to the SiebelAppFacade namespace
    SiebelJS.Namespace("SiebelAppFacade.BlacksheepCollapsible");

    //The object declared as a function
    SiebelAppFacade.BlacksheepCollapsible = function () {
                                                                                                                        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function SiebelAppFacade.BlacksheepCollapsible() : "; console.log(bsd + a + f + "begin"); }
        //The constructor function
        function BlacksheepCollapsible() { console.log(this.GetMsg("INIT_CONSTR",true) + "BlacksheepCollapsible"); }
        //get the module definition
        var bs = new SiebelAppFacade.Blacksheep();
        var md = bsco.GetModule(blacksheepCollapsibleModule);
        //if your module needs translatable strings, you must define them now
        //see the example below for German and any other language

        bs.SetMsg(md.label,"Klapp-Applets","deu");
        bs.SetMsg(md.description,"Aktiviert die Siebel-spezifische Klappfunktion für Applets mit komfortablen Erweiterungen.","deu");
        bs.SetMsg(md.useroptions.c_duration.description,"Dauer für Einklapp-Animation","deu");
        bs.SetMsg(md.useroptions.c_duration.description,"Duration for collapse animation","enu");
        bs.SetMsg(md.useroptions.e_duration.description,"Dauer für Ausklapp-Animation","deu");
        bs.SetMsg(md.useroptions.e_duration.description,"Duration for expand animation","enu");
        bs.SetMsg(md.useroptions.c_easing.description,"Art der Einklapp-Animation","deu");
        bs.SetMsg(md.useroptions.c_easing.description,"Type of collapse animation","enu");
        bs.SetMsg(md.useroptions.e_easing.description,"Art der Ausklapp-Animation","deu");
        bs.SetMsg(md.useroptions.e_easing.description,"Type of expand animation","enu");
        bs.SetMsg(md.label,"Collapsible Applets","enu");
        bs.SetMsg(md.description,"Activates the Siebel-specific collapsibility for applets and adds comfort functions.","enu");
        bs.SetMsg("MOD_COLL_COLLAPSE","Click to collapse.","enu");
        bs.SetMsg("MOD_COLL_COLLAPSE","Klick zum Einklappen.","deu");
        bs.SetMsg("MOD_COLL_EXPAND","Click to expand.","enu");
        bs.SetMsg("MOD_COLL_EXPAND","Klick zum Ausklappen.","deu");
        bs.SetMsg("JQ_EASING",{"linear":"Linear","swing":"Swing","easeInSine":"Inbound Sine","easeOutSine":"Outbound Sine"},"enu");
        bs.SetMsg("JQ_EASING",{"linear":"Linear","swing":"Schaukeln","easeInSine":"Sinus innen","easeOutSine":"Sinus aussen"},"deu");

        //In blacksheep.js, we use our own Extender function to add extension functions to the core module
        //So we declare a container object that will hold all functions we define
        var extensions = {};

        //Add custom functions after this line; use extensions.FunctionName = function(){}; as template!

        //This is the main function (aka module). All blacksheep.js modules should have at least one argument which
        //references the 'context', which usually is a PM, a PR or an object (applet,control) instance
        extensions.MakeAppletCollapsible = function(context,mode){
                                                                                                                        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepCollapsible.prototype.MakeAppletCollapsible(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["MakeAppletCollapsible__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            //we should always have a variable retval to hold the return value, usually defaults to false
            var retval = false;

            //It is recommended to keep the following lines to establish a proper module
            //first, we store the module name as a variable so we can reuse it
            var modname = blacksheepCollapsibleModule;
            //then we check if a whitelist exists for the module (see blacksheep-conf.js for example whitelists)
            var wl = bs.GetWhiteList(modname);
            //and we can now process the whitelist
            //if you do not wish to use the whitelisting feature, simply set is_whitelisted = true;
            var is_whitelisted = bs.ProcessWhiteList(wl); //pass context as second parameter if you have it, defaults to active PM
            //most functions will require a pm instance so we start with a variable to hold it
            var pm = null;

            //TODO: undo all DOM manipulations of your module here
            //we undo all changes that we implement
            //for example, our module implements a click event handler on the logo, so we make sure to remove it
            //we can use the module definition to specify a 'pre' function in the prototype, so this
            //can be externalized nicely
            
            BlacksheepCollapsible.prototype[md.pre_function].call(this,bs.ValidateContext(context));
            //if we get inside the next if block, the module is whitelisted for the current context.
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
                    //the following two lines (commented) demonstrate how to get the applet DOM element and applet element id (maybe you want to append some elements to the applet?
                    //var appletElem = bs.GetAppletElem(pm);
                    //var appletId = pm.Get("GetFullId");

                    //if your module is user configurable, you should keep the following lines
                    var propname = bs.GetMsg("PMPROP_MOD_PREFIX") + modname;  //the prefix of the user preference name
                    var propsys = bs.GetMsg("PMPROP_MOD_SYS"); //the 'system' suffix
                    var propuser = bs.GetMsg("PMPROP_MOD_USER"); //the 'user' suffix
                    //see if the module has been enabled/disabled by the user already
                    var is_user_enabled = bs.GetUserPref(pm,propname + propuser);
                    //anyway, the module is system enabled (i.e. enabled and whitelisted) so we can set the system property
                    //note that this needs a proper PM
                    pm.SetProperty(propname + propsys,true);

                    //the following is example code that creates a simple message
                    //the message is written to the console and displayed in a dialog when you click the application logo
                    //this serves as an example how to implement your desired functionality
                    var msg = "";


                    //now we check if the module is enabled by the user
                    if (typeof(is_user_enabled) === "undefined" || is_user_enabled == "true" || is_user_enabled == true){
                        //if we are here, the user has either explicitly enabled the module, or it is the first time
                        //modules in blacksheep.js are enabled by default.

                        
                        var u_opt = bs.GetSavedModuleOptions(pm,modname);
                        var viewname = SiebelApp.S_App.GetActiveView().GetName();
                        
                        //check for stored state in user pref
                        var key = viewname + bs.GetMsg("APPLET_STATE");
                        var state = bs.GetUserPref(pm,key);
                        if (state == "expanded" || state == "collapsed"){ //we got a user pref already...
                            //override mode argument
                            mode = state;
                        }
                        //check if PM property is not already set in repository
                        var repstate = pm.Get("defaultAppletDisplayMode");
                        if (!repstate) { //not set
                            //set property
                            if (mode == "expanded" || mode == "collapsed"){
                                pm.SetProperty("defaultAppletDisplayMode",mode);
                            }
                            else{ //default to "expanded"
                                pm.SetProperty("defaultAppletDisplayMode","expanded");
                            }
                            //get the PR
                            var pr = pm.GetRenderer();
                            //check and execute ShowCollapseExpand to trigger immediate display
                            if (pr && typeof(pr.ShowCollapseExpand) === 'function'){
                                pr.ShowCollapseExpand();
                            }
                        }
                        //get the collapse/expand buttons
                        var appletElem = bs.GetAppletElem(pm);
                        var cb = appletElem.find(".siebui-btn-icon-collapsed");
                        var eb = appletElem.find(".siebui-btn-icon-expanded");
                        cb.attr("title",bs.GetMsg("MOD_COLL_COLLAPSE") + " " + bs.GetMsg("CTRL_CLICK_TIP"));
                        eb.attr("title",bs.GetMsg("MOD_COLL_EXPAND") + " " + bs.GetMsg("CTRL_CLICK_TIP"));
                        if (repstate){ //PM user prop was defined in repository
                            if (repstate != state && state == "collapsed") {
                                //we need to expand so press the right button

                                eb.click();

                            }
                            else if (repstate != state && state == "expanded"){
                                //we need to collapse so press the right button
                                cb.click();

                            }
                        }
                        if (state == "collapsed"){ eb.show();}
                        else if (state == "expanded"){ cb.show();}

                        //var that = this;
                        //establish click event handlers to capture state as user preference
                        var c_d = md.useroptions.c_duration.value;
                        var c_e = md.useroptions.c_easing.value;
                        var e_d = md.useroptions.e_duration.value;
                        var e_e = md.useroptions.e_easing.value;
                        

                        if (!$.isEmptyObject(u_opt)){  //userpref overrules cookie
                            c_d = u_opt.c_duration;
                            c_e = u_opt.c_easing;
                            e_d = u_opt.e_duration;
                            e_e = u_opt.e_easing;
                        }
                        cb.on("click",function(e){
                            e.stopImmediatePropagation();
                            if (e.ctrlKey){
                                bs.ShowOptionsDialog(pm,modname,this);
                            }
                            else{
                                bs.SetUserPref(pm,key,"collapsed");
                                $(this).parents(".siebui-applet-header.siebui-collapsible").find(".siebui-button-secondary").toggle();
                                $(this).parents(".siebui-applet:first").find(".siebui-applet-content.siebui-collapsible").slideToggle(c_d,c_e );
                                var pr = bs.GetActivePR();
                                if (typeof (pr.resize) !== "undefined"){
                                    (pr.resize).call(pr);
                                }
                            }
                        });
                        eb.on("click",function(e){
                            e.stopImmediatePropagation();
                            if (e.ctrlKey){
                                
                                bs.ShowOptionsDialog(pm,modname,this);
                            }
                            else{
                                bs.SetUserPref(pm,key,"expanded");
                                $(this).parents(".siebui-applet-header.siebui-collapsible").find(".siebui-button-secondary").toggle();
                                $(this).parents(".siebui-applet:first").find(".siebui-applet-content.siebui-collapsible").slideToggle(e_d, e_e);
                                var pr = bs.GetActivePR();
                                if (typeof (pr.resize) !== "undefined"){
                                    (pr.resize).call(pr);
                                }
                            }
                         });


                        //this is important, we have to ensure that the user preference is set to true
                        //so the framework recognizes this module as user enabled
                        bs.SetUserPref(pm,propname + propuser,true);
                        //we are reaching the point were everything seems to have executed OK,
                        //so we set our return value
                        retval = true;
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
                                                                                                                        if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes"){var zperf = Date.now(); blacksheep_perf_function_call["MakeAppletCollapsible__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        //Add custom functions here as needed, best to copy/paste the template function from above

        BlacksheepCollapsible.prototype.cleanup = function(pm){
            
            var appletElem = bs.GetAppletElem(pm);
            var cb = appletElem.find(".siebui-btn-icon-collapsed");
            var eb = appletElem.find(".siebui-btn-icon-expanded");
            cb.unbind("click");
            eb.unbind("click");
            eb.hide();
            cb.hide();
         };

        //Do not modify after this line!!!!
        //copy extensions container to prototype
        for (var fName in extensions) {
            BlacksheepCollapsible.prototype[fName] = extensions[fName];
        }
        //make container public
        BlacksheepCollapsible.prototype.Extensions = extensions;
        //extend core class
        var bs = new SiebelAppFacade.Blacksheep();
        bs.Extender(SiebelAppFacade.Blacksheep,BlacksheepCollapsible);

        retval = BlacksheepCollapsible;
                                                                                                                        if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
        return retval;
    }();
}
var bs_z=Date.now(); console.log("blacksheep.js : debugger : " + bs_z + " : file " + "blacksheep-collapsible.js : loaded : time(ms): " + parseInt(bs_z-bs_a)); blacksheep_perf_file_load["blacksheep-collapsible.js"] = parseInt(bs_z-bs_a); bs_z = bs_a = null;
//end of file