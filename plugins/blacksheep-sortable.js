/*******************************************************************
 * File:          blacksheep-sortable.js
 * Author:        Alexander Hansal (alex@blacksheep-crm.com)
 * Description:   Sortable tabs for blacksheep.js, a professional utility library and API extension for Oracle Siebel CRM.
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

    //jQuery extension to support sortable tabs
//http://stackoverflow.com/questions/391314/jquery-insertat
$.fn.insertAt = function(index, $parent) {
    return this.each(function() {
        if (index === 0) {
            $parent.prepend(this);
        } else {
            $parent.children().eq(index - 1).after(this);
        }
    });
}

var bs_a=Date.now(); console.log("blacksheep.js : debugger : " + bs_a + " : file " + "blacksheep-sortable.js : loading");
var blacksheepSortableModule = "MakeTabsSortable";
bsco.AddModule(blacksheepSortableModule, //the name of the module
    {  //the JSON object with the configuration
        file : "blacksheep-sortable.js", //name of the file that contains the module definition
        enabled : "yes",  //is the module enabled or not?
        mandatory : "no",  //is the module mandatory? This should be "no" for a custom extension
        autostart : "yes",
        //message types must be added to the blacksheep message array
        label : "MOD_SORT_LABEL", //the message type for the translatable display name (e.g. on user preferences dialog)
        description : "MOD_SORT_DESC", //the message type for the translatable module description
        dependencies : ["core"], //dependencies for this module. This is an array of other modules (see blacksheep-conf.js for OOB modules)
        userconfig : "yes", //is this module configurable by the user (user preferences)?
        scope : ["Application"], //the scope(s) of this module. This is an array. Valid values are "Application","View","Applet","Control"
        pre_function : "cleanup",
        //the optional whitelist definition. If a whitelist definition is available, the module will only be executed for the objects listed
        //keyword "all" is supported to put all objects of the same type in the whitelist
        //if you omit an entry in the whitelist, it is treated like "all"
        whitelist : {
            "applications":["Siebel Universal Agent","Siebel Power Communications"] //array of Application definitions (as in Siebel Repository)

            //"views":["all"], //array of View definitions
            //"applets":["all"] //array of Applet definitions
            //"bos":["all"], //array of Business Object definitions
            //"bcs":["Service Request","Contact"] //array of Business Component definitions
        }},
    true //override any existing module definition with the same name?
);

//
//the main if block checks if the new object is still undefined (as is customary in Open UI)
//we also check if blacksheep.js core is enabled and
//if the main function is also enabled
 //TODO: fix issue with 4th level links (currently saved by view ...)
if (SiebelAppFacade.Blacksheep.prototype.ShouldItExist(SiebelAppFacade.BlacksheepSortable,blacksheepSortableModule))  {



    //We're good citizens, so we add the object to the SiebelAppFacade namespace
    SiebelJS.Namespace("SiebelAppFacade.BlacksheepSortable");

    //The object declared as a function
    SiebelAppFacade.BlacksheepSortable = function () {
                                                                                                                        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function SiebelAppFacade.BlacksheepSortable() : "; console.log(bsd + a + f + "begin"); }
        //The constructor function
        function BlacksheepSortable() { console.log(this.GetMsg("INIT_CONSTR",true) + "BlacksheepSortable"); }
        //get the module definition
        var bs = new SiebelAppFacade.Blacksheep();
        var md = bsco.GetModule(blacksheepSortableModule);
        //if your module needs translatable strings, you must define them now
        //see the example below for German and any other language

                bs.SetMsg(md.label,"Verschiebbare Registerkarten","deu");
                bs.SetMsg(md.description,"Einfaches Anordnen der Registerkarten mit drag and drop.","deu");
                bs.SetMsg(md.label,"Sortable Tabs","enu");
                bs.SetMsg(md.description,"Easy arrangement of tabs with drag and drop.","enu");



        //In blacksheep.js, we use our own Extender function to add extension functions to the core module
        //So we declare a container object that will hold all functions we define
        var extensions = {};

        //Add custom functions after this line; use extensions.FunctionName = function(){}; as template!

        //This is the main function (aka module). All blacksheep.js modules should have at least one argument which
        //references the 'context', which usually is a PM, a PR or an object (applet,control) instance
        extensions.MakeTabsSortable = function(context){
                                                                                                                        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepSortable.prototype.MakeAppletSortable(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }
            //we should always have a variable retval to hold the return value, usually defaults to false
            var retval = false;

            //It is recommended to keep the following lines to establish a proper module
            //first, we store the module name as a variable so we can reuse it
            var modname = blacksheepSortableModule;
            //then we check if a whitelist exists for the module (see blacksheep-conf.js for example whitelists)
            var wl = bs.GetWhiteList(modname);
            //and we can now process the whitelist
            //if you do not wish to use the whitelisting feature, simply set is_whitelisted = true;
            var is_whitelisted = bs.ProcessWhiteList(wl); //pass context as second parameter if you have it, defaults to active PM
            //most functions will require a pm instance so we start with a variable to hold it
            
            //var pm = null;

            //TODO: undo all DOM manipulations of your module here
            //we undo all changes that we implement
            //for example, our module implements a click event handler on the logo, so we make sure to remove it
            //we can use the module definition to specify a 'pre' function in the prototype, so this
            //can be externalized nicely
            
            BlacksheepSortable.prototype[md.pre_function].call(this);
            //if we get inside the next if block, the module is whitelisted for the current context.
            if (is_whitelisted){
                //object is in whitelist, put everything you want to execute in this block
                //for example, we can put a message to the console...
                console.log(bs.GetMsg("WL_TRUE",true) + modname);
                /*
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
                } */
                if (true){
                    var cname_m = bs.GetMsg("COOKIE_MOD_PRE") + modname + bs.GetMsg("COOKIE_MOD_POST");
                    var is_user_enabled = jQuery.cookie(cname_m);
                    //var nav = SiebelApp.S_App.GetAppPropertySet().GetChild(0).GetChildByType("nncm").GetChildByType("nci").GetChildByType("SI").GetProperty("ObjectName");
                    var nav = SiebelApp.S_App.GetProfileAttr("Navigation Type");
                    //now we check if the module is enabled by the user
                    if (typeof(is_user_enabled) === "undefined" || is_user_enabled == "true" || is_user_enabled == true){
                        if (typeof(nav) === "undefined" || nav == "NAVIGATION_TAB"){
                        //if we are here, the user has either explicitly enabled the module, or it is the first time
                        var tabs = {};
                        //var tabtext = "";
                        //var cookie_value = "";
                        //var cookie_name = "BS_TABLAYOUT";
                        var scr = $(".siebui-nav-tab ul");
                        //scr = $("[class*=siebui-nav] ul"); for side menu


                        scr.sortable({snap:true});
                        var appName = SiebelApp.S_App.GetAppName();
                        var screenName = $(".siebui-nav-tabScreen .siebui-active-navtab").first().text(); //workaround until solution is found to read repository name of active screen
                        var viewName = SiebelApp.S_App.GetActiveView().GetName();
                        var boName = SiebelApp.S_App.GetActiveBusObj().GetName();
                        var cookie_names = new Array();
                        for (i = 0; i < 4; i++){
                            var cname = bs.GetMsg("COOKIE_MOD_PRE") + modname + "_LEVEL" + (i+1);
                            switch(i+1){
                            case 1: cname += "_APP_" + appName;
                                break;
                            case 2: cname += "_SCR_" + screenName;
                                break;
                            case 3: cname += "_BO_" + boName;
                                break;
                            case 4: cname += "_VIEW_" + viewName;
                                break;
                            default:
                                break;
                            }
                            cookie_names[i] = cname;
                        }

                        var cookie_values = new Array();
                        for (i = 0; i < 4; i++){
                            cookie_values[i] = jQuery.cookie(cookie_names[i]);
                        }
                        var levels =["s_sctrl_tabScreen","s_sctrl_tabView","s_vctrl_div_tabScreen","s_vctrl_div_tabView"];
                        
                        //restore tabs from cookies
                        for (i = 0; i < 4; i++){
                            var tabs = new Array();
                            var ttext = "";
                            var el = "";
                            el_li = null;
                            el_ul = null;
                            if (typeof(cookie_values[i]) !== "undefined"){
                                tabs = cookie_values[i].split(",");
                                el = levels[i];
                                el_li = $("#" + el + " li");
                                el_ul = $("#" + el + " ul");
                                for (j = 0; j < tabs.length; j++){
                                    el_li.each(function(idx){
                                        ttext = $(this).text();
                                        if (ttext == tabs[j]){
                                            $(this).insertAt(j,el_ul);
                                            $(this).css("z-index","100");
                                        }
                                    });
                                }
                            }
                        }

                        scr.on("sortstop", function(event,ui) {
                            var level = 0;
                            var temp = new Array();
                            var parent = ui.item[0].parentElement.parentElement;
                            
                            var parentid = parent.id;
                            switch(parentid){
                                case "s_sctrl_tabScreen":
                                    level = 1;
                                    break;
                                case "s_sctrl_tabView":
                                //case "s_ssvctrl_tabView":
                                    level = 2;
                                    break;
                                case "s_vctrl_div_tabScreen":
                                    level = 3;
                                    break;
                                case "s_vctrl_div_tabView":
                                    level = 4;
                                    break;
                                default:
                                    level = 0;
                                    break;
                            }
                            if (level > 0){
                                $("#" + parentid + " li").each(function(idx){
                                   temp[idx] = $(this).text();
                                });
                                tabs[parentid] = temp;
                                jQuery.cookie(cookie_names[level-1],temp.toString(),{expires:999});
                            }
                        });




                        //this is important, we have to ensure that the user preference is set to true
                        //so the framework recognizes this module as user enabled
                        //bs.SetUserPref(pm,propname + propuser,true);
                        jQuery.cookie(cname_m,"true",{expires:999});
                        //we are reaching the point were everything seems to have executed OK,
                        //so we set our return value
                        retval = true;
                        }
                        else { //not NAVIGATION_TAB
                            jQuery.cookie(cname_m,"false",{expires:999});
                        }
                    }
                    else{
                        //if we are here, the user has disabled the module
                        console.log(modname + bs.GetMsg("PMPROP_DISABLED"));
                    }
                }


            }
            else{
                //object is not in whitelist
                console.log(bs.GetMsg("WL_FALSE",true) + modname );
            }
                                                                                                                        if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
            return retval;
        };

        //Add custom functions here as needed, best to copy/paste the template function from above

        BlacksheepSortable.prototype.cleanup = function(pm){

            var scr = $(".siebui-nav-tab ul");
            scr.sortable();
            scr.sortable("destroy");

        };

        //Do not modify after this line!!!!
        //copy extensions container to prototype
        for (var fName in extensions) {
            BlacksheepSortable.prototype[fName] = extensions[fName];
        }
        //make container public
        BlacksheepSortable.prototype.Extensions = extensions;
        //extend core class
        var bs = new SiebelAppFacade.Blacksheep();
        bs.Extender(SiebelAppFacade.Blacksheep,BlacksheepSortable);

        retval = BlacksheepSortable;
                                                                                                                        if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
        return retval;
    }();
}
var bs_z=Date.now(); console.log("blacksheep.js : debugger : " + bs_z + " : file " + "blacksheep-sortable.js : loaded : time(ms): " + parseInt(bs_z-bs_a)); blacksheep_perf_file_load["blacksheep-sortable.js"] = parseInt(bs_z-bs_a); bs_z = bs_a = null;
//end of file