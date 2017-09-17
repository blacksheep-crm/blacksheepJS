/*******************************************************************
 * File:          blacksheep-dialog.js
 * Author:        Alexander Hansal (alex@blacksheep-crm.com)
 * Description:   jQuery dialog utility for blacksheep.js, a professional utility library and API extension for Oracle Siebel CRM.
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
//TODO: support html, text and jquery objects for ShowDialog
var bs_a=Date.now(); console.log("blacksheep.js : debugger : " + bs_a + " : file " + "blacksheep-dialog.js : loading");

var blacksheepDialogModule = "ShowDialog";
bsco.AddModule(blacksheepDialogModule, {
        file : "blacksheep-dialog.js",
        enabled : "yes",
        mandatory : "no",
        description : "Dialog display engine for blacksheep.js",
        dependencies : ["core"],
        scope : ["Application"],
        whitelist : {
            "applications":["all"],
            "screens":["all"],
            "applets":["all"],
            "views":["all"],
            "bos":["all"],
            "bcs":["all"]
        }},true
);

if (SiebelAppFacade.Blacksheep.prototype.ShouldItExist(SiebelAppFacade.BlacksheepDialog,blacksheepDialogModule))  {

    SiebelJS.Namespace("SiebelAppFacade.BlacksheepDialog");

    SiebelAppFacade.BlacksheepDialog = function () {
        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function SiebelAppFacade.BlacksheepDialog() : "; console.log(bsd + a + f + "begin"); }
        function BlacksheepDialog() {
            console.log("blacksheep.js : in constructor : BlacksheepDialog");
            if (typeof(SiebelAppFacade.BlacksheepDialog.templates) === "undefined"){
                this.AddDialogTemplate("DEFAULT",{
                    buttons: [
                        {
                            text: bs.GetMsg("BTN_CLOSE"),
                            click: function() {
                                $(this).dialog("destroy");
                            }
                        }
                    ],
                    //width: "auto",
                    height: "auto",
                    minWidth: 300,
                    modal: false,
                    dialogClass: "blacksheep-dialog",
                    title : bs.GetMsg("DLG_DEF_TITLE")
                },true);
            }

        }

        var extensions = {};

        //Add custom functions after this line; use extensions.FunctionName = function(){}; as template!
        var bs = new SiebelAppFacade.Blacksheep();
        extensions.ShowDialog = function(dialog_def,msg){
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepDialog.prototype.ShowDialog(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["ShowDialog__" + dialog_def + "__" + aperf]={"Start":aperf,"End":0};}
            //if a module is whitelisted, add code similar to the following to exclude relevant processing from current context
            var modname = "ShowDialog";

            var wl = bs.GetWhiteList(modname);
            var is_whitelisted = bs.ProcessWhiteList(wl); //pass context as second parameter if you have it, defaults to active PM
            var retval = false;
            var html = "";
            if (is_whitelisted){
                //object is in whitelist, put everything you want to execute in this block
                console.log(bs.GetMsg("WL_TRUE") + modname);
                var dlg = bs.GenerateDOMElement("div");
                var dlgdef;
                var usedefault = true;

                var templates = SiebelAppFacade.BlacksheepDialog.templates;
                for (tp in templates){
                    if (tp == dialog_def) {
                        usedefault = false;
                    }
                }

                if (usedefault){
                    dlgdef = SiebelAppFacade.BlacksheepDialog.templates["DEFAULT"];
                    if (typeof(msg) === "undefined"){
                        msg = dialog_def;
                    }
                }
                else{
                    dlgdef = SiebelAppFacade.BlacksheepDialog.templates[dialog_def];
                }
                if (typeof(dlgdef.bs_html) !== "undefined"){
                    html = dlgdef.bs_html;
                }

                if (typeof(msg) === "string"){
                    html += "<p>" + msg + "</p>";
                }
                dlg.html(html);
                dlg.dialog(dlgdef);

                if (typeof(dlgdef.bs_function) !== "undefined"){
                    SiebelAppFacade.Blacksheep.prototype[dlgdef.bs_function].call(this);
                }
                retval = true;
            }
            else{
                console.log(bs.GetMsg("WL_FALSE") + modname);
            }
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + (retval)); }if (bsc.perf == "yes") {var zp = Date.now(); blacksheep_perf_function_call["ShowDialog__" + dialog_def + "__" + aperf]["End"]=zp;}
            return retval;
        };

        extensions.createSwitch = function(state,id){                                                                   if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepDialog.prototype.createSwitch(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["createSwitch__" + state + "__" + aperf]={"Start":aperf,"End":0};}

            var retval = "";
            var html = "";
            html += "<div class='onoffswitch'>";
            html += "<input type='checkbox' name='onoffswitch' class='onoffswitch-checkbox' id='" + id + "'";
            html += (state == "on") ? "checked>" : ">";
            html += "<label class='onoffswitch-label' for='" + id + "'>";
            html += "<span class='onoffswitch-inner'></span>";
            html += "<span class='onoffswitch-switch'></span>";
            html += "</label></div>";
            retval = html;
            //override switch labels with translated strings
            //resort to workaround because labels are defined in CSS pseudo-elements
            //ref: http://stackoverflow.com/questions/5041494/selecting-and-manipulating-css-pseudo-elements-such-as-before-and-after-usin
            if (document.styleSheets[0].addRule){
                for (var i = 0; i < document.styleSheets.length; i++){
                    var href = document.styleSheets[i].href;
                    if (href && href.indexOf("blacksheep.css") > 0){
                        document.styleSheets[i].addRule('.onoffswitch-inner:before','content: "'+ bs.GetMsg("SWITCH_ON") +'";');
                        document.styleSheets[i].addRule('.onoffswitch-inner:after','content: "'+ bs.GetMsg("SWITCH_OFF") +'";');
                    }
                }
            }
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zp = Date.now(); blacksheep_perf_function_call["createSwitch__" + state + "__" + aperf]["End"]=zp;}
            return retval;
        };
        extensions.prepareConfigTab = function(){                                                                       if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepDialog.prototype.prepareConfigTab() : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["prepareConfigTab__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}


            var retval = false;
            var usermodules = bs.GetModuleDefinition({"userconfig":"yes"});

            var appletmap = SiebelApp.S_App.GetActiveView().GetAppletMap();
            var html = "";
            var modulecount = 0;

            html += "<div id='bs_ts_module_content'>";
            html += "<p class='blacksheep-module-header'>" + bs.GetMsg("TS_DLG_MOD_HD") + "</p><hr>";
            html += "<div class='blacksheep-module-instructions'>" + bs.GetMsg("TS_DLG_MOD_DESC") + "</div><hr>";
            for (m in usermodules){
                var temp = "";
                var isEnabled = !!(usermodules[m].enabled == "yes");
                var scope = usermodules[m].scope;
                var label = bs.GetMsg(usermodules[m].label);
                var desc = bs.GetMsg(usermodules[m].description);
                var wl = bs.GetWhiteList(m);
                if (scope === "undefined" || $.inArray("Applet",scope) > -1){
                    for (ap in appletmap){
                        var pm = bs.ValidateContext(appletmap[ap]);
                        var id = "bs_mm_" + pm.Get("GetFullId");
                        var isWL = bs.ProcessWhiteList(wl,appletmap[ap]);
                        if (isWL && isEnabled){
                            modulecount++;
                            temp += "<span id='" + id + "'></span>";
                        }
                    }
                }
                else if($.inArray("Application",scope) > -1 || $.inArray("View",scope) > -1){
                    var isWL = bs.ProcessWhiteList(wl);
                    var id = "bs_mm_app_" + m;
                    if (isWL && isEnabled){
                        modulecount++;
                        temp += "<span id='" + id + "'></span>";
                    }
                }

                if (temp != ""){
                    html += "<p><span class='blacksheep-module-label' id='bs_md_" + m + "' name='" + m + "'>" + label;
                    html += temp;
                    html += "</span></p>";
                    html += "<div class='blacksheep-module-description'>" + desc + "</div><hr>";
                }
            }
            if (modulecount == 0){
                html += "<div class='blacksheep-module-instructions'>" + bs.GetMsg("TS_DLG_MOD_NA") + "</div><hr>";
            }
            retval = html;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zp = Date.now(); blacksheep_perf_function_call["prepareConfigTab__" + "()" + "__" + aperf]["End"]=zp;}
            return retval;
        };

        extensions.getViewMap = function(){                                                                       if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepDialog.prototype.getViewMap() : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["getViewMap__" + SiebelApp.S_App.GetActiveView().GetName() + "__" + aperf]={"Start":aperf,"End":0};}

            var retval = false;

            var appletmap = SiebelApp.S_App.GetActiveView().GetAppletMap();
            var viewelem = $("#_sweview");
            var fc = 0.25;  //resize factor
            var left_fix = 0;
            var top_fix = 38;
            var min_w = 150;
            var max_w = 450;
            var applet_min_h = 55;
            var applet_max_h = 150;
            var map = bs.GenerateDOMElement("div",{class:"blacksheep-content"});
            var viewcontainer = bs.GenerateDOMElement("div",{class:"blacksheep-viewmap-container"});
            var vc_width = viewelem.width()*fc;
            if (vc_width >= max_w){vc_width = max_w}
            else if (vc_width <= min_w){vc_width = min_w}
            viewcontainer.width(vc_width );
            viewcontainer.height(viewelem.height()*fc);
            for (ap in appletmap){
                var pm = bs.ValidateContext(appletmap[ap]);
                var appletelem = bs.GetAppletElem(appletmap[ap]);
                if (appletelem.length > 0){
                    var appletcontainer = bs.GenerateDOMElement("div",{class:"blacksheep-viewmap-applet",id:"bs_vm_" + pm.Get("GetFullId")});
                    var appletpos = appletelem.offset();
                    var atop = appletpos.top;
                    var aleft = appletpos.left;
                    var ac_width = appletelem.width()*fc;
                    if (ac_width >= max_w){ac_width = max_w}
                    else if (ac_width <= min_w){ac_width = min_w}
                    var ac_height = appletelem.height()*fc;
                    if (ac_height >= applet_max_h){ac_height = applet_max_h}
                    else if (ac_height <= applet_min_h){ac_height = applet_min_h}
                    appletcontainer.width(ac_width);
                    appletcontainer.height(ac_height);
                    appletcontainer.text(ap);
                    appletcontainer.css("left",(aleft*fc)+left_fix);
                    appletcontainer.css("top",(atop*fc)+top_fix);
                    viewcontainer.append(appletcontainer);
                }
            }
            map.append(viewcontainer);

            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zp = Date.now(); blacksheep_perf_function_call["getViewMap__" + SiebelApp.S_App.GetActiveView().GetName() + "__" + aperf]["End"]=zp;}
            return map;
        };

        extensions.BuildDialogTSMAIN = function(){                                                                       if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepDialog.prototype.BuildDialogTSMAIN() : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["BuildDialogTSMAIN__" + "()" + "__" + aperf]={"Start":aperf,"End":0};}

            var retval = false;
            $("#bs_ts_tabs").tabs();
            $("#bs_ts_tab2").append(this.prepareConfigTab());
            $("#bs_ts_tab2").append(this.getViewMap());
            //fix applet map display
            var pad = $("#bs_ts_module_content").width();
            $(".blacksheep-viewmap-container").children().each(function(){

                var orig = parseFloat($(this).css("left"));
                $(this).css("left",orig + pad + 3);
            });
            retval = true;
            //click handlers
            var items = $("#bs_ts_module_content").children("p");

            items.each(function(i){

                $(this).find("span").click(function(){

                    var modname = $(this).attr("name");
                    var moddef = bsco.GetModule(modname);
                    if (moddef.scope === "undefined" || $.inArray("Applet",moddef.scope) > -1){
                        $(this).parent().addClass("blacksheep-module-selected");
                        $(this).parent().siblings("p").removeClass("blacksheep-module-selected");
                        var vc = $(".blacksheep-viewmap-container");
                        $(".blacksheep-viewmap-dummy").remove();
                        vc.children().show();
                        vc.children().removeClass("blacksheep-viewmap-applet-available");
                        vc.children().removeClass("blacksheep-viewmap-applet-enabled");
                        vc.find(".onoffswitch").remove();
                        vc.find(".blacksheep-useroptions-button").remove();


                        var propname = bs.GetMsg("PMPROP_MOD_PREFIX") + modname;
                        var propsys = bs.GetMsg("PMPROP_MOD_SYS");
                        var propuser = bs.GetMsg("PMPROP_MOD_USER");

                        $(this).children("span").each(function(){
                            var id = $(this).attr("id");
                            var appletid = id.substring(6,id.length);
                            var pm = bs.ValidateContext(appletid);
                            var state = "";
                            var switchid = "switch_" + appletid;
                            var btnid = "options_" + appletid;
                            var appletdiv = $(".blacksheep-viewmap-container").find("#bs_vm_" + appletid);
                            var ps = propname + propsys;
                            var pu = propname + propuser;

                            if (pm.Get(ps) == true && bs.GetUserPref(pm,pu) == true){
                                state = "on";
                                appletdiv.addClass("blacksheep-viewmap-applet-enabled");
                            }
                            else{
                                state = "off";
                                appletdiv.addClass("blacksheep-viewmap-applet-available");
                            }
                            if ($("#switch_" + appletid).length == 0){
                                appletdiv.append(bs.createSwitch(state,switchid));
                            }
                            //switch handler
                            $("[for='" + switchid + "']").click(function(){

                                switch (state){
                                    case "on": bs.SetUserPref(pm,propname + propuser,false);
                                        appletdiv.removeClass("blacksheep-viewmap-applet-enabled");
                                        appletdiv.addClass("blacksheep-viewmap-applet-available");
                                        appletdiv.find("#" + btnid).hide();
                                        state = "off";
                                        break;
                                    case "off": bs.SetUserPref(pm,propname + propuser,true);
                                        appletdiv.removeClass("blacksheep-viewmap-applet-available");
                                        appletdiv.addClass("blacksheep-viewmap-applet-enabled");
                                        appletdiv.find("#" + btnid).show();
                                        state = "on";
                                        break;
                                }

                                SiebelAppFacade.Blacksheep.prototype[modname].call(bs,pm);
                            });

                            //options cogwheel
                            if (typeof (moddef.useroptions) !== "undefined"){
                                //display cogwheel
                                var uo = moddef.useroptions;
                                var btn = bs.GenerateDOMElement("div",{"id":btnid,"class":"blacksheep-useroptions-button","title":bs.GetMsg("TS_UO_BTN_TITLE")});
                                if ($("#" + btnid).length == 0){
                                    appletdiv.append(btn);
                                    btn.click(function(){

                                        var appletid = $(this).attr("id");
                                        appletid = appletid.substring(8,appletid.length);
                                        var pm = bs.ValidateContext(appletid);
                                        //show options dialog
                                        bs.ShowOptionsDialog(pm,modname);
                                    });
                                }
                                if (state == "off"){
                                    $("#" + btnid).hide();
                                }
                            }

                        });
                    }
                    else if ($.inArray("Application",moddef.scope) > -1 || $.inArray("View",moddef.scope) > -1){
                        $(this).parent().addClass("blacksheep-module-selected");
                        $(this).parent().siblings("p").removeClass("blacksheep-module-selected");
                        var vc = $(".blacksheep-viewmap-container");
                        vc.children().hide();
                        vc.find($(".onoffswitch")).remove();
                        $(".blacksheep-viewmap-dummy").remove();
                        var dummycontainer = bs.GenerateDOMElement("div",{class:"blacksheep-viewmap-dummy",id:"bs_vm_app_" + modname});
                        vc.append(dummycontainer);
                        if ($.inArray("Application",moddef.scope) > -1 ){
                            dummycontainer.text(bs.GetMsg("TS_DLG_MOD_APP"));
                            var cname = bs.GetMsg("COOKIE_MOD_PRE") + modname + bs.GetMsg("COOKIE_MOD_POST");
                        }
                        else if ($.inArray("View",moddef.scope) > -1 ){
                            dummycontainer.text(bs.GetMsg("TS_DLG_MOD_VIEW"));
                            var cname = bs.GetMsg("COOKIE_MOD_PRE") + modname + "_" + SiebelApp.S_App.GetActiveView().GetName() + bs.GetMsg("COOKIE_MOD_POST");
                        }
                        var switchid = "switch_" + modname;
                        var btnid = "options_" + "dummy";
                        var cval = jQuery.cookie(cname);
                        var state = "";
                        if (cval === "undefined" || cval == "true"){
                            state = "on";
                            dummycontainer.addClass("blacksheep-viewmap-applet-enabled");
                        }
                        else
                        {
                            state = "off";
                            dummycontainer.addClass("blacksheep-viewmap-applet-available");
                        }
                        if ($("#" + switchid).length == 0){
                            dummycontainer.append(bs.createSwitch(state,switchid));
                        }

                        $("[for='" + switchid + "']").click(function(){

                            switch (state){
                                case "on": jQuery.cookie(cname,"false",{expires:999});
                                    dummycontainer.removeClass("blacksheep-viewmap-applet-enabled");
                                    dummycontainer.addClass("blacksheep-viewmap-applet-available");
                                    dummycontainer.find("#" + btnid).hide();
                                    state = "off";
                                    break;
                                case "off": jQuery.cookie(cname,"true",{expires:999});
                                    dummycontainer.removeClass("blacksheep-viewmap-applet-available");
                                    dummycontainer.addClass("blacksheep-viewmap-applet-enabled");
                                    dummycontainer.find("#" + btnid).show();
                                    state = "on";
                                    break;
                            }

                            SiebelAppFacade.Blacksheep.prototype[modname].call(bs);
                        });
                        //options cogwheel
                        if (typeof (moddef.useroptions) !== "undefined"){

                            //display cogwheel
                            var uo = moddef.useroptions;
                            var btn = bs.GenerateDOMElement("div",{"id":btnid,"class":"blacksheep-useroptions-button","title":bs.GetMsg("TS_UO_BTN_TITLE")});
                            if ($("#" + btnid).length == 0){
                                dummycontainer.append(btn);
                                btn.click(function(){

                                    //var appletid = $(this).attr("id");
                                    //appletid = appletid.substring(8,appletid.length);
                                    //var pm = bs.ValidateContext(appletid);
                                    //show options dialog
                                    bs.ShowOptionsDialog(bs.GetActivePM(),modname);
                                });
                            }
                            if (state == "off"){
                                $("#" + btnid).hide();
                            }
                        }
                    }
                });

            });
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zp = Date.now(); blacksheep_perf_function_call["BuildDialogTSMAIN__" + "()" + "__" + aperf]["End"]=zp;}
            return retval;
        };

        extensions.ShowControlOptionsDialog = function(pm,modname,control,context){
            
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepDialog.prototype.ShowControlOptionsDialog(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["ShowControlOptionsDialog__" + modname + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = false;
            var mcontrols =  SiebelAppFacade.BlacksheepConfig.config.modules[modname].controls;
            var u_opt = bs.GetSavedModuleOptions(pm,modname);
            var moddef = SiebelAppFacade.BlacksheepConfig.config.modules[modname];
            var uo = moddef.useroptions;
            var tcontrols = {};
            var ctrl;
            var appletname;
            var appletid;
            var disp;
            var tdata = new Array();
            tdata[0] = [""];
            var cname = "";
            var i = 1;
            for (u in uo){

                if (uo[u].scope == "Control"){
                    // tdata[i] = new Array();
                    tdata[0].push(bs.GetMsg(uo[u].description));
                    //i++;
                }
            }
            if (control != "all"){
                cname = control.GetName();
                for (co in mcontrols){
                    if (mcontrols[co].obj.GetName() == cname){
                         tcontrols[co] = mcontrols[co];
                    }
                }
            }
            else if (control == "all"){
                tcontrols = mcontrols;
            }
            if (true){
                //no specific control, show all
                for (co in tcontrols){
                    
                    ctrl = tcontrols[co].obj;
                    appletname = co.split("|")[0];
                    cname = ctrl.GetName();
                    var pref = appletname + "|" + cname + "|";
                    disp = ctrl.GetDisplayName();
                    var inp;
                    var curval;
                    var copt = bs.GetSavedModuleOptions(pm,modname,true);
                    if (appletname == pm.GetObjName()){
                        appletid = ctrl.GetApplet().GetPModel().Get("GetFullId");
                        tdata[i] = new Array();
                        tdata[i].push(disp);
                        for (u in uo){
                            if (uo[u].scope == "Control"){

                                curval = copt[pref + u];
                                if (typeof(uo[u].widget) !== "undefined"){

                                    var widget = uo[u].widget[0];
                                    var w_opt = uo[u].widget[1];


                                    switch (widget){

                                        case "slider":
                                            inp = bs.GenerateDOMElement("div",{id:modname + "__" + u + "__" + appletid + "__" + ctrl.GetName(),class:"blacksheep-options-slider"});
                                            w_opt["slide"] =  function(event,ui){

                                                $(this).find("input").val(ui.value);
                                            };

                                            w_opt["value"] = curval;
                                            $(inp).slider(w_opt);

                                            var disp = bs.GenerateDOMElement("input",{class:"blacksheep-options-slider-display",id:modname + "__" + u + "__" + appletid + "__" + ctrl.GetName(),value:w_opt.value});
                                            $(inp).append(disp);
                                            break;
                                        case "lov":
                                            inp = bs.GenerateDOMElement("select",{value:uo[u].value,id:modname + "__" + u + "__" + appletid + "__" + ctrl.GetName(),class:"blacksheep-options-select"});
                                            var lov = bs.GetMsg(w_opt);
                                            for (key in lov){
                                                var temp =  $("<option value='" + key + "'>" + lov[key] + "</option>");
                                                var tval =  curval;
                                                if (key == tval){
                                                    $(temp).attr("selected","selected");
                                                }
                                                $(inp).append(temp);
                                                //$(inp).selectmenu();
                                            }
                                            break;
                                        default :

                                            inp = bs.GenerateDOMElement("input",{value:curval,id:modname + "__" + u + "__" + appletid + "__" + ctrl.GetName(),class:"blacksheep-options-input"});

                                            break;
                                    }
                                }
                                else{

                                    inp = bs.GenerateDOMElement("input",{value:curval,id:modname + "__" + u + "__" + appletid + "__" + ctrl.GetName(),class:"blacksheep-options-input"});

                                }



                                tdata[i].push(inp[0].outerHTML);
                            }
                        }
                        i++;
                        // tdata[1].push("x");
                    }
                }
            }
            else{
                //single control mode
            }
            var container = bs.GenerateDOMElement("div",{class:"blacksheep-copt-container",id:"blacksheep_copt_container"});
            var table = bs.GenerateDOMElement("table",{class:"blacksheep-copt-table"});
            $.each(tdata, function(rowIndex, r) {
                var row = bs.GenerateDOMElement("tr",{id:rowIndex});
                $.each(r, function(colIndex, c) {
                    row.append($("<t"+(rowIndex == 0 ?  "h" : "d")+"/>").wrapInner(c));
                });
                table.append(row);
            });
            container.append(table);
            
            $(container).dialog({
                title: bs.GetMsg("DLG_CONTROL_OPTIONS"),
                //width:650,
                //height:400,
                class: "blacksheep-copt-dialog",
                buttons:[
                    {
                        text: bs.GetMsg("BTN_GET_DEFAULT"),
                        click: function(e) {
                            var modname = "";

                            $(this).find(":input").each(function(idx){

                                var id = $(this).attr("id");
                                modname = id.split("__")[0];
                                var prop = id.split("__")[1];
                                if (prop != "appletstorage"){
                                    var newval = SiebelAppFacade.BlacksheepConfig.config.modules[modname].useroptions[prop].default;
                                    $(this).val(newval);

                                    if ($(this).parent(".ui-slider").length > 0){
                                        $(this).parent(".ui-slider").slider("value",newval.toString());
                                    }
                                }
                            });

                        }
                    },
                    {
                        text: bs.GetMsg("BTN_SAVE"),
                        click: function() {

                            var up = false;
                            var opts = {};
                            var modname = "";
                            var appletid = "";
                            var appletname = "";
                            var ctrl = "";
                            var prop = "";
                            var pm;
                            $(this).find(":input").each(function(idx){

                                var id = $(this).attr("id");
                                modname = id.split("__")[0];
                                prop = id.split("__")[1];
                                appletid = id.split("__")[2];
                                ctrl = id.split("__")[3];
                                if (typeof(pm) === "undefined"){
                                    pm = bs.ValidateContext(appletid);
                                }
                                appletname = pm.GetObjName();
                                var ac = appletname + "|" + ctrl;
                                var newval = $(this).val();
                                if (!isNaN(parseFloat(newval))){
                                    newval = parseFloat(newval);
                                }
                                
                                SiebelAppFacade.BlacksheepConfig.config.modules[modname].controls[ac].useroptions[prop].value = newval;

                                var oname = appletname + "|" + ctrl + "|" + prop;
                                opts[oname] = newval;

                            });


                            var sn = bs.GetMsg("COOKIE_MOD_PRE") + modname + "_" + appletname  + "_CONTROL_OPTIONS";
                            pm = bs.ValidateContext(appletid);
                            debugger;
                            if (control != "all"){
                            var ldata = JSON.parse(localStorage.getItem(sn));
                            if (ldata != null){
                                for (ld in ldata){
                                    var l_in_o = false;
                                    var dval = false;
                                    for (oname in opts){
                                        if (ld == oname){
                                            l_in_o = true;
                                            if (ldata[ld] != opts[oname]) {
                                                dval = true;
                                            }
                                        }
                                    }
                                    if (!l_in_o){
                                       opts[ld] = ldata[ld];
                                    }
                                }
                            }
                            }
                            localStorage.setItem(sn,JSON.stringify(opts));
                            SiebelAppFacade.Blacksheep.prototype[modname].call(bs,pm);
                            $(this).dialog("destroy");

                        }
                    },
                    {
                        text: bs.GetMsg("BTN_CANCEL"),
                        click: function() {
                            $(this).dialog("destroy");
                        }
                    }


                ] ,
                position: (typeof(context) !== "undefined") ? {at:"top left", of:context} : {}

            }).css("overflow","auto");

            $(container).dialog("option","width",$(".blacksheep-copt-table").width() + 100);
            $(container).dialog("option","height",$(".blacksheep-copt-table").height() + 120);



            retval = true;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zp = Date.now(); blacksheep_perf_function_call["ShowControlOptionsDialog__" + modname + "__" + aperf]["End"]=zp;}
            return retval;
        };
        extensions.ShowOptionsDialog = function(pm,modname,context){
            if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepDialog.prototype.ShowOptionsDialog(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["ShowOptionsDialog__" + modname + "__" + aperf]={"Start":aperf,"End":0};}
            var retval = false;
            bs.AddDialogTemplate("MOD_OPTIONS",{
                buttons: [
                    {
                        text: bs.GetMsg("BTN_GET_DEFAULT"),
                        click: function(e) {
                            var modname = "";

                            $(this).find(":input").each(function(idx){

                                var id = $(this).attr("id");
                                modname = id.split("__")[0];
                                var prop = id.split("__")[1];
                                if (prop != "appletstorage"){
                                    var newval = SiebelAppFacade.BlacksheepConfig.config.modules[modname].useroptions[prop].default;
                                    $(this).val(newval);

                                    if ($(this).parent(".ui-slider").length > 0){
                                        $(this).parent(".ui-slider").slider("value",newval.toString());
                                    }
                                }
                            });



                            if (moddef.useroptions.storage_default == "userpref"){
                                $("input[id*='appletstorage']").prop("checked",true);
                            }
                            else{
                                $("input[id*='appletstorage']").prop("checked",false);
                            }
                        }
                    },
                    {
                        text: bs.GetMsg("BTN_SAVE"),
                        click: function(e) {

                            var up = false;
                            var opts = {};
                            var modname = "";
                            var appletid = "";
                            if($(this).find("[id*='appletstorage']").length > 0){
                                up = $(this).find("[id*='appletstorage']")[0].checked;
                            }
                            $(this).find(":input").each(function(idx){

                                var id = $(this).attr("id");
                                modname = id.split("__")[0];
                                var prop = id.split("__")[1];
                                appletid = id.split("__")[2];

                                var newval = $(this).val();
                                if (!isNaN(parseFloat(newval))){
                                    newval = parseFloat(newval);
                                }
                                if (!up && prop != "appletstorage" && prop != "storage_default"){
                                    SiebelAppFacade.BlacksheepConfig.config.modules[modname].useroptions[prop].value = newval;

                                }
                                if (prop != "appletstorage" && prop != "storage_default"){
                                    opts[prop] = newval;
                                }
                            });


                            var propname = bs.GetMsg("PMPROP_MOD_PREFIX") + modname + bs.GetMsg("PMPROP_MOD_OPT");
                            var cookiename = bs.GetMsg("COOKIE_MOD_PRE") + modname + bs.GetMsg("COOKIE_MOD_OPT");
                            var pm = bs.ValidateContext(appletid);
                            if (up){
                                bs.SetUserPref(pm,propname,JSON.stringify(opts));
                            }
                            else{
                                bs.SetUserPref(pm,propname,"");
                                $.cookie(cookiename,JSON.stringify(opts),{expires:999});
                            }

                            SiebelAppFacade.Blacksheep.prototype[modname].call(bs,pm);
                            $(this).dialog("destroy");
                        }
                    },
                    {
                        text: bs.GetMsg("BTN_CANCEL"),
                        click: function(e) {
                            $(this).dialog("destroy");
                        }
                    }
                ],
                position: (typeof(context) !== "undefined") ? {at:"top left", of:context} : {},
                height: "auto",
                minWidth: 300,
                dialogClass: "blacksheep-dialog",
                modal: true,
                title : bs.GetMsg("TS_OPT_TITLE")
            },true);




            var u_opt = bs.GetSavedModuleOptions(pm,modname);

            var moddef = SiebelAppFacade.BlacksheepConfig.config.modules[modname];
            var uo = moddef.useroptions;
            var dlg_cont = bs.GenerateDOMElement("div",{id:"blacksheep_options_dlg"});
            dlg_cont.dialog(SiebelAppFacade.BlacksheepDialog.templates["MOD_OPTIONS"]);
            //$(dlg_cont).dialog("option","title",bs.GetMsg("TS_OPT_TITLE_FOR") + pm.GetObjName());
            for (u in uo){
                var scope = uo[u].scope;
                if (typeof(scope) === "undefined" || scope == "Applet"){
                    var options_html = bs.GenerateDOMElement("p");
                    $(options_html).append("<span>" + bs.GetMsg(uo[u].description) + "</span>");
                    var inp;
                    var appletid = pm.Get("GetFullId");

                    var curval = uo[u].value;

                    if (typeof(u_opt) !== "undefined"){
                        curval = u_opt[u];
                    }

                    if (typeof(uo[u].widget) !== "undefined"){

                        var widget = uo[u].widget[0];
                        var w_opt = uo[u].widget[1];


                        switch (widget){

                            case "slider":
                                inp = bs.GenerateDOMElement("div",{id:modname + "__" + u + "__" + appletid,class:"blacksheep-options-slider"});
                                w_opt["slide"] =  function(event,ui){

                                    $(this).find("input").val(ui.value);
                                };

                                w_opt["value"] = curval;
                                $(inp).slider(w_opt);

                                var disp = bs.GenerateDOMElement("input",{class:"blacksheep-options-slider-display",id:modname + "__" + u + "__" + appletid,value:w_opt.value});
                                $(inp).append(disp);
                                break;
                            case "lov":
                                inp = bs.GenerateDOMElement("select",{value:uo[u].value,id:modname + "__" + u + "__" + appletid,class:"blacksheep-options-select"});
                                var lov = bs.GetMsg(w_opt);
                                for (key in lov){
                                    var temp =  $("<option value='" + key + "'>" + lov[key] + "</option>");
                                    var tval =  curval;
                                    if (key == tval){
                                        $(temp).attr("selected","selected");
                                    }
                                    $(inp).append(temp);
                                    //$(inp).selectmenu();
                                }
                                break;
                            default :

                                inp = bs.GenerateDOMElement("input",{value:curval,id:modname + "__" + u + "__" + appletid,class:"blacksheep-options-input"});

                                break;
                        }
                    }
                    else{

                        inp = bs.GenerateDOMElement("input",{value:curval,id:modname + "__" + u + "__" + appletid,class:"blacksheep-options-input"});

                    }



                    $(options_html).find("span").append(inp);
                    $("#blacksheep_options_dlg").append(options_html);

                }




            }
            //applet-specific storage checkbox
            if ($.inArray("Applet",moddef.scope) > -1){
                inp = bs.GenerateDOMElement("input", {type:"checkbox",id:modname + "__appletstorage" + "__" + appletid,class:"blacksheep-options-cb"});
                var lb = bs.GenerateDOMElement("label", {for:modname + "__appletstorage" + "__" + appletid});
                $(lb).text(bs.GetMsg("TS_DLG_OPT_CB_LABEL_1") + pm.GetObjName() + bs.GetMsg("TS_DLG_OPT_CB_LABEL_2"));

                $(options_html).after(inp);
                $(inp).after(lb);
                if (!$.isEmptyObject(u_opt)){
                    if (u_opt.source == "userpref"){
                        $(inp).attr("checked",true);
                    }
                }

                if (moddef.useroptions.storage_default == "userpref"){
                    $(inp).attr("checked",true);
                }
                var assistant = bs.GetAssistant(bs.GetMsg("TS_DLG_OPT_CB_HELP_1") + pm.GetObjName() + bs.GetMsg("TS_DLG_OPT_CB_HELP_2"));
                $("label[for*='appletstorage']").append(assistant);
            }

            //control button
            if ($.inArray("Control",moddef.scope) > -1){
                inp = bs.GenerateDOMElement("button",{name:"blacksheep-open-control-list-button",class:"blacksheep-open-control-list-button",id:"blacksheep_ocl"});
                inp.text(bs.GetMsg("BTN_CONFIG_CONTROLS"));
                $(options_html).after("<hr>");
                $(options_html).after(inp);
                $(inp).click(function(){
                    bs.ShowControlOptionsDialog(pm,modname,"all");
                });
            }
            //module name display
            $("#blacksheep_options_dlg").prepend("<p class='blacksheep-options-header'>" + bs.GetMsg("TS_OPT_TITLE_FOR") + bs.GetMsg(moddef.label) + "</p>");

            retval = true;
            if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zp = Date.now(); blacksheep_perf_function_call["ShowOptionsDialog__" + modname + "__" + aperf]["End"]=zp;}
            return retval;

        };
        /*
         Function AddDialogTemplate: Adds a dialog definition to the array
         Input: name of the template, config JSON object, override flag
         Output: boolean
         */
        extensions.AddDialogTemplate = function (template_name, config, override){                                        if (bsc.debug == "yes") { var a=Date.now(); var f=" : function BlacksheepDialog.prototype.AddDialogTemplate(" + $.makeArray(JSON.stringify(arguments)).join() + ") : "; console.log(bsd + a + f + "begin"); }if (bsc.perf == "yes"){var aperf = Date.now(); blacksheep_perf_function_call["AddDialogTemplate__" + template_name + "__" + aperf]={"Start":aperf,"End":0};}


            var retval = false;
            if (typeof(SiebelAppFacade.BlacksheepDialog.templates) === "undefined"){
                SiebelAppFacade.BlacksheepDialog.templates = {}
            }
            if (typeof(override) === "undefined"){ override = false;}
            try{
                if (template_name != "" && config){
                    if (override == false){
                        if (!SiebelAppFacade.BlacksheepDialog.templates[template_name]){
                            SiebelAppFacade.BlacksheepDialog.templates[template_name] = config;
                            retval = true;
                        }
                        else{
                            throw("blacksheep.js : AddDialogTemplate() : template definition already exists : " + template_name);
                        }
                    }
                    else{
                        SiebelAppFacade.BlacksheepDialog.templates[template_name] = config;
                        retval = true;
                    }
                }
                else{
                    throw("blacksheep.js : AddDialogTemplate(" + $.makeArray(JSON.stringify(arguments)).join() + ") : invalid input");
                }
            }
            catch(e){
                console.log(e.toString());
            }
            finally{
                if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }if (bsc.perf == "yes") {var zp = Date.now(); blacksheep_perf_function_call["AddDialogTemplate__" + template_name + "__" + aperf]["End"]=zp;}
            }

            return retval;
        };

        /*
         */
        //Do not modify after this line
        //copy extensions container to prototype

        for (var fName in extensions) {
            BlacksheepDialog.prototype[fName] = extensions[fName];
        }
        //make container public
        BlacksheepDialog.prototype.Extensions = extensions;
        //extend core class
        //var bs = new SiebelAppFacade.blacksheep();
        bs.Extender(SiebelAppFacade.Blacksheep,BlacksheepDialog);

        retval = BlacksheepDialog;
        if (bsc.debug == "yes") { var z = Date.now(); console.log(bsd + z + f + "end : time(ms): " + parseInt(z-a) + " : return: " + JSON.stringify(retval)); }
        return retval;
    }();
}
var bs_z=Date.now(); console.log("blacksheep.js : debugger : " + bs_z + " : file " + "blacksheep-dialog.js : loaded : time(ms): " + parseInt(bs_z-bs_a)); blacksheep_perf_file_load["blacksheep-dialog.js"] = parseInt(bs_z-bs_a); bs_z = bs_a = null;