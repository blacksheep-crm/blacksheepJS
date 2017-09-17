/*******************************************************************
 * File:          blacksheep-conf.js
 * Author:        Alexander Hansal (alex@blacksheep-crm.com)
 * Description:   Configuration file for blacksheep.js, a professional utility library and API extension for Oracle Siebel CRM.
 * ******************************************************************
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
 var blacksheep_perf_file_load = {};
 var blacksheep_perf_function_call = {};
var blacksheep_perf_view_load = {};
                                                                                                                        var bs_a=Date.now();console.log("blacksheep.js : debugger : " + bs_a +  " : file " + "blacksheep-conf.js : loading");

if (typeof(SiebelAppFacade.BlacksheepConfig) === "undefined"){
    SiebelJS.Namespace("SiebelAppFacade.BlacksheepConfig");

    SiebelAppFacade.BlacksheepConfig = function () {

        function BlacksheepConfig() {
            
            this.LoadModules();
            console.log("in constructor : " + "BlacksheepConfig");
        }

        /*
        function GetConfig: returns in-memory configuration
         */
        BlacksheepConfig.prototype.GetConfig = function(){
            return SiebelAppFacade.BlacksheepConfig.config;
        };

        /*
        function LoadConfig: Writes initial configuration
         */
        BlacksheepConfig.prototype.LoadConfig = function(){

            var retval = false;

            //we use in-place JSON objects, but could fetch these key/value pairs from anywhere
            //via Business Service, REST, zookeeper etc...
            //go figure...

            var blacksheep_conf =
            {
                enabled: "yes",     //yes=blacksheep.js enabled; no=blacksheep.js disabled
                language: "enu",    //default language
                supported_langs : ["enu","deu"],  //full list of all supported languages
                debug: "yes",       //yes=debug mode on; no=debug mode off
                perf: "yes",        //collect performance stats
                modules : {}
            };
            
                                                                                                                        var bsc = blacksheep_conf; if (bsc.enabled == "yes" && bsc.debug == "yes"){ var bsd_10 = "blacksheep.js : debugger : "; var a=Date.now(); var f=" : function " + "BlacksheepConfig.prototype.LoadConfig () : "; console.log(bsd_10 + a + f + "begin");}if (bsc.enabled == "yes" && bsc.perf == "yes"){var aperf = Date.now();blacksheep_perf_function_call["LoadConfig__" + "true" + "__" + aperf]={"Start":aperf,"End":0};
            }

            SiebelAppFacade.BlacksheepConfig.config = blacksheep_conf;

            retval = true;
                                                                                                                        if (bsc.enabled == "yes" && bsc.debug == "yes"){  var z = Date.now(); console.log(bsd_10 + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + retval); }if (bsc.enabled == "yes" && bsc.perf == "yes"){var zperf = Date.now(); blacksheep_perf_function_call["LoadConfig__" + "true" + "__" + aperf]["End"]=zperf;}
            return retval;
        };


        /*
        function LoadModules: Wrapper for LoadConfig
         */
        BlacksheepConfig.prototype.LoadModules = function(){
            var retval = false;
            if ($.isEmptyObject(SiebelAppFacade.BlacksheepConfig.config)){
                this.LoadConfig();
            }
            var blacksheep_modules = this.GetModule();
            retval = true;
            return retval;
        };

        /*
         Function blacksheepAddModule: Adds a module to the array
         Input: name of the module, config JSON object, override flag
         Output: boolean
         */
        BlacksheepConfig.prototype.AddModule = function (module_name, def, override){
                                                                                                                        var bsc = this.GetConfig(); if (bsc.enabled == "yes" && bsc.debug == "yes"){  var bsd_10 = "blacksheep.js : debugger : ";  var a=Date.now(); var f=" : function " + "BlacksheepConfig.prototype.AddModule (" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd_10 + a + f + "begin"); } if (bsc.enabled == "yes" && bsc.perf == "yes"){var aperf = Date.now();blacksheep_perf_function_call["AddModule__" + module_name + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = false;
            if (typeof(override) === "undefined"){ override = false;}
            try{
                if (module_name != "" && def){
                    if (override == false){
                        if (!SiebelAppFacade.BlacksheepConfig.config["modules"][module_name]){
                            SiebelAppFacade.BlacksheepConfig.config["modules"][module_name] = def;
                            retval = true;
                        }
                        else{
                            throw("blacksheep.js : AddModule() : module definition already exists : " + module_name);
                        }
                    }
                    else{
                        SiebelAppFacade.BlacksheepConfig.config["modules"][module_name] = def;
                        retval = true;
                    }
                }
                else{
                    throw("blacksheep.js : AddModule(" + $.makeArray(JSON.stringify(arguments)).join() + ") : invalid input");
                }
            }
            catch(e){
                console.log(e.toString());
            }
            finally{
                                                                                                                        if (bsc.enabled == "yes" && bsc.debug == "yes"){ var z = Date.now(); console.log(bsd_10 + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.enabled == "yes" && bsc.perf == "yes"){var zperf = Date.now();blacksheep_perf_function_call["AddModule__" + module_name + "__" + aperf]["End"]=zperf;  }
            }
            return retval;
        };

        /*
         Function blacksheepGetModules: Retrieves module definitions
         Input: optional name of module, if no name given, the function returns the complete module set
         Output: single or multiple module definitions (object)
         */

        BlacksheepConfig.prototype.GetModule = function(module_name){
                                                                                                                        var bsc = this.GetConfig(); if (bsc.enabled == "yes" && bsc.debug == "yes"){  var bsd_10 = "blacksheep.js : debugger : ";  var a=Date.now(); var f=" : function " + "BlacksheepConfig.prototype.GetModule (" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd_10 + a + f + "begin"); } if (bsc.enabled == "yes" && bsc.perf == "yes"){var aperf = Date.now();blacksheep_perf_function_call["GetModule__" + module_name + "__" + aperf]={"Start":aperf,"End":0};}
            var retval;
            var config = bsc;
            //vanilla modules go here
            //see custom module registry section below to register custom modules
            var blacksheep_standard_modules = {
                //do not modify below this line
                //-----------------------------
                "core" : {
                    file : "blacksheep.js",
                    enabled : "yes",
                    mandatory : "yes",
                    description : "core module",
                    dependencies : ["config","messages","ShowDialog"]},
                "config" : {
                    file : "blacksheep-conf.js",
                    enabled : "yes",
                    mandatory : "yes",
                    description : "configuration module",
                    dependencies : []},
                "messages" : {
                    file : "blacksheep-msg.js",
                    enabled : "yes",
                    mandatory : "yes",
                    description : "string and system message repository module",
                    dependencies : ["config"]}
                //-----------------------------
                //do not modify above this line
            };

            if (typeof(config["modules"]["core"]) === "undefined"){
                for (m in blacksheep_standard_modules){
                    this.AddModule(m,blacksheep_standard_modules[m],true);
                }
            }

            if (module_name && module_name != ""){
                retval = SiebelAppFacade.BlacksheepConfig.config["modules"][module_name];
            }
            else{
                retval = SiebelAppFacade.BlacksheepConfig.config["modules"];
            }
                                                                                                                        if (bsc.enabled == "yes" && bsc.debug == "yes"){ var z = Date.now(); console.log(bsd_10 + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.enabled == "yes" && bsc.perf == "yes"){var zperf = Date.now();blacksheep_perf_function_call["GetModule__" + module_name + "__" + aperf]["End"]=zperf;}
            return retval;
        };


        return BlacksheepConfig;
    }();
}

                                                                                                                        var bs_z=Date.now(); console.log("blacksheep.js : debugger : " + bs_z + " : file " + "blacksheep-conf.js : loaded : time(ms): " + parseInt(bs_z-bs_a)); blacksheep_perf_file_load["blacksheep-conf.js"] = parseInt(bs_z-bs_a); bs_z = bs_a = null;
