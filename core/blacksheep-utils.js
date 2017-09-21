/********************************************************************
 * File:          blacksheep-utils.js
 * Author:        Alexander Hansal (alex@blacksheep-crm.com)
 * Description:   Extension file for blacksheep.js, a professional utility library and API extension for Oracle Siebel CRM.
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

var bs_a=Date.now(); console.log("blacksheep.js : debugger : " + bs_a + " : file " + "blacksheep-utils.js : loading");

var blacksheepUtilsModule = "utilities";
bsco.AddModule(blacksheepUtilsModule,{
    file : "blacksheep-utils.js",
        enabled : "yes",
    mandatory : "no",
    description : "utility library",
    dependencies : ["core"]},
    true);

if (SiebelAppFacade.Blacksheep.prototype.ShouldItExist(SiebelAppFacade.BlacksheepUtils,blacksheepUtilsModule))  {

    SiebelJS.Namespace("SiebelAppFacade.BlacksheepUtils");

    SiebelAppFacade.BlacksheepUtils = function () {
                                                                                                                        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function SiebelAppFacade.BlacksheepUtils() : "; console.log(bsd + a + f + "begin"); }
        function BlacksheepUtils() { console.log(this.GetMsg("INIT_CONSTR",true) + "BlacksheepUtils"); }

        var extensions = {};



        /*
         Function DataRetriever: Calls the blacksheep Service (server eScript BS) to run any query on any BO/BC
         Inputs: BO, BC, Search Expression, Sort Spec, Field list as object (see use case below)
         Returns: Property set with records returned
         */
        extensions.DataRetriever = function(busobj,buscomp,searchspec,sortspec,fields,options){
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepUtils.prototype.DataRetriever(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["DataRetriever__" + buscomp + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = false;
            var viewmodes = ["SalesRepView","ManagerView","PersonalView","AllView","","OrganizationView","","GroupView","CatalogView","SubOrganizationView"];
            var ts_start;
            var ts_end;
            var log = true;
            var viewmode;
            var pbc;
            var rowid;
            var is_async;
            var cb;
            var pm;
            var output = null;
            //check for options
            if (options){
                output = options.output ? options.output.toLowerCase() : "";
                if (output != "json" && output != "propset"){
                    output = "propset";
                }

                log = options.log == "true" ? true : false;
                viewmode = options.viewmode ? options.viewmode : "";
                pbc = options.pbc ? options.pbc : "";
                rowid = options.rowid ? options.rowid : "";
                is_async = options.async ? options.async : false;
                cb = options.cb ? options.cb : null;
                pm = options.ctx ? options.ctx : null;
            }
            var resultset = null;
            //first, get the service instance

            var service = SiebelApp.S_App.GetService("blacksheep Data Retriever");
            //some property sets
            var iPS = SiebelApp.S_App.NewPropertySet();
            var oPS;
            var fPS = SiebelApp.S_App.NewPropertySet();
            //prepare input PS
            iPS.SetProperty("Business Object", busobj);
            iPS.SetProperty("Business Component", buscomp);
            iPS.SetProperty("Search Specification", searchspec);
            iPS.SetProperty("Sort Specification", sortspec);
            iPS.SetProperty("View Mode", viewmode);
            iPS.SetProperty("Primary Business Component", pbc);
            iPS.SetProperty("Primary Row Id", rowid);
            //field list must be passed as child PS
            for (field in fields){
                fPS.SetProperty(field,"");
            }
            iPS.AddChild(fPS);
            //invoke the service method, this executes a query, so watch your search and sort specs!
            ts_start = Date.now();
            var config = {};
            
            if (is_async){
                config.async = true;
                config.scope = pm;
                config.selfbusy = true;
                config.mask = true;
                config.cb = cb;
                oPS = service.InvokeMethod("GetData", iPS,config);
            }
            else{
                oPS = service.InvokeMethod("GetData", iPS);
            }

            ts_end = Date.now();
            //hooray, we've got data:
            var te = ts_end - ts_start;
            if (!is_async){
                resultset = oPS.GetChildByType("ResultSet");
                //var temp = resultset.Clone();

                if (resultset){
                    resultset.SetProperty("Time Elapsed",te);
                    switch (output){
                        case "json" : resultset = bs.ps2json({},resultset);
                            break;
                        default: break;
                    }
                }
            }
            else{

            }
            if (log){
                var logmsg = "";
                logmsg += " : " + bs.GetMsg("DR_LOG_HDR");
                logmsg += " : " + bs.GetMsg("DR_LOG_BO") + busobj;
                logmsg += " : " + bs.GetMsg("DR_LOG_BC") + buscomp;
                logmsg += " : " + bs.GetMsg("DR_LOG_SRCH") + searchspec;
                logmsg += " : " + bs.GetMsg("DR_LOG_SORT") + sortspec;
                logmsg += " : " + bs.GetMsg("DR_VIEW_MODE") + viewmodes[parseInt(options.viewmode)];
                logmsg += " : " + bs.GetMsg("DR_LOG_TIME") + parseInt(te) + bs.GetMsg("DIAG_DR_2");
                //logmsg += " : " + bs.GetMsg("DR_LOG_COUNT") + temp.GetProperty("Record Count");
                console.log(logmsg);
            }
            if(is_async){
                retval = true;
            }
            else{
                retval = resultset;
            }
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["DataRetriever__" + buscomp + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        /*
         Function ps2json: converts a property set to a JSON object
         Input: json object (e.g. {}), property set, counter (optional)
         Output: json object
         */
        extensions.ps2json = function(json,ps,counter){
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepUtils.prototype.ps2json(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["ps2json__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = false;
            
            var json = json;
            var data = {};  //temp data set
            var key; //property name
            var val; //property value
            var type; //propset type

            var c = 0; //counter is needed when type of input ps is not set
            if (counter){
                c = counter;
            }
            //take care of the parent PS
            //iterate through properties
            type = ps.GetType() ? ps.GetType() : c;
            key = ps.GetFirstProperty();
            do{
                data[key] = ps.GetProperty(key);
            }while(key = ps.GetNextProperty());
            json[type] = data;
            json[type]["value"] = ps.GetValue();
            //take care of children
            //create childArray object if it doesn't already exist
            if (!json["childArray"]){
                json["childArray"] = {};
            }
            //iterate through child array and populate object
            for (var i = 0; i < ps.GetChildCount(); i++){
                var child = ps.GetChild(i);
                //recursive call for each child
                this.ps2json(json["childArray"],child,i+1);
            }
            //all done (hopefully)
            retval = json;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["ps2json__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        /*
        function GetAssistant: returns a DOM Element with icon and tooltip
         */
        extensions.GetAssistant = function(text){
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepUtils.prototype.GetAssistant(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetAssistant__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = false;
            var elem = bs.GenerateDOMElement("div",{title:text,class:"blacksheep-assistant-icon"});
            retval = elem;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["GetAssistant__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        /*
        function ShowPerformanceSummary: displays performance data
         */
        extensions.ShowPerformanceSummary = function(){
            
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepUtils.prototype.GetAssistant(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }//if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["ShowPerformanceSummary__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = false;
            if (bsc.perf == "yes"){
            var data = bs.PerformanceAnalyzer();
            }
            $.getScript(SIEBEL_BUILD + "siebel/custom/blacksheep/3rdParty/prettyprint/prettyPrint.js").complete(function(){
                var tbl = bs.GenerateDOMElement("div");
                var temp = {};
                if (bsc.perf != "yes"){
                    temp["Message"] = "Performance data collection is disabled.";
                }
                else{
                temp["View Load"] = data["*View Stats"];
                temp["Function Calls"] = data["*Function Call Summary"];
                temp["File Load"] = data["*File Load Summary"];
                }

                $(tbl).append(prettyPrint(temp));

                $(tbl).dialog({width:800,height:500,title:bs.GetMsg("PERF_TITLE")}).css({height:"350px", overflow:"auto"});
                retval = true;
            });

            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }//if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["ShowPerformanceSummary__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        //Performance data aggregation
        extensions.PerformanceAnalyzer = function(){
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepUtils.prototype.PerformanceAnalyzer(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }
            var retval = false;
            var agg = {};
            var slowest = "";
            var ranked = new Array();
            var data = blacksheep_perf_function_call;
            var filedata = blacksheep_perf_file_load;
            var viewdata = blacksheep_perf_view_load;

            //function data
            for (d_item in data){
                var temp = d_item.split("__");
                var fname = temp[0];
                var info = temp[1];
                var start = parseInt(temp[2]);
                var end = parseInt(data[d_item]["End"]);
                var duration = end - start;

                if (typeof(agg[fname]) === "undefined"){

                    agg[fname] = {"Function":fname,"Calls": 1,"TotalDuration":duration,"AvgDuration":duration,"MaxDuration":duration,"MinDuration":duration};
                }
                else{
                    agg[fname].Calls = agg[fname].Calls + 1;
                    agg[fname].TotalDuration = agg[fname].TotalDuration + duration;
                    agg[fname].AvgDuration = agg[fname].TotalDuration / agg[fname].Calls;
                    if (duration > agg[fname].MaxDuration){
                        agg[fname].MaxDuration = duration;
                    }
                    if (duration < agg[fname].MinDuration){
                        agg[fname].MinDuration = duration;
                    }
                    if (isNaN(agg[fname].TotalDuration)){
                        
                    }
                }
            }
            for (rec in agg){
                ranked.push(agg[rec]);
            }
            agg["*Function Call Summary"] = {"Calls":0,"TotalDuration":0,"AvgDuration":0,"MaxDuration":0,"MinDuration":0};
            for (fc in agg){
                  if (fc != "Grand Total"){
                      agg["*Function Call Summary"].Calls += agg[fc].Calls;
                      agg["*Function Call Summary"].TotalDuration += agg[fc].TotalDuration;

                  }
                if (agg[fc].MaxDuration > agg["*Function Call Summary"].MaxDuration){
                    agg["*Function Call Summary"].MaxDuration = agg[fc].MaxDuration;
                }

            }
            agg["*Function Call Summary"].AvgDuration = agg["*Function Call Summary"].TotalDuration / agg["*Function Call Summary"].Calls;
            
            ranked.sort(function(a, b) {
                return parseFloat(b.MaxDuration) - parseFloat(a.MaxDuration);
            });
            var slo = {};
            var slowc = 10;
            for (i = 0; i < slowc; i++){
                 slo[ranked[i].Function] = ranked[i].MaxDuration;
            }
            
            agg["*Function Call Summary"]["Slowest " + slowc] = slo;
            
            //File Data
            agg["*File Load Summary"] = filedata;


            //View data
            var views = {};
            for (vn in viewdata){
                var va = viewdata[vn];
                var pagecount = va.length/2;
                if (typeof(views[vn]) === "undefined"){
                    views[vn] = {};
                }
                views[vn]["Hits"] = pagecount;
                views[vn]["Total Time"] = 0;
                var vstart = 0;
                var vend = 0;
                for (i = 0; i < va.length; i++){

                    if (typeof(va[i].Start) !== "undefined"){
                        vstart = va[i].Start;
                        //views[vn][vstart] = {"Start":vstart};
                    }
                    else if (typeof(va[i].End) !== "undefined"){
                        vend =  va[i].End;
                        //views[vn][vstart].End = vend;
                        //views[vn][vstart].Duration = vend-vstart;
                        views[vn]["Total Time"] = views[vn]["Total Time"] + vend-vstart;
                    }
                }
                views[vn]["Average Load Time"] = views[vn]["Total Time"]/views[vn]["Hits"];

            }
            agg["*View Stats"] = views;
            retval = agg;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + retval); }
            
            return retval;
        };

        //Get Properties for any repository object
        extensions.GetRepoProperties = function(type,searchspec){
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepUtils.prototype.GetRepoProperties(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetRepoProperties__" + type + "__" + aperf]={"Start":aperf,"End":0};}
            
            var retval = false;
            debugger;

            var sig = "BLACKSHEEP_REPO_CACHE|" + type + "|" + searchspec;
            var cdata = localStorage.getItem(sig);
            if (cdata){
                 retval = JSON.parse(cdata);
            }
            else{
            var bo = "Repository Details";
            var bc = "Repository " + type;
            if (searchspec.indexOf("[") < 0){
                searchspec = "[Name] LIKE '" + searchspec + "'";
            }
            
            var propdata = bs.DataRetriever(bo,"Repository Attribute","[Repository Id]='" + bs.GetRepositoryId() + "' AND [Inactive] <> 'Y' AND [Parent Name]='" + type + "'","Name",{"Name":""},{viewmode:3,log:false,output:"json"});
            var props = {};
            var dontuse = ["Parent Id", undefined, "value"];
            for (pr in propdata.childArray){
                var prn = propdata.childArray[pr].Name;
                if ($.inArray(prn,dontuse) == -1) {
                    props[prn] = "";
                }
            }
            
            var objdata = bs.DataRetriever(bo,bc,"[Repository Id]='" + bs.GetRepositoryId() + "' AND [Inactive] <> 'Y' AND " + searchspec,"Id",props,{viewmode:3,log:false,output:"json"});
            var objects = {};
            for (obj in objdata.childArray){
                if (obj != "childArray"){

                    var objname = objdata.childArray[obj].Name;
                    objects[objname] = {};
                    var arr = new Array();
                    for (prop in objdata.childArray[obj]){
                        if (prop != "value"){
                            arr.push(prop);
                        }
                    }
                    arr.sort();
                    for (i = 0; i < arr.length; i++){
                        objects[objname][arr[i]] = objdata.childArray[obj][arr[i]];
                    }
                }
            }
            localStorage.setItem(sig,JSON.stringify(objects));
            retval = objects;
            }
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["GetRepoProperties__" + type + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        //retrieve list of responsibilities for current user, or any given user
        extensions.GetRespArray = function(userid,primary_only){
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepUtils.prototype.GetRespArray(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetRespArray__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = false;
            
            var arr = new Array();
            var loginID = SiebelApp.S_App.GetProfileAttr("Id");
            var data;
            var primary;
            var prid;
            var temp;
            var insessionstorage = false;
            //ok let's speed this up
            var data_key = "BLACKSHEEP_USER_RESP_" + loginID;
            var sess_data = sessionStorage.getItem(data_key);
            if (sess_data != null){
                arr = sess_data.split("|");
                insessionstorage = true;
            }
            if (!insessionstorage){
                if (typeof(userid) === "undefined" || userid == loginID){
                    userid = loginID;
                    primary = SiebelApp.S_App.GetProfileAttr("Primary Responsibility Name");
                    arr.push(primary);
                }
                if (userid != loginID){
                    temp = bs.DataRetriever("Employee","Employee","[Id] = '" + userid + "'","Id",{"Primary Responsibility Id":""},{"viewmode":"3","log":"false","output":"json"});
                    prid = temp.childArray["Employee_1"]["Primary Responsibility Id"];
                    temp = bs.DataRetriever("Responsibility","Responsibility","[Id] = '" + prid + "'","Id",{"Name":""},{"viewmode":"3","log":"false","output":"json"});
                    primary = temp.childArray["Responsibility_1"]["Name"];
                    arr.push(primary);
                }
                if (typeof(primary_only) === "undefined" || primary_only == false){
                    data = bs.DataRetriever("Employee","Responsibility","[Id] IS NOT NULL","Id",{"Name":""},{"pbc":"Employee","rowid":userid,"viewmode":"3","log":"false","output":"json"});
                    for (rec in data.childArray){
                        if (data.childArray[rec].Name != primary && rec != "childArray"){
                            arr.push(data.childArray[rec].Name);
                        }
                    }
                }
                //save to session storage to speed up subsequent calls
                sessionStorage.setItem(data_key,arr.join("|"));
            }
            retval = arr;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["GetRespArray__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };



        /*
         Function GetAppletType: Returns the type (list, form, tree, chart) of applet
         Inputs: "context" (applet, PM or PR)
         Returns: type of applet as null or string
         */
        extensions.GetAppletType = function(context){
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepUtils.prototype.GetAppletType(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetAppletType__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = false;

            var type = null;
            var pm = null;
            var id = null;
            pm = bs.ValidateContext(context);
            if (pm){
                if (typeof(pm.Get) === "function"){
                    if(pm.Get("GetListOfColumns")){
                        retval = bs.GetMsg("TYPE_LIST");
                        type = true;
                    }
                }
                id = pm.Get("GetFullId");
                if ($("#" + id).find(".siebui-tree").length != 0){ //it's a tree!
                    retval = bs.GetMsg("TYPE_TREE");
                    type = true;
                }
                else if (!type){  //finding out whether it's a chart applet is tricky...
                    id = pm.Get("GetFullId").split("_")[1]; //chart applets have weird Ids
                    id = id.toLowerCase().charAt(0) + "_" + id.charAt(1);  //did I mention that they have weird Ids
                    if ($("#" + id).find(".siebui-charts-container").length != 0){
                        retval = bs.GetMsg("TYPE_CHART"); //It's a Bingo! -- Do you say it like that? -- No, you just say 'Bingo!'.
                    }
                    else{ //no list,tree or chart. 99% sure it's a form applet
                        retval = bs.GetMsg("TYPE_FORM");
                    }
                }
            }
            else{//not of this world...
                retval = bs.GetMsg("TYPE_UNKNOWN");
            }
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["GetAppletType__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        //retrieve Manifest Data for given object
        extensions.GetManifestData = function(context,self){
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepUtils.prototype.GetManifestData(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetManifestData__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = false;
            var name = ""
            var applettype = "";
            var pm = null;
            if (typeof(self) === "undefined"){
                self = false;
            }
            if (typeof(context) === "string"){
                name = context;

            }
            pm = bs.ValidateContext(context);
            if (pm){
                if (name == ""){
                    name = pm.GetObjName();
                }
                applettype = bs.GetAppletType(pm);
            }


            var data = bs.DataRetriever("blacksheep Manifest","blacksheep Manifest Flat E","[UI Object Name] LIKE '" + name + "' AND [UI Object Inactive] <> 'Y' AND [Is Inactive] <> 'Y'","Level Num",{"UI Object Name":"","UI Object Source":"","Id":"","UI Object Type":"","UI Object Usage Type":"","Ui Expr Name":"","Record Source":"","Group Name":"","Expression":"","Level Num":"","Parent Row Id":"","Operator Cd":"","Awt Name":""},{viewmode:3,log:false});
            for (i = 0; i < data.GetChildCount(); i++){
                var obj = data.GetChild(i);
                var objid = obj.GetProperty("Id");
                var file = bs.DataRetriever("blacksheep Manifest","blacksheep Manifest Flat","[Expression Row Id]='" + objid + "' AND [Inter Inactive Flag] <> 'Y' AND [File Inactive Flag] <> 'Y'","File Seq Num",{"File Name":"","File Seq Num":"","Id":""},{viewmode:3,log:false});

                for (j = 0; j < file.GetChildCount(); j++){
                    obj.AddChild(file.GetChild(j));
                }

            }
            
            switch (applettype){
                case bs.GetMsg("TYPE_LIST"): name = "DEFAULT LIST APPLET";
                    break;
                case bs.GetMsg("TYPE_FORM"): name = "DEFAULT FORM APPLET";
                    break;
                default: name = "DEFAULT*";
                    break;
            }

            //get defaults
            if (applettype != "" || name == "DEFAULT*"){
                if (!self){
                var def = this.GetManifestData(name,true);
                for (k = 0; k < def["raw"].GetChildCount(); k++){
                    data.AddChild(def["raw"].GetChild(k));
                }
                }
            }

            //process data
            if (!self){
                var uiobjects = {};
                //first pass, get ui objects
                for (i = 0; i < data.GetChildCount(); i++){
                    var temp = data.GetChild(i);
                    var oi = new Array();
                    var processed = false;
                    oi.push(temp.GetProperty("UI Object Name"));
                    oi.push(temp.GetProperty("UI Object Type"));
                    oi.push(temp.GetProperty("UI Object Usage Type"));
                    oi.push(temp.GetProperty("UI Object Source"));
                    var ois = oi.join("|");
                    for (ob in uiobjects){
                        if (ob == ois){
                            processed = true;
                        }
                    }
                    if (!processed){
                        uiobjects[ois] = {};
                        uiobjects[ois]["Name"] = temp.GetProperty("UI Object Name");
                        uiobjects[ois]["Type"] = temp.GetProperty("UI Object Type");
                        uiobjects[ois]["Usage Type"] = temp.GetProperty("UI Object Usage Type");
                        uiobjects[ois]["Source"] = temp.GetProperty("UI Object Source");
                    }

                }
                //second pass, get expression and files
                var expressions = new Array();
                var groups = new Array();
                for (i = 0; i < data.GetChildCount(); i++){
                    
                    temp = data.GetChild(i);
                    //var uiobj = {};
                    oi = new Array();
                    oi.push(temp.GetProperty("UI Object Name"));
                    oi.push(temp.GetProperty("UI Object Type"));
                    oi.push(temp.GetProperty("UI Object Usage Type"));
                    oi.push(temp.GetProperty("UI Object Source"));
                    ois = oi.join("|");
                    for (ob in uiobjects){
                        if (ob == ois){
                            temp.SetProperty("ois",ois);
                            if (temp.GetProperty("Group Name") == ""){
                                expressions.push(temp);
                            }
                            else{
                                groups.push(temp);
                            }
                        }
                    }
                }
                for (obj in uiobjects){
                    for (j = 0; j < groups.length; j++){
                        if (obj == groups[j].GetProperty("ois")){
                            var gname = "Group " + groups[j].GetProperty("Level Num") + " (" + groups[j].GetProperty("Group Name") + ")";
                            var groupid = groups[j].GetProperty("Id");
                            uiobjects[obj][gname] = {};
                            uiobjects[obj][gname]["Level"] = groups[j].GetProperty("Level Num");
                            uiobjects[obj][gname]["Group"] = groups[j].GetProperty("Group Name");
                            uiobjects[obj][gname]["Operator"] = groups[j].GetProperty("Operator Cd");
                            if (groups[j].GetProperty("Awt Name") != ""){
                                uiobjects[obj][gname]["Web Template"] = groups[j].GetProperty("Awt Name");
                            }
                            uiobjects[obj][gname]["Expression Source"] = groups[j].GetProperty("Record Source");
                            for (l = 0; l < expressions.length; l++){
                                var ename = "Exp " + expressions[l].GetProperty("Level Num") + " (" + expressions[l].GetProperty("Ui Expr Name") + ")";
                                var eparentid = expressions[l].GetProperty("Parent Row Id");
                                if (eparentid == groupid){
                                    uiobjects[obj][gname][ename] = {};
                                    uiobjects[obj][gname][ename]["Level"] = expressions[l].GetProperty("Level Num");
                                    uiobjects[obj][gname][ename]["Expression Name"] = expressions[l].GetProperty("Ui Expr Name");
                                    uiobjects[obj][gname][ename]["Expression"] = expressions[l].GetProperty("Expression");
                                    uiobjects[obj][gname][ename]["Expression Source"] = expressions[l].GetProperty("Record Source");
                                }
                            }
                            if (groups[j].GetChildCount() > 0){
                                for (k = 0; k < groups[j].GetChildCount(); k++){
                                    var fname;
                                    if (groups[j].GetChild(k).GetProperty("File Seq Num") != ""){
                                        fname = "File " + groups[j].GetChild(k).GetProperty("File Seq Num");
                                    }
                                    else{
                                        fname = "File " + (k+1);
                                    }
                                    uiobjects[obj][gname][fname] = {};
                                    uiobjects[obj][gname][fname]["Path"] = groups[j].GetChild(k).GetProperty("File Name");
                                    uiobjects[obj][gname][fname]["Sequence"] = groups[j].GetChild(k).GetProperty("File Seq Num");
                                }
                            }
                        }
                    }
                    for (j = 0; j < expressions.length; j++){
                        if (obj == expressions[j].GetProperty("ois") && expressions[j].GetProperty("Parent Row Id") == ""){
                            var ename = "Exp " + expressions[j].GetProperty("Level Num") + " (" + expressions[j].GetProperty("Ui Expr Name") + ")";
                            uiobjects[obj][ename] = {};
                            uiobjects[obj][ename]["Level"] = expressions[j].GetProperty("Level Num");
                            uiobjects[obj][ename]["Expression Name"] = expressions[j].GetProperty("Ui Expr Name");
                            uiobjects[obj][ename]["Expression"] = expressions[j].GetProperty("Expression");
                            if (expressions[j].GetProperty("Awt Name") != ""){
                                uiobjects[obj][ename]["Web Template"] = expressions[j].GetProperty("Awt Name");
                            }
                            uiobjects[obj][ename]["Expression Source"] = expressions[j].GetProperty("Record Source");
                            if (expressions[j].GetChildCount() > 0){
                                for (k = 0; k < expressions[j].GetChildCount(); k++){
                                    var fname;
                                    if (expressions[j].GetChild(k).GetProperty("File Seq Num") != ""){
                                        fname = "File " + expressions[j].GetChild(k).GetProperty("File Seq Num");
                                    }
                                    else{
                                        fname = "File " + (k+1);
                                    }
                                    uiobjects[obj][ename][fname] = {};
                                    uiobjects[obj][ename][fname]["Path"] = expressions[j].GetChild(k).GetProperty("File Name");
                                    uiobjects[obj][ename][fname]["Sequence"] = expressions[j].GetChild(k).GetProperty("File Seq Num");
                                }
                            }
                        }
                    }
                }
            }
            retval = [];
            retval["raw"] = data;
            retval["obj"] = uiobjects;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["GetManifestData__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };



        //get the DOM element for the applet title
        extensions.GetAppletTitleElem = function (context) {
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepUtils.prototype.GetAppletTitleElem(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetAppletTitleElem__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = false;
            var pm = bs.ValidateContext(context);
            var ae = bs.GetAppletElem(pm);
            var title = ae.find(".siebui-applet-title");
            retval = title;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + (retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["GetAppletTitleElem__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        //get the ROW_ID of the repository
        extensions.GetRepositoryId = function(name){
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepUtils.prototype.GetRepositoryId(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetRepositoryId__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = false;

            var repid;
            if (typeof(name) === "undefined"){
                name = "Siebel Repository";
            }
            var insessionstorage = false;
            //ok let's speed this up
            var data_key = "BLACKSHEEP_REPOSITORY_ID_" + name;
            var sess_data = sessionStorage.getItem(data_key);
            if (sess_data != null){
                repid = sess_data;
                insessionstorage = true;
            }
            if (!insessionstorage){
            var ps = bs.DataRetriever("Repository Repository","Repository Repository","[Name] LIKE '" + name + "'","Id",{"Id":""},{viewmode:3,log:false});
            repid = ps.GetChild(0).GetProperty("Id");
                sessionStorage.setItem(data_key,repid);
            }
            retval = repid;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["GetRepositoryId__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;

        };

        //replace applet title with any text
        extensions.ReplaceAppletTitle = function (context,text) {
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepUtils.prototype.ReplaceAppletTitle(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["ReplaceAppletTitle__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = false;
            var pm = bs.ValidateContext(context);
            var ae = bs.GetAppletElem(pm);
            var appletTitle = bs.GetAppletTitleElem(pm);
            var temp = bs.GenerateDOMElement("div",{class:"siebui-applet-title blacksheep-aux-title",id:"blacksheep_aux_title"});
            temp.html(text);

            if (appletTitle.length > 0){
                appletTitle.addClass("blacksheep-hidden");
                //var applet = bs.GetAppletElem(pm);
                if (ae.find("#blacksheep_aux_title").length == 0){
                    appletTitle.before(temp);
                }
            }
            else{
                //try adding before button group
                if (ae.find(".siebui-btn-grp-applet").length > 0){
                    ae.find(".siebui-btn-grp-applet").before(temp);
                }
            }
            retval = $(temp);
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["ReplaceAppletTitle__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        /*
         Function GetLabelElem: Gets a DOM element for a label/column header
         Inputs: applet object, PM or PR and control object
         Returns: label/column header DOM element
         */
        extensions.GetLabelElem = function(context,control){
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepUtils.prototype.GetLabelElem(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["GetLabelElem__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = false;
            //get the PM
            var pm = bs.ValidateContext(context);
            var labelElem = null;
            var appletType = null;
            var appletElem = bs.GetAppletElem(pm);
            if(pm){
                appletType = bs.GetAppletType(pm);
                switch (appletType){
                    case bs.GetMsg("TYPE_LIST"):
                        //in list applets, we can find the column header using th, placeholder and field name
                        var appletPH = pm.Get("GetPlaceholder");
                        var colmap = pm.GetRenderer().GetColumnHelper().GetColMap();  //get column map
                        var fieldName = control.GetName();
                        var colName = fieldName;
                        for (col in colmap){
                            if (colmap[col] == fieldName){
                            colName = col;
                            }
                        }
                        var selector = appletPH + "_" + colName;
                        labelElem = $("th#" + selector);
                        break;
                    case bs.GetMsg("TYPE_FORM"):
                        //in form applets, we can use the GetInputName method
                        //this is backward compatible with IP 2013 or earlier
                        var controlElem = $("[name='"+ control.GetInputName() + "']");
                        //the id of the label element is 'hidden' in the control input element
                        var labelId = controlElem.attr("aria-labelledby");
                        //avoid jQuery falling over 'illegal' characters, use native JavaScript instead
                        labelElem = jQuery(document.getElementById(labelId));
                        labelElem = appletElem.find(labelElem);
                        break;
                    default: break;
                }
            }
            retval = labelElem;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + (retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["GetLabelElem__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };

        //set label text for any given control
        extensions.SetLabel = function(context,control, text){
                                                                                                                        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepUtils.prototype.SetLabel(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["SetLabel__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = false;
            var pm = bs.ValidateContext(context);
            var controlName = control.GetInputName();  //get control input name
            var appletElem = bs.GetAppletElem(pm);
            var theControl = $(appletElem).find("[name='" + controlName + "']"); //get control DOM element
            var labelID = theControl.attr("aria-labelledby"); //get label ID for control (see workaround notes below)
            if (labelID !== "undefined"){ //if the control has a label
                //find closest element with the label ID
                
                var theLabel = bs.GetLabelElem(pm,control);
                var labelText = theControl.attr("aria-label");  //get label text from attribu

                //Workaround: if we cannot find the label by ID, "repair" the label ID
                //this is necessary because on some applets, label IDs are not in sync with aria-labelledby
                if (theLabel.length == 0){ //label not found
                    //locate the label by the label text
                    theLabel = theControl.closest("td").parent().find("span:contains('" + labelText + "')");
                    theLabel.attr("id",labelID); //"repair" the label ID
                }
                //set label HTML and return the label element to the caller
                if (bs.GetAppletType(pm) == bs.GetMsg("TYPE_LIST")){
                    $(theLabel).find("div").html(text);
                }
                else{
                    theLabel.html(text);
                }
                retval = theLabel;
            }
            else{
                //control has no label, return null
                retval = null;
            }
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + (retval)); }if (bsc.perf == "yes") {var zperf = Date.now(); blacksheep_perf_function_call["SetLabel__" + "()" + "__" + aperf]["End"]=zperf;}
            return retval;
        };



        //Do not modify after this line
        for (var fName in extensions) {
            BlacksheepUtils.prototype[fName] = extensions[fName];
        }
        //make container public
        BlacksheepUtils.prototype.Extensions = extensions;
        //extend core class
        var bs = new SiebelAppFacade.Blacksheep();
        bs.Extender(SiebelAppFacade.Blacksheep,BlacksheepUtils);
        retval = BlacksheepUtils;
                                                                                                                        if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
        return retval;
    }();
}
var bs_z=Date.now(); console.log("blacksheep.js : debugger : " + bs_z + " : file " + "blacksheep-utils.js : loaded : time(ms): " + parseInt(bs_z-bs_a)); blacksheep_perf_file_load["blacksheep-utils.js"] = parseInt(bs_z-bs_a); bs_z = bs_a = null;

