/*******************************************************************
 * File:          blacksheep-preload.js
 * Author:        Alexander Hansal (alex@blacksheep-crm.com)
 * Description:   preload event handler for blacksheep.js, a professional utility library and API extension for Oracle Siebel CRM.
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
var bs_a=Date.now(); console.log("blacksheep.js : debugger : " + bs_a + " : file " + "blacksheep-preload.js : loading");
var blacksheepPreloadModule = "preload";
bsco.AddModule(blacksheepPreloadModule,  {
        file : "blacksheep-preload.js",
        enabled : "yes",
        mandatory : "no",
        description : "preload event handler",
        dependencies : ["core"]},
    true);



if (SiebelAppFacade.Blacksheep.prototype.ShouldItExist(BlacksheepPreLoad,blacksheepPreloadModule)){

    SiebelApp.EventManager.addListner("preload", BlacksheepPreLoad);
    function BlacksheepPreLoad(){
        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function " + arguments.callee.name + "() : "; console.log(bsd + a + f + "begin"); }
        
        var viewname =  SiebelApp.S_App.GetActiveView().GetName();

        //collect performance data

        if (bsc.perf == "yes"){
            if (typeof(blacksheep_perf_view_load[viewname]) === "undefined"){
                blacksheep_perf_view_load[viewname] = new Array();
            }
            blacksheep_perf_view_load[viewname].push({"Start":Date.now()});
        }
        var bs = new SiebelAppFacade.Blacksheep();

        console.log(bs.GetMsg("INIT_PRE",true) + "BlacksheepPreLoad : View : " + viewname);

        if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a)); }
    }

}
var bs_z=Date.now(); console.log("blacksheep.js : debugger : " + bs_z + " : file " + "blacksheep-preload.js : loaded : time(ms): " + parseInt(bs_z-bs_a)); blacksheep_perf_file_load["blacksheep-preload.js"] = parseInt(bs_z-bs_a); bs_z = bs_a = null;