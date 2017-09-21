/*******************************************************************
 * File:          blacksheep-rating.js
 * Author:        Alexander Hansal (alex@blacksheep-crm.com)
 * Description:   Rating facility for blacksheep.js, a professional utility library and API extension for Oracle Siebel CRM.
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


var bs_a=Date.now(); console.log("blacksheep.js : debugger : " + bs_a + " : file " + "blacksheep-rating.js : loading");
var blacksheepRatingModule = "ShowRatingBar";
bsco.AddModule(blacksheepRatingModule, //the name of the module
    {  //the JSON object with the configuration
        file : "blacksheep-rating.js", //name of the file that contains the module definition
        enabled : "yes",  //is the module enabled or not?
        mandatory : "no",  //is the module mandatory? This should be "no" for a custom extension
        autostart : "yes",
        //message types must be added to the blacksheep message array
        label : "MOD_RATE_LABEL", //the message type for the translatable display name (e.g. on user preferences dialog)
        description : "MOD_RATE_DESC", //the message type for the translatable module description
        dependencies : ["core"], //dependencies for this module. This is an array of other modules (see blacksheep-conf.js for OOB modules)
        userconfig : "yes", //is this module configurable by the user (user preferences)?
        scope : ["View"], //the scope(s) of this module. This is an array. Valid values are "Application","View","Applet","Control"
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

if (SiebelAppFacade.Blacksheep.prototype.ShouldItExist(SiebelAppFacade.BlacksheepRating,blacksheepRatingModule))  {



    //We're good citizens, so we add the object to the SiebelAppFacade namespace
    SiebelJS.Namespace("SiebelAppFacade.BlacksheepRating");

    //The object declared as a function
    SiebelAppFacade.BlacksheepRating = function () {
                                                                                                                        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function SiebelAppFacade.BlacksheepRating() : "; console.log(bsd + a + f + "begin"); }
        //The constructor function
        function BlacksheepRating() { console.log(this.GetMsg("INIT_CONSTR",true) + "BlacksheepRating"); }
        //get the module definition
        var bs = new SiebelAppFacade.Blacksheep();
        var md = bsco.GetModule(blacksheepRatingModule);
        //if your module needs translatable strings, you must define them now
        //see the example below for German and any other language

                bs.SetMsg(md.label,"Bewertung","deu");
                bs.SetMsg(md.description,"Bewerten Sie Objekte in der Siebel Anwendung.","deu");
                bs.SetMsg("RATE1","Nicht zufriedenstellend!","deu");
                bs.SetMsg("RATE2","Wenig zufriedenstellend!","deu");
                bs.SetMsg("RATE3","Zufriedenstellend!","deu");
                bs.SetMsg("RATE4","Gut!","deu");
                bs.SetMsg("RATE5","Hervorragend!","deu");
                bs.SetMsg("RATE_FOR","Bewertung für ","deu");
                bs.SetMsg("RATE_NA","Gib die erste Bewertung für diese Ansicht ab.","deu");

                bs.SetMsg(md.label,"Rating","enu");
                bs.SetMsg(md.description,"Rate any object in the Siebel application.","enu");
                bs.SetMsg("RATE1","Very unhappy!","enu");
                bs.SetMsg("RATE2","Meh!","enu");
                bs.SetMsg("RATE3","Satisfying!","enu");
                bs.SetMsg("RATE4","OK!","enu");
                bs.SetMsg("RATE5","Excellent!","enu");
                bs.SetMsg("RATE_FOR","Rating for ","enu");
                bs.SetMsg("RATE_NA","Be the first to rate this view.","enu");


        //In blacksheep.js, we use our own Extender function to add extension functions to the core module
        //So we declare a container object that will hold all functions we define
        var extensions = {};

        //Add custom functions after this line; use extensions.FunctionName = function(){}; as template!

        //This is the main function (aka module). All blacksheep.js modules should have at least one argument which
        //references the 'context', which usually is a PM, a PR or an object (applet,control) instance
        extensions.ShowRatingBar = function(context){
                                                                                                                        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepRating.prototype.ShowRatingBar(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }
            //we should always have a variable retval to hold the return value, usually defaults to false
            var retval = false;

            //It is recommended to keep the following lines to establish a proper module
            //first, we store the module name as a variable so we can reuse it
            var modname = blacksheepRatingModule;
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

            BlacksheepRating.prototype[md.pre_function].call(this);
            //if we get inside the next if block, the module is whitelisted for the current context.
            if (is_whitelisted){
                //object is in whitelist, put everything you want to execute in this block
                //for example, we can put a message to the console...
                console.log(bs.GetMsg("WL_TRUE",true) + modname);

                //now let's verify the context
                /*if (typeof(context) !== "undefined"){
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
                }*/
                if (true){
                    var cname = bs.GetMsg("COOKIE_MOD_PRE") + modname + "_" + SiebelApp.S_App.GetActiveView().GetName() + bs.GetMsg("COOKIE_MOD_POST");
                    //see if the module has been enabled/disabled by the user already
                    var is_user_enabled = jQuery.cookie(cname);
                    //anyway, the module is system enabled (i.e. enabled and whitelisted) so we can set the system property
                    //note that this needs a proper PM
                   // pm.SetProperty(propname + propsys,true);

                    //now we check if the module is enabled by the user
                    if (typeof(is_user_enabled) === "undefined" || is_user_enabled == "true" || is_user_enabled == true){
                        //if we are here, the user has either explicitly enabled the module, or it is the first time
                        var viewName = SiebelApp.S_App.GetActiveView().GetName();
                        var crname = bs.GetMsg("COOKIE_MOD_PRE") + modname + "_" + viewName  + "_rating_";
                        var display = "";
                        

                        if ($(".blacksheep-rating-display").length == 0){
                            var dc = bs.GenerateDOMElement("div",{class:"blacksheep-rating-display",id:"blacksheep_rating_display"});
                            $(".applicationMenu").after(dc);
                        }
                        if ($(".blacksheep-rating").length == 0){
                            var rb = bs.GenerateRatingBar(5);
                            $(".applicationMenu").after(rb);

                        }
                        $(".blacksheep-rating").children("input").each(function(i){
                             $(this).click(function(e){
                                 
                                   var val = e.currentTarget.value;
                                   var rtext = bs.GetMsg("RATE" + val);
                                   display =  bs.GetMsg("RATE_FOR") + viewName + ": " + val + " - " + rtext;
                                 $("#blacksheep_rating_display").text(display);
                                 $("#blacksheep_rating_display").show();
                                 $("#blacksheep_rating_display").fadeOut(5000);
                                 if (!blacksheep_inpostload){
                                    bs.StoreRating("db",crname,val);
                                 }
                             });

                        });
                        var timer;
                        $(".blacksheep-rating").mouseenter(function(e) {
                            e.stopImmediatePropagation();
                            $("#blacksheep_rating_display").fadeIn(500);
                            timer = setTimeout(function () {
                                if ($("#blacksheep_chart").length > 0){
                                $("#blacksheep_chart").show();
                                $("#blacksheep_chart").dialog({height:400,width:500});
                                }
                            }, 2000);

                        });
                        $(".blacksheep-rating").mouseleave(function(e){
                            e.stopImmediatePropagation();
                            clearTimeout(timer);
                            $("#blacksheep_rating_display").fadeOut(1000);
                            //$("#blacksheep_chart").dialog("destroy");
                            //$("#blacksheep_chart").hide();
                        });

                        var crval = bs.RetrieveRating("db",crname);
                        if(crval && typeof(crval) !== "undefined"){
                                $("#star" + crval).click();
                        }
                        else{
                            $("#blacksheep_rating_display").text(bs.GetMsg("RATE_NA"));
                            $("#blacksheep_rating_display").show();
                            $("#blacksheep_rating_display").fadeOut(10000);

                        }


                        //this is important, we have to ensure that the user preference is set to true
                        //so the framework recognizes this module as user enabled
                        jQuery.cookie(cname,"true",{expires:999});
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
                console.log(bs.GetMsg("WL_FALSE",true) + modname );
            }
                                                                                                                        if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
            return retval;
        };

        //Add custom functions here as needed, best to copy/paste the template function from above
        extensions.GenerateRatingBar = function(count){
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepRating.prototype.GenerateRatingBar(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }
            var retval = false;
            var html = "";
            if (typeof(count)==="undefined"){count=5;}

             html += "<fieldset class='blacksheep-rating'>";

            for (i = count; i > 0; i--){
                var id = "star" + i;
                var title = bs.GetMsg("RATE" + i);
                html+="<input type='radio' id='" + id + "' name='rating' value='" + i + "' /><label for='" + id + "' title='" + title + "'>" + i + "</label>";

                }
            html += "</fieldset>";

            retval = html;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
            return retval;
        };


        BlacksheepRating.prototype.cleanup = function(pm){
            $(".blacksheep-rating").remove();
            $(".blacksheep-rating-display").remove();

        };

        extensions.StoreRating = function(option,key,val){
            
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepRating.prototype.StoreRating(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }
            var retval = false;

            switch(option){
                case "cookie" :  jQuery.cookie(key,val,{expires:999});
                    retval = true;
                    break;
                case "db" :  var viewName = SiebelApp.S_App.GetActiveView().GetName();
                    var res = bs.DataRetriever("View Access","Feature Access",'[Name] LIKE "' + viewName + '"',"Id",{"Id":""},{"pbc":"Feature Access","viewmode":"3","output":"json","log":"false"});
                    var viewId = res.childArray["Feature Access_1"].Id;
                    var iPS = SiebelApp.S_App.NewPropertySet();
                    var oSvc = SiebelApp.S_App.GetService("Workflow Process Manager");
                    iPS.SetProperty("Answer Text",val);
                    iPS.SetProperty("View Row Id",viewId);
                    iPS.SetProperty("ProcessName","blacksheep User Answers");
                    oSvc.InvokeMethod("RunProcess",iPS);
                    break;
                default: break;
            }
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
            return retval;
        };

        extensions.RetrieveRating = function (option,key){
            
            //var res = bs.DataRetriever("blacksheep Answer","blacksheep Answers","[Question Id]='" + "0-2020" + "' AND [Page Id] = LoginId()","Id",{"Created":"","Answer Text":""},{"pbc":"blacksheep Answers","viewmode":"3","output":"json","log":"false"});
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepRating.prototype.RetrieveRating(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }
            var retval = false;
            var value = 0;
            var counter = 0;
            switch(option){
                case "cookie" : value = parseInt(jQuery.cookie(key));
                    break;
                case "db" :  var viewName = SiebelApp.S_App.GetActiveView().GetName();
                    var res = bs.DataRetriever("View Access","Feature Access",'[Name] LIKE "' + viewName + '"',"Id",{"Id":""},{"pbc":"Feature Access","viewmode":"3","output":"json","log":"false"});
                    var viewId = res.childArray["Feature Access_1"].Id;
                    var ratings = new Array();
                    var dates = new Array();
                    var timeline = new Array();
                    res = bs.DataRetriever("blacksheep Answer","blacksheep Answers","[Question Id]='" + viewId + "'","Created (ASC)",{"Created":"","Answer Text":""},{"pbc":"blacksheep Answers","viewmode":"3","output":"json","log":"false"});
                    if (res.ResultSet["Record Count"] == "0"){
                        value = false;
                    }
                    else{
                    for (r in res.childArray){
                        if (r != "childArray"){
                        counter++;
                            var ta = new Array();
                        var tval = parseFloat(res.childArray[r]["Answer Text"]);
                        var tdate =  res.childArray[r]["Created"];
                        value += tval;
                        ratings[counter-1] = tval;
                        dates[counter-1] = tdate.substr(0,5);
                        ta[0] = new Date(Date.parse(tdate));
                            ta[0] = ta[0].toISOString().substring(0,10) + " " + ta[0].toISOString().substring(11,19);
                            ta[1] = tval;
                            timeline[counter-1] = ta;
                        }
                    }



                    value = value/counter;
                       // bs.PlotIt(timeline,[],{type:"date",title:"View Ratings History (avg = " + value + ")"});
                    }
                    value = Math.round(value);
                    break;
                default: break;
            }
            retval = value;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
            return retval;
        };

        //Do not modify after this line!!!!
        //copy extensions container to prototype
        for (var fName in extensions) {
            BlacksheepRating.prototype[fName] = extensions[fName];
        }
        //make container public
        BlacksheepRating.prototype.Extensions = extensions;
        //extend core class
        var bs = new SiebelAppFacade.Blacksheep();
        bs.Extender(SiebelAppFacade.Blacksheep,BlacksheepRating);

        retval = BlacksheepRating;
                                                                                                                        if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
        return retval;
    }();
}
var bs_z=Date.now(); console.log("blacksheep.js : debugger : " + bs_z + " : file " + "blacksheep-rating.js : loaded : time(ms): " + parseInt(bs_z-bs_a)); blacksheep_perf_file_load["blacksheep-rating.js"] = parseInt(bs_z-bs_a); bs_z = bs_a = null;
//end of file