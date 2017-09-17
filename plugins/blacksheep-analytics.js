/*******************************************************************
 * File:          blacksheep-analytics.js
 * Author:        Alexander Hansal (alex@blacksheep-crm.com)
 * Description:   Google Analytics extension for blacksheep.js, a professional utility library and API extension for Oracle Siebel CRM.
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
    
var bs_a=Date.now(); console.log("blacksheep.js : debugger : " + bs_a + " : file " + "blacksheep-analytics.js : loading");                                                                                                                       
var blacksheepAnalyticsModule = "GAMain";
bsco.AddModule(blacksheepAnalyticsModule,{
        file : "blacksheep-analytics.js",
        enabled : "no",   //set to "yes" to enable / set your GA ID FIRST!!!! (search this file for CHANGE_ME)
        mandatory : "no",
        label : "MOD_GA_LABEL",
        description : "MOD_GA_DESC",
        dependencies : ["core"],
        userconfig : "no",
        scope : ["Application"],
        whitelist : {
            "applications":["Siebel Universal Agent","Siebel Power Communications"]
        }},true
);

//Google Analytics tracking snippet (source: https://developers.google.com/analytics/devguides/collection/analyticsjs/tracking-snippet-reference)
//Note: the ga object/variable can be renamed if it is already used, see https://developers.google.com/analytics/devguides/collection/analyticsjs/renaming-the-ga-object
if (typeof(ga) === "undefined"){
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

}

if (SiebelAppFacade.Blacksheep.prototype.ShouldItExist(SiebelAppFacade.BlacksheepAnalytics,blacksheepAnalyticsModule))  {
    SiebelJS.Namespace("SiebelAppFacade.BlacksheepAnalytics");

    SiebelAppFacade.BlacksheepAnalytics = function () {
                                                                                                                        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function SiebelAppFacade.BlacksheepAnalytics() : "; console.log(bsd + a + f + "begin"); }
        function BlacksheepAnalytics(options) {
            console.log(this.GetMsg("INIT_CONSTR",true) + "BlacksheepAnalytics");
            //this.GAInit(options);
        }
        var md = bsco.GetModule(blacksheepAnalyticsModule);
        var bs = new SiebelAppFacade.Blacksheep();
        
                bs.SetMsg(md.label,"Google Analytics","deu");
                bs.SetMsg(md.description,"Integration mit Google Analytics.","deu");
                bs.SetMsg(md.label,"Google Analytics","enu");
                bs.SetMsg(md.description,"Google Analytics integration.","enu");


        var extensions = {};

        //Add custom functions after this line; use extensions.FunctionName = function(){}; as template!
        extensions.GAInit = function(options){     if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepAnalytics.prototype.Init(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GAInit__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}

            var retval = false;

            //TODO: insert project-specific GA tracking id below!
            var trackingId = "CHANGE_ME";//or get from sys pref via DataRetriever etc...


            var sampleRate = 100;
            var sendReferrer = true;
            //set options when provided
            if (typeof(options) !== "undefined" || !$.isEmptyObject(options)){
                if (typeof(options.sampleRate) !== "undefined"){
                    sampleRate = options.sampleRate;
                }
                if (typeof(options.sendReferrer) !== "undefined"){
                    sendReferrer = options.sendReferrer;
                }
                if (typeof(options.trackingId) !== "undefined"){
                    trackingId = options.trackingId;
                }
            }

            /** create tracker */
            if (ga.getAll().length == 0){   //check if no tracker created yet
                ga('create', trackingId, {
                    cookieDomain : 'auto',
                    siteSpeedSampleRate : sampleRate,
                    alwaysSendReferrer : sendReferrer
                });
                ga(function(tracker) { //callback
                    console.log("GA tracker " + tracker.get("name") + " created with client Id : " + tracker.get("clientId"));
                    retval = true;
                });
            }
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + retval); }if (bsc.perf == "yes"){var zperf = Date.now(); blacksheep_perf_function_call["GAInit__" + "()" + "__" + aperf]["End"]=zperf;}
        };

        extensions.GAMain = function(dimensions,events,options){
                                                                                                                                    if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepAnalytics.prototype.GAMain(" + $.makeArray(JSON.stringify(arguments)).join() +") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GAMain__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            //if a module is whitelisted, add code similar to the following to exclude relevant processing from current context

            var modname = blacksheepAnalyticsModule;
            //var bs = new SiebelAppFacade.blacksheep();
            var wl = bs.GetWhiteList(modname);
            var is_whitelisted = bs.ProcessWhiteList(wl); //pass context as second parameter if you have it, defaults to active PM
            var retval = false;
            var pm = true;

            if (is_whitelisted){

                //object is in whitelist, put everything you want to execute in this block
                console.log(bs.GetMsg("WL_TRUE",true) + modname);


                if (pm){
                    //var propname = bs.GetMsg("PMPROP_MOD_PREFIX") + modname;
                    //var propsys = bs.GetMsg("PMPROP_MOD_SYS");
                    //var propuser = bs.GetMsg("PMPROP_MOD_USER");
                    var is_user_enabled = true;//bs.GetUserPref(pm,propname + propuser);
                    //pm.SetProperty(propname + propsys,true);


                    if (typeof(is_user_enabled) === "undefined" || is_user_enabled == "true" || is_user_enabled == true){

                        var isPageView = true;
                        //set from options
                        if (typeof(options) !== "undefined" || !$.isEmptyObject(options)){
                            if (typeof(options.isPageView) !== "undefined"){
                                isPageView = options.isPageView;
                            }
                        }

                        //send pageview when required
                        if (isPageView){
                            ga('send', 'pageview');
                        }

                        /** set custom dimensions if defined */
                        if (typeof(dimensions) !== "undefined" || !$.isEmptyObject(dimensions)){
                            for (dim in dimensions){
                                ga('set','dimension' + dim, dimensions[dim].data);
                            }
                        }

                        /** send events if defined*/
                        if (typeof(events) !== "undefined" || !$.isEmptyObject(events)){
                            for (ev in events){
                                ga('send','event',events[ev].category,events[ev].action,events[ev].label);
                            }
                        }
                        retval = true;
                    }
                    else{
                        console.log(modname + bs.GetMsg("PMPROP_DISABLED"));
                    }
                }


            }
            else{
                //object is not in whitelist
                console.log(bs.GetMsg("WL_FALSE",true) + modname + ", " + bs.GetActivePM().Get("GetName"));
            }
                                                                                                                        if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + retval); }if (bsc.perf == "yes"){var zperf = Date.now(); blacksheep_perf_function_call["GAMain__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        //Do not modify after this line
        //copy extensions container to prototype
        for (var fName in extensions) {
            BlacksheepAnalytics.prototype[fName] = extensions[fName];
        }
        //make container public
        BlacksheepAnalytics.prototype.Extensions = extensions;
        //extend core class
        var bs = new SiebelAppFacade.Blacksheep();
        bs.Extender(SiebelAppFacade.Blacksheep,BlacksheepAnalytics);

        retval = BlacksheepAnalytics;
                                                                                                                        if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
        return retval;
    }();
}
var bs_z=Date.now(); console.log("blacksheep.js : debugger : " + bs_z + " : file " + "blacksheep-analytics.js : loaded : time(ms): " + parseInt(bs_z-bs_a)); blacksheep_perf_file_load["blacksheep-analytics.js"] = parseInt(bs_z-bs_a); bs_z = bs_a = null;
