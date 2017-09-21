/*******************************************************************
 * File:          blacksheep-import.js
 * Author:        Alexander Hansal (alex@blacksheep-crm.com)
 * Description:   Universal Data Import for blacksheep.js.
 *                This module requires the presence of repository artifacts, see documentation for details!
 * *******************************************************************
 * Copyright (c)2017 Alexander Hansal
 */

var bs_a=Date.now(); console.log("blacksheep.js : debugger : " + bs_a + " : file " + "blacksheep-import.js : loading");

//Everything begins with the module definition
//A module is the main function you would call from e.g. postload to execute the main functionality of your extension
//the following is an example module definition, see line comments for details
var blacksheepIMPORTModule = "BlacksheepImport";  //optional (global) variable for the module main function
//the bsco object is already instantiated by the core code, so we can use it
bsco.AddModule(blacksheepIMPORTModule, //the name of the module
    {  //the JSON object with the configuration
        file : "blacksheep-import.js", //name of the file that contains the module definition
        enabled : "yes",  //is the module enabled or not?
        mandatory : "no",  //is the module mandatory? This should be "no" for a custom extension
        autostart : "yes",
        //next lines use message types
        // message types must be added to the blacksheep message array (see the SetMsg method calls below)
        label : "MOD_IMPORT_LABEL", //the message type for the translatable display name (e.g. on user preferences dialog)
        description : "MOD_IMPORT_DESC", //the message type for the translatable module description
        dependencies : ["core"], //dependencies for this module. This is an array of other modules (see blacksheep-conf.js for OOB modules)
        userconfig : "yes", //is this module configurable by the user? if "yes", it is displayed in the user preferences dialog.
        scope : ["Application"], //the scope(s) of this module. This is an array. Valid values are "Application","View","Applet","Control"
        useroptions : {
            "show_log":{
                "description":"MOD_IMPORT_SHOW_LOG",
                "type" : "text",
                "widget" : ["lov","LOV_YES_NO"],
                "value" : "yes",
                "default" : "yes"
            },
            "show_so":{
                "description":"MOD_IMPORT_SHOW_SO",
                "type" : "text",
                "widget" : ["lov","LOV_YES_NO"],
                "value" : "yes",
                "default" : "yes"
            },
            "storage_default" : "all"},
        pre_function : "cleanup", //the name of a function to be invoked before the main functionality (see below for an example). Usually for removing DOM manipulations.

        whitelist : {
            "applications":["Siebel Universal Agent","Siebel Power Communications"]  //array of Application definitions (as in Siebel Repository)
        }},
    true //override any existing module definition with the same name?
);

//TODO: make user configurable (Application scope)

if (SiebelAppFacade.Blacksheep.prototype.ShouldItExist(SiebelAppFacade.BlacksheepImport,blacksheepIMPORTModule))  {
    SiebelJS.Namespace("SiebelAppFacade.BlacksheepImport");

    //The object declared as a function
    SiebelAppFacade.BlacksheepImport = function () {

        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function SiebelAppFacade.BlacksheepImport() : "; console.log(bsd + a + f + "begin"); }
        //The constructor function
        function BlacksheepImport() { console.log(this.GetMsg("INIT_CONSTR",true) + "BlacksheepImport"); }
        //local instance of Blacksheep
        var bs = new SiebelAppFacade.Blacksheep();
        //get the module definition for later reference
        var md = bsco.GetModule(blacksheepIMPORTModule);

        //if your module needs translatable strings, you must define them now
        //see the example below for German and any other language
        bs.SetMsg(md.label,"Datenimport","deu");
        bs.SetMsg(md.description,"Universeller und flexibler Datenimport.","deu");
        bs.SetMsg(md.label,"Data Import","enu");
        bs.SetMsg(md.description,"Universal and flexible data import.","enu");
        bs.SetMsg(md.useroptions.show_log.description,"Zeige Protokoll nach Import","deu");
        bs.SetMsg(md.useroptions.show_log.description,"Show log after import","enu");
        bs.SetMsg(md.useroptions.show_so.description,"Zeige Statusobjekt nach Import","deu");
        bs.SetMsg(md.useroptions.show_so.description,"Show Status Object after import","enu");
        bs.SetMsg("MOD_IMPORT_END","Import Process complete. Please verify data.","enu");
        bs.SetMsg("MOD_IMPORT_END","Importvorgang abgeschlossen. Bitte überprüfen Sie die Daten.","deu");
        bs.SetMsg("MOD_IMPORT_PROG_1","Importing File '","enu");
        bs.SetMsg("MOD_IMPORT_PROG_2","' (","enu");
        bs.SetMsg("MOD_IMPORT_PROG_3"," bytes). ","enu");
        bs.SetMsg("MOD_IMPORT_PROG_4","Please wait.","enu");
        bs.SetMsg("MOD_IMPORT_PROG_1","Importiere Datei '","deu");
        bs.SetMsg("MOD_IMPORT_PROG_2","' (","deu");
        bs.SetMsg("MOD_IMPORT_PROG_3"," bytes). ","deu");
        bs.SetMsg("MOD_IMPORT_PROG_4","Bitte warten.","deu");
        bs.SetMsg("MOD_WF_LOG","Data Import Log","enu");
        bs.SetMsg("MOD_WF_LOG","Datenimportprotokoll","deu");
        bs.SetMsg("MOD_SO_LOG","Status Object","enu");
        bs.SetMsg("MOD_SO_LOG","Statusobjekt","deu");
        bs.SetMsg("MOD_IMPORT_ERROR","Import Workflow encountered errors. Please contact your administrator.","enu");
        bs.SetMsg("MOD_IMPORT_ERROR","Importprozess wegen Fehlern abgebrochen. Bitte kontaktieren Sie Ihren Administrator.","deu");
        //In blacksheep.js, we use our own Extender function to add extension functions to the core module
        //So we declare a container object that will hold all functions we define
        var extensions = {};

        //This is the main function (aka module). All blacksheep.js modules should have at least one argument which
        //references the 'context', which usually is a PM, a PR or an object (applet,control) instance
        //see the documentation on context validation
        extensions.BlacksheepImport = function(context){

            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepImport.prototype.BlacksheepImport(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["BlacksheepImport__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            //we should always have a variable retval to hold the return value, usually defaults to false
            var retval = false;

            //It is recommended to keep the following lines to establish a proper module
            //first, we store the module name as a variable so we can reuse it
            var modname = blacksheepIMPORTModule;

            //then we check if a whitelist exists for the module (see blacksheep-conf.js for example whitelists)
            var wl = bs.GetWhiteList(modname);

            //and we can now process the whitelist
            //if you do not wish to use the whitelisting feature, simply set is_whitelisted = true;
            var is_whitelisted = bs.ProcessWhiteList(wl); //pass context as second parameter if you have it, defaults to active PM

            //most functions will require a pm instance so we start with a variable to hold it
            var pm = true;

            //we undo all changes that we implement
            //for example, our module implements a click event handler, so we make sure to remove it
            //we can use the module definition to specify a 'pre' function in the prototype, so this
            //can be externalized nicely
            BlacksheepImport.prototype[md.pre_function].call(this,bs.ValidateContext(context));

            //when we get inside the next if block, the module is whitelisted for the current context.
            if (is_whitelisted){

                //object is in whitelist, put everything you want to execute in this block
                //for example, we can put a message to the console...
                console.log(bs.GetMsg("WL_TRUE",true) + modname + ", " + bs.GetActivePM().Get("GetName"));

                //now let's verify the context

                if (pm){
                    //OK, we have a pm, let's get on with it

                    //if your module is user configurable, you should keep the following lines
                    //var propname = bs.GetMsg("PMPROP_MOD_PREFIX") + modname;  //the prefix of the user preference name
                    //var propsys = bs.GetMsg("PMPROP_MOD_SYS"); //the 'system' suffix
                    //var propuser = bs.GetMsg("PMPROP_MOD_USER"); //the 'user' suffix

                    //see if the module has been enabled/disabled by the user already
                    //var is_user_enabled = bs.GetUserPref(pm,propname + propuser);
                    var cname_m = bs.GetMsg("COOKIE_MOD_PRE") + modname + bs.GetMsg("COOKIE_MOD_POST");
                    var is_user_enabled = jQuery.cookie(cname_m);

                    //anyway, the module is system enabled (i.e. enabled and whitelisted) so we can set the system property
                    //note that this needs a proper PM
                    //pm.SetProperty(propname + propsys,true);

                    //now we check if the module is enabled by the user
                    if (typeof(is_user_enabled) === "undefined" || is_user_enabled == "true" || is_user_enabled == true){

                        //******************************************************************************************
                        //   CUSTOM CODE STARTS HERE
                        //******************************************************************************************
                        $("li[name='Data Import']").show();
                        
                        var u_opt = bs.GetSavedModuleOptions(pm,modname);
                        var show_log = SiebelAppFacade.BlacksheepConfig.config.modules[modname].useroptions.show_log.default == "yes" ? true : false;
                        var show_so = SiebelAppFacade.BlacksheepConfig.config.modules[modname].useroptions.show_so.default == "yes" ? true : false;
                        if (!$.isEmptyObject(u_opt)){
                            show_log = (u_opt.show_log == "yes") ? true : false;
                            show_so = (u_opt.show_so == "yes") ? true : false;
                        }
                        var addedclickhandler = false;
                        var runcount = 0;
                        var import_started = false;
                        var in_error = false;
                        var err_text = "";
                        var perfs;
                        var perfe;
                        //bind a click event handler on the toolbar button
                        $("li[name='Data Import']").click(function(e){
                            if (e.ctrlKey){
                                e.stopImmediatePropagation();
                                bs.ShowOptionsDialog(bs.GetActivePM(),modname);
                            }
                            else{
                                //destroy any rogue dialog instances and reset helper vars
                                if ($(":ui-dialog[id*=ui-id-]").dialog("isOpen")){
                                    $(":ui-dialog[id*=ui-id-]").dialog("destroy");
                                    addedclickhandler = false;
                                    runcount = 0;
                                    import_started = false;
                                }

                                //catch any DOM modification and hope our dialog opens up soon...
                                /*$(":ui-dialog[id*=ui-id-]").on( "dialogopen", function( event, ui ) {
                                    alert("dialog open");
                                } );*/
                                $(document).bind('DOMSubtreeModified', function(e) {

                                    //test for presence of dialog content
                                    if ($("form[name='SIPopupIEForm']").length > 0){                                    //
                                        if (!addedclickhandler && runcount == 0){
                                            runcount++;

                                            //if no file is selected, deactivate Import button
                                            var filesArray = $("form[name='SIPopupIEForm']").find("input[type='file']")[0].files[0];
                                            if (typeof(filesArray) === "undefined"){
                                                var target = $("form[name='SIPopupIEForm']").find("a[title='Import']");
                                                //funny enough, CSS class doesn't do here...
                                                $(target).css("background","lightgray");
                                                $(target).css("pointer-events","none");
                                            }

                                            //remove any lurking progress bar instance
                                            $("form[name='SIPopupIEForm']").find("#blacksheep_data_import_wait").remove();

                                            //Hide Cancel button (doesn't work anyway)
                                            $("form[name='SIPopupIEForm']").find("a[title='Cancel']").hide();

                                            //reformat dialog
                                            $(":ui-dialog[id*=ui-id-]").dialog("option",{width:500});
                                            var tt = $("form[name='SIPopupIEForm']").find("input[type='file']").parents("table")[0];
                                            $(tt).css("height","50px");
                                            //$(".scField").first().addClass("blacksheep-data-import-title");
                                            $(".scField").first().parents("table").first().addClass("blacksheep-data-import-title");

                                            //for CSS testing
                                            /*
                                             
                                             var pb = bs.GenerateDOMElement("div",{class:"blacksheep-loading-bar",id:"blacksheep_data_import_wait"});
                                             var pbl = bs.GenerateDOMElement("div",{class:"blacksheep-loading-bar-label",id:"blacksheep_data_import_label"});
                                             pb.append(pbl);
                                             var pbtext = "Import started. please wait";
                                             pbl.text(pbtext);
                                             //$("form[name='SIPopupIEForm']").prepend(pb);
                                             var itbl = $("form[name='SIPopupIEForm']").find("input[type='file']").parents("table")[0];
                                             $(itbl).after(pb);
                                             pb.progressbar({value:false});
                                             */

                                            //Handle click on Import button
                                            $("form[name='SIPopupIEForm']").find("a[title='Import']").click(function(){
                                                perfs = Date.now();
                                                import_started = true;
                                                in_error = false;
                                                filesArray = $("form[name='SIPopupIEForm']").find("input[type='file']")[0].files[0];
                                                if (typeof(filesArray) !== "undefined"){
                                                    //show infinite progress bar
                                                    var filesize = filesArray.size; //in bytes
                                                    var filename = filesArray.name;
                                                    var key_f = "BLACKSHEEP_IMPORT_FILENAME";
                                                    sessionStorage.setItem(key_f,filename);
                                                    var key_s = "BLACKSHEEP_IMPORT_FILESIZE";
                                                    sessionStorage.setItem(key_s,filesize);
                                                    if ($("form[name='SIPopupIEForm']").find("#blacksheep_data_import_wait").length == 0){
                                                        var pb = bs.GenerateDOMElement("div",{class:"blacksheep-loading-bar",id:"blacksheep_data_import_wait"});
                                                        var pbl = bs.GenerateDOMElement("div",{class:"blacksheep-loading-bar-label",id:"blacksheep_data_import_label"});
                                                        pb.append(pbl);
                                                        var pbtext = bs.GetMsg("MOD_IMPORT_PROG_1");
                                                        pbtext += filename;
                                                        pbtext += bs.GetMsg("MOD_IMPORT_PROG_2");
                                                        pbtext += filesize;
                                                        pbtext += bs.GetMsg("MOD_IMPORT_PROG_3");
                                                        pbtext += bs.GetMsg("MOD_IMPORT_PROG_4");
                                                        pbl.text(pbtext);
                                                        //$("form[name='SIPopupIEForm']").prepend(pb);
                                                        var itbl = $("form[name='SIPopupIEForm']").find("input[type='file']").parents("table")[0];
                                                        $(itbl).after(pb);
                                                        pb.progressbar({value:false});
                                                    }
                                                    else{
                                                        $("form[name='SIPopupIEForm']").find("#blacksheep_data_import_wait").show();
                                                    }

                                                    //handle WF error popup
                                                    $(":ui-dialog[id*=ui-id-]").bind("DOMSubtreeModified",function(e){
                                                          if ($(this).text().indexOf("Error") >= 0){
                                                              in_error = true;
                                                              err_text = $(this).find("table.AppletBack").text();
                                                          }
                                                    });
                                                }
                                                else{
                                                    //no file loaded
                                                }
                                            });


                                            //Handle file selection
                                            $("form[name='SIPopupIEForm']").find("input[type='file']").change(function(e){
                                                var filesArray = $("form[name='SIPopupIEForm']").find("input[type='file']")[0].files[0];
                                                if (typeof(filesArray) !== "undefined"){
                                                    var target = $("form[name='SIPopupIEForm']").find("a[title='Import']");
                                                    $(target).css("background","");
                                                    $(target).css("pointer-events","");
                                                }
                                            });

                                            //handle dialog close event
                                            $(":ui-dialog[id*=ui-id-]").on( "dialogclose", function( e, ui ) {
                                                
                                                perfe = Date.now();
                                                var totaltime = (perfe - perfs)/1000;
                                                var profile1 =  SiebelApp.S_App.GetProfileAttr("blacksheep_IMPORT_1");
                                                if (profile1 != ""){
                                                    profile1 = profile1.replace(/\'/g,"\"");
                                                    profile1 = profile1.replace(/\\/g,"\\\\");
                                                    profile1 = JSON.parse(profile1);
                                                    var pid = profile1["Process Instance Id"];
                                                    var key = "BLACKSHEEP_IMPORT_TIMER__" + pid;
                                                    sessionStorage.setItem(key,totaltime);
                                                }

                                                e.stopImmediatePropagation();
                                                if (import_started && in_error == false){
                                                    alert(bs.GetMsg("MOD_IMPORT_END"));
                                                }
                                                //show log
                                                
                                                if (import_started == true && show_log == true && in_error == false){
                                                    var log = bs.GetWorkflowLog("blacksheep Import Process");
                                                    $.getScript(SIEBEL_BUILD + "siebel/custom/blacksheep/3rdParty/prettyprint/prettyPrint.js").complete(function(){
                                                        var tbl = bs.GenerateDOMElement("div");
                                                        $(tbl).append(prettyPrint(log));
                                                        $(tbl).dialog({width:600,height:450,title:bs.GetMsg("MOD_WF_LOG")}).css({height:"350px", overflow:"auto"});
                                                    });

                                                    if (show_so == true){
                                                    var so = bs.GetStatusObject();
                                                    $.getScript(SIEBEL_BUILD + "siebel/custom/blacksheep/3rdParty/prettyprint/prettyPrint.js").complete(function(){
                                                        var sotbl = bs.GenerateDOMElement("div");
                                                        $(sotbl).append(prettyPrint(so));
                                                        $(sotbl).dialog({width:500,height:450,title:bs.GetMsg("MOD_SO_LOG")}).css({height:"350px", overflow:"auto"});
                                                    });
                                                    }
                                                }
                                                if (in_error == true){
                                                    alert(bs.GetMsg("MOD_IMPORT_ERROR"));
                                                }

                                                addedclickhandler = false;
                                                runcount = 0;
                                                import_started = false;
                                                $(document).unbind('DOMSubtreeModified');
                                            } );
                                            addedclickhandler = true;

                                        }
                                    }
                                });
                            }
                        });

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
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }  if (bsc.perf == "yes"){var zperf = Date.now(); blacksheep_perf_function_call["BlacksheepImport__" + "()" + "__" + aperf]["End"]=zperf;}
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
         if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepImport.prototype.CustomExtension(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }
         //do something clever here
         if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
         return retval;
         };
         */


        BlacksheepImport.prototype.cleanup = function(pm){
            $("li[name='Data Import']").hide();
            $(document).unbind('DOMSubtreeModified');

        };

        extensions.GetStatusObject = function(){
            var retval = false
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepImport.prototype.GetStatusObject(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetStatusObject__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var so = SiebelApp.S_App.GetProfileAttr("blacksheep_IMPORT_SO");
            var ps = SiebelApp.S_App.NewPropertySet();
            ps.DecodeFromString(so);
            ps = ps.GetChild(0);
            var isvalid = true;
            var soj = {};
            var propcount = ps.GetChild(0).GetPropertyCount();
            if (propcount == 0){
                isvalid = false;
            }
            var count = ps.GetChildCount();
            if (isvalid){

                for (i = 0; i < count; i++) {
                    var obj = "Object " + (i+1);
                    soj[obj] = {};
                    var props = ps.GetChild(i).propArray;
                    for (p in props){
                        if (typeof(props[p]) !== "function"){
                            soj[obj][p] = props[p];
                        }
                    }
                }
            }
            else{
                 soj["Message"] = "No Status Object returned.";
            }
            retval = soj;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); } if (bsc.perf == "yes"){var zperf = Date.now(); blacksheep_perf_function_call["GetStatusObject__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        extensions.GetWorkflowLog = function(processname){
            
            var retval = false
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepImport.prototype.GetWorkflowLog(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetWorkflowLog__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var profile1 =  SiebelApp.S_App.GetProfileAttr("blacksheep_IMPORT_1");
            profile1 = profile1.replace(/\'/g,"\"");
            profile1 = profile1.replace(/\\/g,"\\\\");
            profile1 = JSON.parse(profile1);
            var pid = profile1["Process Instance Id"];
            var serverfilepath = profile1["File Path"];
            var filetype = profile1["File Type"];
            var profile2 =  SiebelApp.S_App.GetProfileAttr("blacksheep_IMPORT_2");
            profile2 = profile2.replace(/\'/g,"\"");
            profile2 = profile2.replace(/\\/g,"\\\\");
            profile2 = JSON.parse(profile2);
            var csv_count =  profile2["RecordCountCSV"];
            csv_count = csv_count.replace(/,/g, '');
            var key_t = "BLACKSHEEP_IMPORT_TIMER__" + pid;
            var totaltime = sessionStorage.getItem(key_t);
            var key_f = "BLACKSHEEP_IMPORT_FILENAME";
            var filename = sessionStorage.getItem(key_f);
            var key_s = "BLACKSHEEP_IMPORT_FILESIZE";
            var filesize = sessionStorage.getItem(key_s);
            var records_sec = Math.round(parseFloat(csv_count)/parseFloat(totaltime));

            var instance_id = null;
            var step_data;
            var log = {};
            var instance_data = bs  .DataRetriever("blacksheep Workflow Process Monitor","Workflow Process Instance Monitor","[Instance Id]='" + pid + "'","Id",{"Start Date":"","End Date":"","Server":"","Status":"","Id":"","Current Step":"","StopDate":""},{viewmode:3,log:false});
            if (instance_data.GetChildCount() == 1){
                instance_id = instance_data.GetChild(0).GetProperty("Id");
            }
            else{
                //no instance data found
            }
            if (instance_id){
                step_data = bs.DataRetriever("blacksheep Workflow Process Monitor","Workflow Step Instance Monitor","[Id] IS NOT NULL","Id",{"Step Name":"","Start Date":"","End Date":"","Status":"","Id":""},{pbc:"Workflow Process Instance Monitor",rowid:instance_id, viewmode:3,log:false});
            }
            if (instance_data.GetChildCount() == 1 && step_data.GetChildCount() > 0){
                var idata = instance_data.GetChild(0);
                log["File Info"] = {};
                log["File Info"]["File Name"] = filename;
                log["File Info"]["File Size"] = filesize + " bytes";
                log["File Info"]["Record Count"] = csv_count;
                log["Workflow Log"] = {};
                log["Workflow Log"]["Workflow Process Name"] = processname;
                log["Workflow Log"]["Process Instance Id"] = instance_id;
                log["Workflow Log"]["Start Date"] = idata.GetProperty("Start Date");
                log["Workflow Log"]["End Date"] = idata.GetProperty("End Date");
                log["Workflow Log"]["Status"] = idata.GetProperty("Status");
                var st = +new Date(idata.GetProperty("Start Date"));
                var et = +new Date(idata.GetProperty("End Date"));
                var processtime = (et - st)/1000;
                log["Workflow Log"]["Duration"] = processtime + " s";
                log["Workflow Log"]["Records/sec"] = records_sec;
                log["File Info"]["Upload Duration"] = Math.round(totaltime - processtime) + " s";
                var sdata = step_data.childArray;
                for (i = 0; i < step_data.GetChildCount(); i++){
                    var step_num = "Step " + (i + 1);
                    log["Workflow Log"][step_num]= {};
                    log["Workflow Log"][step_num]["Step Name"] = sdata[i].GetProperty("Step Name");
                    log["Workflow Log"][step_num]["Start Date"] = sdata[i].GetProperty("Start Date");
                    log["Workflow Log"][step_num]["End Date"] = sdata[i].GetProperty("End Date");
                    log["Workflow Log"][step_num]["Status"] = sdata[i].GetProperty("Status");
                    st = +new Date(sdata[i].GetProperty("Start Date"));
                    et = +new Date(sdata[i].GetProperty("End Date"));
                    log["Workflow Log"][step_num]["Duration"] = (et - st)/1000 + " s";
                }
            }
            else{
                log["Workflow Log"] = {"Message":"No data. Set Monitoring Level to 2 or higher to see workflow log."};
            }
            retval = log;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); } if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetWorkflowLog__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            return retval;
        };

        //******************************************************************************************
        //   CUSTOM CODE ENDS HERE
        //******************************************************************************************

        //Do not modify after this line!!!!
        //copy extensions container to prototype
        for (var fName in extensions) {
            BlacksheepImport.prototype[fName] = extensions[fName];
        }
        //make container public
        BlacksheepImport.prototype.Extensions = extensions;
        //extend core class
        var bs = new SiebelAppFacade.Blacksheep();
        bs.Extender(SiebelAppFacade.Blacksheep,BlacksheepImport);

        retval = BlacksheepImport;
        if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
        return retval;
    }();
}
var bs_z=Date.now(); console.log("blacksheep.js : debugger : " + bs_z + " : file " + "blacksheep-import.js : loaded : time(ms): " + parseInt(bs_z-bs_a)); blacksheep_perf_file_load["blacksheep-import.js"] = parseInt(bs_z-bs_a); bs_z = bs_a = null;
//end of file


