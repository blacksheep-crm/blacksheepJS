/*******************************************************************
 * File:          blacksheep-progressbar.js
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
 *
 */

//TODO:  is it possible to have an animation / icon or something when you hit 100%.
//TODO: Also, is it possible to configure which fields are considered as part of the 100%,
    //TODO: so a customer could define x control as useful and in the 100% but y control as not useful (sort of not a required but recommended field)

var bs_a=Date.now(); console.log("blacksheep.js : debugger : " + bs_a + " : file " + "blacksheep-progressbar.js : loading");

var blacksheepProgressBarModule = "ShowProgressBar";
bsco.AddModule(blacksheepProgressBarModule, {
    file : "blacksheep-progressbar.js",
        enabled : "yes",
        autostart: "yes",
        mandatory : "no",
        label : "MOD_PB_LABEL",
        description : "MOD_PB_DESC",
        dependencies : ["core","utilities"],
        userconfig : "yes",
        scope : ["Applet"],
    useroptions : {
        "show_tip":{
            "description":"MOD_PB_SHOW_TIP",
            "type" : "text",
            "widget" : ["lov","LOV_YES_NO"],
            "value" : "yes",
            "default" : "yes"
        },
        "storage_default" : "userpref"},
        whitelist : {
        "applications":["all"],
            "screens":["Accounts Screen","Contacts Screen"],
            //"applets":["SIS Account Entry Applet","Contact List Applet","Contact Form Applet"],
            "views":["all"],
            "bos":["all"],
            "bcs":["Account","Contact"]
    }
},true);

if (SiebelAppFacade.Blacksheep.prototype.ShouldItExist(SiebelAppFacade.BlacksheepProgressBar,blacksheepProgressBarModule))  {

    SiebelJS.Namespace("SiebelAppFacade.BlacksheepProgressBar");

    SiebelAppFacade.BlacksheepProgressBar = function () {
                                                                                                                        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function SiebelAppFacade.BlacksheepProgressBar() : "; console.log(bsd + a + f + "begin"); }
        function BlacksheepProgressBar() { console.log(this.GetMsg("INIT_CONSTR",true) + "BlacksheepProgressBar"); }
        var bs = new SiebelAppFacade.Blacksheep();

        bs.SetMsg("OF_FIELDS"," Felder von ","deu");
        bs.SetMsg("POP_FIELDS_1"," befüllt (","deu");
        bs.SetMsg("POP_FIELDS_2","%).","deu");
        bs.SetMsg("POP_REQ","Nicht befüllte Pflichtfelder: ","deu");
        bs.SetMsg("MOD_PB_LABEL","Fortschrittsbalken","deu");
        bs.SetMsg("MOD_PB_DESC","Zeigt den Füllstand eines Datensatzes an.","deu");
        bs.SetMsg("MOD_PB_LABEL","Progress Bar","enu");
        bs.SetMsg("MOD_PB_DESC","Displays fill rate for applet controls.","enu");
        bs.SetMsg("OF_FIELDS"," fields of ","enu");
        bs.SetMsg("POP_FIELDS_1"," populated (","enu");
        bs.SetMsg("POP_FIELDS_2","%).","enu");
        bs.SetMsg("POP_REQ","Missing required fields: ","enu");
        bs.SetMsg("MOD_PB_SHOW_TIP","Display Tooltip","enu");
        bs.SetMsg("MOD_PB_SHOW_TIP","Zeige Tooltip","deu");
        var extensions = {};

        /*
         Function GetCtrlData: Returns object with control attributes for all field-based controls
         Input: context (PM, PR or applet instance)
         Output: JSON object
         */
        extensions.GetCtrlData = function(context){                                                               if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepUtils.prototype.GetCtrlData(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }

            var pm = null;
            var retval = {};
            var bs = new SiebelAppFacade.Blacksheep();
            pm = bs.ValidateContext(context);
            if (pm){
                var controlSet = pm.Get("GetControls");
                var bc = pm.Get("GetBusComp"); //get BC instance
                var fieldmap = bc.GetFieldMap(); //get field map of BC instance
                var field;
                var fieldname = "";
                var isReadOnly = false;
                var isRequired = false;
                var isMvg = false;
                var isEditable = false;
                var label = "";
                var oName = "";
                var val;
                var popupType = "";
                var controlElem;
                for (c in controlSet){ //for each control
                    var ctrlData = {};
                    fieldname = controlSet[c].GetFieldName(); //get BC field name
                    popupType = controlSet[c].GetPopupType(); //get popup type (e.g "Mvg")
                    field = fieldmap[fieldname];  //get BC field instance
                    if (field){ //only applies to controls that expose a BC field (excludes buttons etc)
                        controlElem = $("[name='" + controlSet[c].GetInputName() + "']");  //get DOM element
                        //figure out some details about the control's attitude
                        isReadOnly = field.IsReadOnly() == "1" || controlElem.attr("aria-readonly") == "true" ? true : false;
                        isRequired = field.IsRequired() == "1" || controlElem.attr("aria-required") == "true" ? true : false;
                        isMvg = popupType == "Mvg" ? true : false;
                        val = pm.ExecuteMethod("GetFieldValue",controlSet[c]);
                        if (!isReadOnly || popupType == "Mvg"){  //if not read only or an MVG field
                            //field is editable
                            isEditable = true;
                        }
                        else
                        {
                            isEditable = false;
                        }
                        label = controlSet[c].GetDisplayName();

                        ctrlData["oControl"] = controlSet[c];
                        ctrlData["oField"] = field;
                        ctrlData["elem"] = controlElem;
                        ctrlData["popupType"] = popupType;
                        ctrlData["label"] = controlSet[c].GetDisplayName();
                        ctrlData["fieldName"] = fieldname;
                        ctrlData["isReadOnly"] = isReadOnly;
                        ctrlData["isRequired"] = isRequired;
                        ctrlData["isEditable"] = isEditable;
                        ctrlData["isMvg"] = isMvg;
                        ctrlData["value"] = val;

                        oName = fieldname + "_" + label
                        retval[oName] = ctrlData;
                    }

                }
            }
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + retval); }
            return retval;
        };

        /*
         Function ComputeProgress: Calculates the ratio of populated vs. total editable controls
         Input: context (PM, PR or applet instance)
         Output: object with statistics
         */
        extensions.ComputeProgress = function(context){                                                       if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepUtils.prototype.ComputeProgress(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }
            var pm = null;
            var progress = 0;
            var nFull = 0;
            var nEmpty = 0;
            var nEditable = 0;
            var nTotal = 0;
            var nRequired = 0;
            var oReqFields ={};
            var retval = {};
            var bs = new SiebelAppFacade.Blacksheep();
            pm = bs.ValidateContext(context);
            if (pm){

                //call helper function
                var fields = bs.GetCtrlData(pm);
                nTotal = Object.keys(fields).length; //get total # of field-based controls
                for (field in fields){ //iterate

                    if (fields[field].isEditable){
                        nEditable++;
                        if (fields[field].value == ""){  //control is currently empty
                            nEmpty++;
                        }
                        else{   //control has a value
                            nFull++;
                        }
                        if (fields[field].isRequired && fields[field].value == ""){
                            nRequired++;
                            oReqFields[field] = fields[field];
                        }
                    }
                }
                retval["t"] = nEditable;
                retval["f"] = nFull;
                retval["e"] = nEmpty;
                retval["r"] = nRequired;
                retval["i"] = nFull/nEditable; //calculate ratio of full vs. total
                retval["p"] = 100*(nFull/nEditable); //ratio in percent
                retval["m"] = oReqFields;
            }
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
            return retval;
        };

        /*
         Function GetColor: returns a red-amber-green color tone depending on input value
         Input: value (Number)
         Output: rgb encoded color string
         */
        extensions.GetColor = function(val){                                                                  if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepUtils.prototype.GetColor(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }
            var retval = "FFF";
            var g = val <= 50 ? val*2 : 100; //if val <= 50, then green will be 0-100, above green will be 100
            var r = val > 50 ? 200 - (val*2) : 100; //if val > 50, red will be 100, above, red will be 100 - 0
            retval =  "rgb(" + r + "%," + g + "%,0%)"; //color in rgb % style e.g. "rgb(40%,100%,0%)"
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
            return retval;
        };

        /*
         Function UpdateProgressBar: locates and updates (value, color) of a progress bar on the given applet
         Input: context(optional): PM, PR or applet instance
         */
        extensions.UpdateProgressBar = function(context){                                                               if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepProgressBar.prototype.UpdateProgressBar(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }

            var retval = false;
            var pm = null;
            var bs = new SiebelAppFacade.Blacksheep();
            
            pm = bs.ValidateContext(context);
            if (typeof(context) !== "undefined" && context.constructor.name == "AppletControl"){ //avoid issues when called from FieldChange event
                pm = bs.ValidateContext(bs.GetActivePM());
            }
            else if (!pm){ //use current object context (this) if we still haven't got a PM
                pm = bs.ValidateContext(this);
            }
            if (pm){
                var isQuery = pm.Get("IsInQueryMode");
                var appletElem = bs.GetAppletElem(pm);
                var pb = appletElem.find(".blacksheep-progressbar"); //try to locate progress bar
                var tip = appletElem.find(".blacksheep-progressbar-tip");
                var reqFields = [];
                var title;
                if (pb.length > 0){ //gotcha
                    if (isQuery){
                        pb.hide();
                        tip.hide();
                        appletElem.find(".siebui-applet-header").removeClass("blacksheep-progressbar-header-fix");
                    }
                    else{
                        pb.show();
                        if ($(tip).length > 0){
                            tip.show();
                            appletElem.find(".siebui-applet-header").addClass("blacksheep-progressbar-header-fix");

                        }
                        var stats = bs.ComputeProgress(pm);  //get current stats from helper function
                        var val = stats.p; //value in percent
                        pb.progressbar("value", val);  //set value


                        title = stats.f + bs.GetMsg("OF_FIELDS") + stats.t + bs.GetMsg("POP_FIELDS_1") + parseInt(val) + bs.GetMsg("POP_FIELDS_2");

                        var class_req = "blacksheep-progressbar-required";
                        var tip_req = "blacksheep-progressbar-tip-required";
                        if (stats.r > 0){
                            pb.find(".ui-progressbar-value").addClass(class_req);
                            for (field in stats.m){
                                reqFields.push(stats.m[field].label);
                            }
                            title = title + " " + bs.GetMsg("POP_REQ") + "[" + reqFields.join(", ") + "]";
                        }
                        else{
                            //get color for value bar
                            var color = bs.GetColor(val);
                            //set color
                            pb.find(".ui-progressbar-value").removeClass(class_req);
                            pb.find(".ui-progressbar-value").css("background",color);
                        }
                        retval = true;
                        pb.attr("title",title);

                        tip.text(title);
                        if(stats.r > 0){
                            tip.addClass(tip_req);
                        }
                        else{
                            tip.removeClass(tip_req);
                        }
                    }

                }
            }
                                                                                                                        if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
            return retval;
        };

         /*
         Function ShowProgressBar: paints a progress bar on the applet header
         Requires CSS: see blacksheep.css for details
         Input: context (PM, PR or applet instance)
         */
        extensions.ShowProgressBar = function(context){                                                       if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepProgressBar.prototype.ShowProgressBar(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }
            
            var modname = "ShowProgressBar";
            var bs = new SiebelAppFacade.Blacksheep();
            var wl = bs.GetWhiteList(modname);
            var is_whitelisted = bs.ProcessWhiteList(wl,context);
            var retval = false;
            var pm = null;
            if (is_whitelisted){

                console.log(bs.GetMsg("WL_TRUE",true) + modname + ", " + bs.GetActivePM().Get("GetName"));
                pm = bs.ValidateContext(context);
                if (pm){
                    var appletElem = bs.GetAppletElem(pm);
                    var appletId = pm.Get("GetFullId");
                    var propname = bs.GetMsg("PMPROP_MOD_PREFIX") + modname;
                    var propsys = bs.GetMsg("PMPROP_MOD_SYS");
                    var propuser = bs.GetMsg("PMPROP_MOD_USER");
                    var is_user_enabled = bs.GetUserPref(pm,propname + propuser);

                    //we need a unique id, let's use the applet id
                    var pb_id = "blacksheep_pb_" + appletId;
                    //remove all progress bar instances that might exist
                    $("#" + pb_id).remove();
                    $("#" + pb_id + "_tip").remove();
                    appletElem.find(".siebui-applet-header").removeClass("blacksheep-progressbar-header-fix");
                    pm.SetProperty(propname + propsys,true);
                    if (typeof(is_user_enabled) === "undefined" || is_user_enabled == "true" || is_user_enabled == true){
                        
                        var u_opt = bs.GetSavedModuleOptions(pm,modname);
                        var show_tip = SiebelAppFacade.BlacksheepConfig.config.modules[modname].useroptions.show_tip.default == "yes" ? true : false;
                        if (!$.isEmptyObject(u_opt)){
                            show_tip = (u_opt.show_tip == "yes") ? true : false;
                        }

                        //now let's get the applet header
                        var appletHeader = appletElem.find($(".siebui-applet-header"));

                        if ($("#" + pb_id).length == 0){ //avoid deja vu
                            //create a div
                            var pb = bs.GenerateDOMElement("div",{"id":pb_id, "class":"blacksheep-progressbar"});
                            var pb_tip = bs.GenerateDOMElement("div",{"id":pb_id + "_tip", "class":"blacksheep-progressbar-tip"});
                            //paint the progress bar
                            appletHeader.append(pb.progressbar());
                            $(pb).click(function(e){
                                if (e.ctrlKey){
                                    bs.ShowOptionsDialog(pm,modname,this);
                                }
                            });
                            if (show_tip){
                                pb.after(pb_tip);
                                $(pb_tip).click(function(e){
                                    if (e.ctrlKey){
                                        bs.ShowOptionsDialog(pm,modname,this);
                                    }
                                });
                            }

                        }
                        //repair applet header
                        
                        if (!show_tip){
                            appletElem.find(".siebui-applet-header").removeClass("blacksheep-progressbar-header-fix");
                        }
                        else{
                            appletElem.find(".siebui-applet-header").addClass("blacksheep-progressbar-header-fix");
                        }

                        //call helper function to update the progress bar
                        bs.UpdateProgressBar(pm);
                        //attach to PM events (fingers crossed, should work for form and list applets)
                        bs.Overdrive(pm,"FieldChange",bs.UpdateProgressBar);
                        bs.Overdrive(pm,"ShowSelection",bs.UpdateProgressBar);
                        bs.Overdrive(pm,"HandleRowSelect",bs.UpdateProgressBar);
                        //set PM property

                        bs.SetUserPref(pm,propname + propuser,true);
                        retval = true;
                    }
                    else{
                        console.log(modname + bs.GetMsg("PMPROP_DISABLED"));
                    }
                }
            }
            else{
                console.log(bs.GetMsg("WL_FALSE",true) + "ShowProgressBar, " + bs.GetActivePM().Get("GetName"));
            }
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
            return retval;
        };


        //Do not modify after this line
        for (var fName in extensions) {
            BlacksheepProgressBar.prototype[fName] = extensions[fName];
        }
        //make container public
        BlacksheepProgressBar.prototype.Extensions = extensions;
        //extend core class
        var bs = new SiebelAppFacade.Blacksheep();
        bs.Extender(SiebelAppFacade.Blacksheep,BlacksheepProgressBar);
        retval = BlacksheepProgressBar;
                                                                                                                        if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
        return retval;
    }();


}
var bs_z=Date.now(); console.log("blacksheep.js : debugger : " + bs_z + " : file " + "blacksheep-progressbar.js : loaded : time(ms): " + parseInt(bs_z-bs_a)); blacksheep_perf_file_load["blacksheep-progressbar.js"] = parseInt(bs_z-bs_a); bs_z = bs_a = null;

