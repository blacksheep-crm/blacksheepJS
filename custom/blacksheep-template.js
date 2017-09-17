/*******************************************************************
 * File:          blacksheep-template.js
 * Author:        Alexander Hansal (alex@blacksheep-crm.com)
 * Description:   Template for custom extension files for blacksheep.js, a professional utility library and API extension for Oracle Siebel CRM.
 * *******************************************************************
 * Copyright (c)2017 Alexander Hansal

 * USE THIS TEMPLATE FOR GETTING STARTED WITH blacksheep.js
 */

//First thing you want to do is choose a meaningful name for your new file (for example, you could save this file as a new file),
//and the object name (replace 'SiebelAppFacade.BlacksheepTEMPLATE' with it),
//and finally the main function (aka 'module') (replace 'BlacksheepTemplateMainFunction' with it)

//log the file load with a timer
    //if you have copied this file, make sure the file name in the next line is referencing the new file
var bs_a=Date.now(); console.log("blacksheep.js : debugger : " + bs_a + " : file " + "blacksheep-template.js : loading");

//Everything begins with the module definition
//A module is the main function you would call from e.g. postload to execute the main functionality of your extension
//the following is an example module definition, see line comments for details
var blacksheepTEMPLATEModule = "BlacksheepTemplateMainFunction";  //optional (global) variable for the module main function
//the bsco object is already instantiated by the core code, so we can use it
bsco.AddModule(blacksheepTEMPLATEModule, //the name of the module
    {  //the JSON object with the configuration
        file : "blacksheep-template.js", //name of the file that contains the module definition
        enabled : "no",  //is the module enabled or not?
        mandatory : "no",  //is the module mandatory? This should be "no" for a custom extension
        autostart : "yes",
        //next lines use message types
        // message types must be added to the blacksheep message array (see the SetMsg method calls below)
        label : "MOD_TEMPLATE_LABEL", //the message type for the translatable display name (e.g. on user preferences dialog)
        description : "MOD_TEMPLATE_DESC", //the message type for the translatable module description
        dependencies : ["core"], //dependencies for this module. This is an array of other modules (see blacksheep-conf.js for OOB modules)
        userconfig : "yes", //is this module configurable by the user? if "yes", it is displayed in the user preferences dialog.
        scope : ["Applet"], //the scope(s) of this module. This is an array. Valid values are "Application","View","Applet","Control"
        pre_function : "cleanup", //the name of a function to be invoked before the main functionality (see below for an example). Usually for removing DOM manipulations.
        //useroptions allow you to define user-configurable details. The example defines a custom text entry field (used in the main code below).
        useroptions : {
            "customtext":{
                "description":"MOD_TEMPLATE_CUSTOMTEXT",  //translatable description, used as label in the options dialog
                "type" : "text",
                "value" : "Custom Text Example",         //value at runtime, initialized with default
                "default" : "Custom Text Example"        //default value
            },
            "storage_default" : "all"},   //this parameter drives the default state for the checkbox to save options for the current object ("userpref") or all objects ("all");
        //the optional whitelist definition. If a whitelist definition is available, the module will only be executed for the objects listed
        //keyword "all" is supported to put all objects of the same type in the whitelist
        //if you omit an entry in the whitelist, it is treated like "all"

        whitelist : {
            "applications":["Siebel Universal Agent","Siebel Power Communications"],  //array of Application definitions (as in Siebel Repository)
            //"screens":["Accounts Screen","Contacts Screen"],   //array of Screens (note: due to limitations, use the screen tab name displayed in the client
            "views":["all"], //array of View definitions
            "applets":["all"], //array of Applet definitions
            "bos":["all"], //array of Business Object definitions
            "bcs":["Service Request","Contact"] //array of Business Component definitions
        }},
    true //override any existing module definition with the same name?
);

//
//the main if block checks if the new object is still undefined (as is customary in Open UI)
//we also check if blacksheep.js core is enabled and
//if the main function is also enabled

if (SiebelAppFacade.Blacksheep.prototype.ShouldItExist(SiebelAppFacade.BlacksheepTEMPLATE,blacksheepTEMPLATEModule))  {



    //We're good citizens, so we add the object to the SiebelAppFacade namespace
    SiebelJS.Namespace("SiebelAppFacade.BlacksheepTEMPLATE");

    //The object declared as a function
    SiebelAppFacade.BlacksheepTEMPLATE = function () {

//look to your right to see the debug blocks. You can enable/disable debug mode in blacksheep-conf.js
//out of the box, we have a debug message at the beginning and at the end of each function and/or file
//notice that we establish variables a (begin time in ms), f (file/function name) and z (end time in ms),
//so DO NOT declare variables named a,f or z in your code!
//it is recommended to keep the debug blocks. If you decide to remove them, make sure you remove the begin and end blocks
//correctly to avoid run-time errors.

                                                                                                                        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function SiebelAppFacade.BlacksheepTEMPLATE() : "; console.log(bsd + a + f + "begin"); }
        //The constructor function
        function BlacksheepTEMPLATE() { console.log(this.GetMsg("INIT_CONSTR",true) + "BlacksheepTEMPLATE"); }
        //local instance of Blacksheep
        var bs = new SiebelAppFacade.Blacksheep();
        //get the module definition for later reference
        var md = bsco.GetModule(blacksheepTEMPLATEModule);

        //if your module needs translatable strings, you must define them now
        //see the example below for German and any other language
        bs.SetMsg(md.label,"Vorlage","deu");
        bs.SetMsg(md.description,"Eine Lernvorlage für Kundenerweiterungen.","deu");
        bs.SetMsg(md.useroptions.customtext.description, "Texteingabe: ","deu");
        bs.SetMsg(md.label,"Template","enu");
        bs.SetMsg(md.description,"A self-study template for custom extensions.","enu");
        bs.SetMsg(md.useroptions.customtext.description, "Enter text: ","enu");
        bs.SetMsg("MOD_TEMPLATE_SAYS"," says: ","enu");
        bs.SetMsg("MOD_TEMPLATE_SAYS"," sagt: ","deu");

        //In blacksheep.js, we use our own Extender function to add extension functions to the core module
        //So we declare a container object that will hold all functions we define
        var extensions = {};

        //This is the main function (aka module). All blacksheep.js modules should have at least one argument which
        //references the 'context', which usually is a PM, a PR or an object (applet,control) instance
        //see the documentation on context validation
        extensions.BlacksheepTemplateMainFunction = function(context){
                                                                                                                        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepTEMPLATE.prototype.BlacksheepTemplateMainFunction(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["BlacksheepTemplateMainFunction__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            //we should always have a variable retval to hold the return value, usually defaults to false
            var retval = false;

            //It is recommended to keep the following lines to establish a proper module
            //first, we store the module name as a variable so we can reuse it
            var modname = blacksheepTEMPLATEModule;

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
            BlacksheepTEMPLATE.prototype[md.pre_function].call(this,bs.ValidateContext(context));

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

                        //if we are here, the user has either explicitly enabled the module, or it is the first time
                        //modules in blacksheep.js are enabled by default.

                        //if your module displays dialogs, declare the dialog template(s) now

                        bs.AddDialogTemplate("MOD_TEMPLATE_DLG",{
                                buttons: [
                                    {
                                        text: bs.GetMsg("BTN_CLOSE"),
                                        click: function() {
                                            $(this).dialog("destroy");
                                        }
                                    }
                                ],
                                width: 300,
                                height: 300,
                                modal: true,
                                title : bs.GetMsg("MOD_TEMPLATE_LABEL"),
                                bs_html: ""
                            },
                            true);

                        // This is the main functionality,
                        // the example scenario for this template is a doubleclick event handler on the applet header
                        //get the applet DOM element, using a blacksheep API function
                        var ap = bs.GetAppletElem(pm);

                        //find the header and register a callback function for doubleclick
                        ap.find(".siebui-applet-header").dblclick(handleClick);

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
                                                                                                                        if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes"){var zperf = Date.now(); blacksheep_perf_function_call["BlacksheepTemplateMainFunction__" + "()" + "__" + aperf]["End"]=zperf;}
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
                                                                                                                        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepTEMPLATE.prototype.CustomExtension(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["CustomExtension__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            //do something clever here
                                                                                                                        if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes"){var zperf = Date.now(); blacksheep_perf_function_call["CustomExtension__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };
        */

        //this template uses a local function to handle the (double) click
        //the scenario is to display a dialog with a simple message
        //the user can define the message as a module option in the user preferences dialog
        function handleClick(){
            //since we are outside the closure, we need to find out which applet was clicked
            var id = $(this).closest(".siebui-applet").parent().attr("id");

            //now we can get the PM, note that we can pass the applet DOM id (e.g. S_A1) to ValidateContext, cool...
            var pm = bs.ValidateContext(id);

            //get the useroptions for the current object and module
            debugger;
            var u_opt = bs.GetSavedModuleOptions(pm,blacksheepTEMPLATEModule);

            //now we can extract the current value for the custom option
            var msg = u_opt.customtext;

            //prepare the message text
            msg =  pm.GetObjName() + bs.GetMsg("MOD_TEMPLATE_SAYS") + msg;

            //show the message in a dialog (we use the dialog template defined above)
            bs.ShowDialog("MOD_TEMPLATE_DLG",msg);
        }

        //the next is the function defined to run before the main code (aka "cleanup")
        //we add it to the current object prototype but not to extensions because it is not needed outside of this module
        BlacksheepTEMPLATE.prototype.cleanup = function(pm){
            //get the PM and applet element
            var ap = bs.GetAppletElem(pm);

            //undo all DOM manipulations, in our case we need to unbind the double click handler
            ap.find(".siebui-applet-header").unbind("dblclick",handleClick);

        };

        //******************************************************************************************
        //   CUSTOM CODE ENDS HERE
        //******************************************************************************************

        //Do not modify after this line!!!!
        //copy extensions container to prototype
        for (var fName in extensions) {
            BlacksheepTEMPLATE.prototype[fName] = extensions[fName];
        }
        //make container public
        BlacksheepTEMPLATE.prototype.Extensions = extensions;
        //extend core class
        var bs = new SiebelAppFacade.Blacksheep();
        bs.Extender(SiebelAppFacade.Blacksheep,BlacksheepTEMPLATE);

        retval = BlacksheepTEMPLATE;
                                                                                                                        if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
        return retval;
    }();
}
var bs_z=Date.now(); console.log("blacksheep.js : debugger : " + bs_z + " : file " + "blacksheep-template.js : loaded : time(ms): " + parseInt(bs_z-bs_a)); blacksheep_perf_file_load["blacksheep-template.js"] = parseInt(bs_z-bs_a);  bs_z = bs_a = null;
//end of file
