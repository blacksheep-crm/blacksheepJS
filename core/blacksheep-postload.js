/*******************************************************************
 * File:          blacksheep-postload.js
 * Author:        Alexander Hansal (alex@blacksheep-crm.com)
 * Description:   postload event handler for blacksheep.js, a professional utility library and API extension for Oracle Siebel CRM.
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



var bs_a=Date.now(); console.log("blacksheep.js : debugger : " + bs_a + " : file " + "blacksheep-postload.js : loading");
var blacksheepPostloadModule = "postload";
var blacksheep_inpostload = false;
bsco.AddModule(blacksheepPostloadModule,  {
    file : "blacksheep-postload.js",
        enabled : "yes",
        mandatory : "no",
        description : "postload event handler",
        dependencies : ["core"]},
    true);

if (SiebelAppFacade.Blacksheep.prototype.ShouldItExist(BlacksheepPostLoad,blacksheepPostloadModule)){

    SiebelApp.EventManager.addListner("postload", BlacksheepPostLoad);

    function BlacksheepPostLoad(){
                                                                                                                        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function " + arguments.callee.name + "() : "; console.log(bsd + a + f + "begin"); }
        var bs = new SiebelAppFacade.Blacksheep();
        blacksheep_inpostload = true;
        var viewname = SiebelApp.S_App.GetActiveView().GetName();
        console.log(bs.GetMsg("INIT_POST",true) + "BlacksheepPostLoad : View : " + viewname);
       try{
           //add tramp stamp
            var stamp = bs.CreateTrampStamp(true);
            if ($(".blacksheep-trampstamp").length == 0){
                $("#_swecontent").append(stamp);
            }

      }
       catch(e){
           bs.ErrorHandler(e.toString());
       }
        finally{

           //Google Analytics
           //example how to call the BlacksheepAnalytics module
           if (typeof(ga) !== "undefined" && typeof(SiebelAppFacade.BlacksheepAnalytics) !== "undefined"){
               //Example: get system info
               var userId = SiebelApp.S_App.GetProfileAttr("Me.Id");
               var viewName = SiebelApp.S_App.GetActiveView().GetName();
               //set custom dimensions if required
               //note: must define dimensions in Google Analytics!
               var dimensions = {
                   1:{
                       data : viewName
                   },
                   2:{
                       data: userId
                   }};
               //set events if required
               var events = {
                   1:{
                       category : "Blacksheep_View",
                       action : "postload",
                       label : viewName
                   }};
               bs.GAInit();
               bs.GAMain(dimensions,events);

           }

           //call AutoStart to launch all autostartable modules
           bs.AutoStart();


           if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a)); }
           blacksheep_inpostload = false;
           if (bsc.perf == "yes"){
                blacksheep_perf_view_load[viewname].push({"End":Date.now()});
           }
        }
    }

}


var bs_z=Date.now(); console.log("blacksheep.js : debugger : " + bs_z + " : file " + "blacksheep-postload.js : loaded : time(ms): " + parseInt(bs_z-bs_a)); blacksheep_perf_file_load["blacksheep-postload.js"] = parseInt(bs_z-bs_a); bs_z = bs_a = null;

//because we can...
SiebelApp.EventManager.addListner("AppInit", function () {
    console.log("AppInit");

});