/*******************************************************************
 * File:          blacksheep-msg.js
 * Author:        Alexander Hansal (alex@blacksheep-crm.com)
 * Description:   Message/String functions for blacksheep.js, a professional utility library and API extension for Oracle Siebel CRM.
 *                Translate the array in this file for multi-language support.
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

                                                                                                                        var bs_a=Date.now(); console.log("blacksheep.js : debugger : " + bs_a + " : file " + "blacksheep-msg.js : loading");

if (typeof(SiebelAppFacade.BlacksheepMsg) === "undefined"){

    SiebelJS.Namespace("SiebelAppFacade.BlacksheepMsg");

    SiebelAppFacade.BlacksheepMsg = function () {

        function BlacksheepMsg() {
            console.log("in constructor : " + "BlacksheepMsg");
            this.LoadMessageArray();
            $.getScript(SIEBEL_BUILD + "siebel/custom/blacksheep/core/blacksheep-strings.js").complete(BlacksheepInitStrings());
        }

        BlacksheepMsg.prototype.LoadMessageArray = function(){
            var bsc = SiebelAppFacade.BlacksheepConfig.config;
                                                                                                                        if (bsc.debug == "yes") {  var b = "blacksheep.js : debugger : ";  var a=Date.now(); var f=" : function " + "BlacksheepMsg.prototype.LoadMessageArray () : "; console.log(b + a + f + "begin"); }if (bsc.perf == "yes"){var ap = Date.now(); blacksheep_perf_function_call["LoadMessageArray__" + "()" + "__" + ap]={"Start":ap,"End":0};}

            var retval = false;
            var _s = {};
            var _m = new Array();

            if (typeof(SiebelAppFacade.BlacksheepMsg.msg) === "undefined" || SiebelAppFacade.BlacksheepMsg.msg == null || SiebelAppFacade.BlacksheepMsg.msg["ISLOADED"] === "undefined"){

                for (i = 0; i < bsc.supported_langs.length; i++){
                    _s[bsc.supported_langs[i]] = new Array();
                }

                //system strings, do not translate
                _m["BSD"] = "blacksheep.js : debugger : "
                _m["MSG_PREFIX"] = "blacksheep.js : ";
                _m["AP_PREFIX"] = "s_";
                _m["AP_POSTFIX"] = "_div";
                _m["PMPROP_MOD_PREFIX"] = "blacksheep_";
                _m["PMPROP_MOD_SYS"] = "_system_enabled";
                _m["PMPROP_MOD_USER"] = "_user_enabled";
                _m["PMPROP_MOD_OPT"] = "_options";
                _m["UP_KEY"] = "Key";
                _m["APPLET_STATE"] = "__state";
                _m["COOKIE_MOD_PRE"] = "BLACKSHEEP_";
                _m["COOKIE_MOD_POST"] = "_ENABLED";
                _m["COOKIE_MOD_OPT"] = "_OPTIONS"
                _m["WL_STORAGE_PREFIX"] = "BLACKSHEEP_WS_";
                _m["TYPE_LIST"] = "list";
                _m["TYPE_TREE"] = "tree";
                _m["TYPE_CHART"] = "chart";
                _m["TYPE_FORM"] = "form";
                _m["TYPE_UNKNOWN"] = "unknown";
                _m["ISLOADED"] = "yes";   //dummy marker


                for (i = 0; i < bsc.supported_langs.length; i++){
                    for (m in _m){
                        _s[bsc.supported_langs[i]][m] = _m[m];
                    }
                }
                SiebelAppFacade.BlacksheepMsg.msg = _s;
            }

            retval = true;
                                                                                                                        if (bsc.debug == "yes") { var z = Date.now(); console.log(b + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zp = Date.now(); blacksheep_perf_function_call["LoadMessageArray__" + "()" + "__" + ap]["End"]=zp;}

        return retval;
    };


    BlacksheepMsg.prototype.GetMessage = function(key,prefix,lang){

        var bsc = SiebelAppFacade.BlacksheepConfig.config;


        if (typeof(lang) === "undefined"){                                                                              // if (bsc.debug == "yes") {  var b = "blacksheep.js : debugger : ";  var a=Date.now(); var f=" : function " + "BlacksheepMsg.prototype.GetMessage (" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(b + a + f + "begin"); }
            lang = bsc.language;
        }
        if (typeof(prefix) === "undefined") {prefix = false;}
        var retval = false;
        if (key){
            var theArray = SiebelAppFacade.BlacksheepMsg.msg[lang];
            if (prefix) {
                var prefixText =  theArray["MSG_PREFIX"];
                //if (blacksheep_is_debug) { prefixText += "debugger : " + Date.now() + " : "; }
                retval = prefixText + theArray[key];
            }
            else {
                retval = theArray[key];
            }
        }
        else{
            retval = "";
        }
                                                                                                                        //if (bsc.debug == "yes") { var z = Date.now(); console.log(b + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
        return retval;
    };

    BlacksheepMsg.prototype.SetMessage = function(key,msg,lang){
        var bsc = SiebelAppFacade.BlacksheepConfig.config;
                                                                                                                        //if (bsc.debug == "yes") {  var b = "blacksheep.js : debugger : ";  var a=Date.now(); var f=" : function " + "BlacksheepMsg.prototype.SetMessage (" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(b + a + f + "begin"); }
        if (typeof(lang) === "undefined"){
            lang = bsc.language;
        }
        var retval = false;
        try{
            if (key && msg){
                var theArray = SiebelAppFacade.BlacksheepMsg.msg[lang];
                SiebelAppFacade.BlacksheepMsg.msg[lang][key] = msg;
                retval = true;
            }
            else{
                retval = false;
                throw(this.GetMessage("ERR_GENERIC") + "function SetMessage(" + key + "," + msg + ") : invalid input");
            }
        }
        catch(e){
            retval = false;
            console.log(e.toString());
        }
        finally{
                                                                                                                        //if (bsc.debug == "yes") { var z = Date.now(); console.log(b + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }//blacksheep_perf_function_call["SetMessage__" + key + "__" + a] = parseInt(z-a);
        }
        return retval;
    };


        return BlacksheepMsg;
}();
}
                                                                                                                        var bs_z=Date.now(); console.log("blacksheep.js : debugger : " + bs_z + " : file " + "blacksheep-msg.js : loaded : time(ms): " + parseInt(bs_z-bs_a)); blacksheep_perf_file_load["blacksheep-msg.js"] = parseInt(bs_z-bs_a); bs_z = bs_a = null;
