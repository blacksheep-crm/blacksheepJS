//Regenerate using:http://fiddle.jshell.net/dford/9otwfb6w/show/?object=MVG&name=BlacksheepAutoComplete&comments=No&logging=Yes&I=Y&SU=Y&BD=Y&BE=Y&GV=Y&SV=Y&BQ=Y&EQ=Y&OP=Y&CP=Y&HK=Y&SS=Y&EL=Y&IQ=Y
/*
Example file to demonstrate calling a module from a plug-in wrapper
Enables blacksheep AutoComplete in Business Service Simulator view, incl. MVGs
 */

if (typeof (SiebelAppFacade.BlacksheepAutoCompletePW) === "undefined") {
    var bs = new SiebelAppFacade.Blacksheep();
    SiebelJS.Namespace("SiebelAppFacade.BlacksheepAutoCompletePW");
    define("siebel/custom/BlacksheepAutoCompletePW", [],
        function () {
            SiebelAppFacade.BlacksheepAutoCompletePW = (function () {

                function BlacksheepAutoCompletePW(pm) {
                    SiebelAppFacade.BlacksheepAutoCompletePW.superclass.constructor.apply(this, arguments);
                }


                SiebelJS.Extend(BlacksheepAutoCompletePW, SiebelAppFacade.FieldPW);

                BlacksheepAutoCompletePW.prototype.ShowUI = function () {
                    //SiebelJS.Log("BlacksheepAutoCompletePW:      ShowUI method reached.");
                    SiebelAppFacade.BlacksheepAutoCompletePW.superclass.ShowUI.apply(this, arguments);

                    var pm = this.control.GetApplet().GetPModel();

                    var pwEl = this.GetEl(); //get DOM element for current control
                    if (pwEl && pwEl.length) {
                        
                        //bs.AutoScan(pm);
                        if (this.control.GetUIType() != consts.get("SWE_CTRL_TEXT")){
                            bs.AddAutoComplete(pm,this.control,[]);
                        }
                        else{
                            //bs.AutoScan(pm);
                            var lov = new Array();
                            if (this.control.GetApplet().GetName() == "PropertySetExProperty Mvg Applet") {
                                var fn = this.control.GetFieldName();
                                if (fn == "Key"){
                                    //lov = ["Test 1","Test 2"];
                                    var topPM = bs.ValidateContext("Business Service Test List Applet");
                                    var rs = topPM.Get("GetRecordSet");
                                    var index = topPM.Get("GetSelection");
                                    var bsname = rs[0]["Service Name"];
                                    var mname = rs[0]["Method Name"];
                                    var data = bs.DataRetriever("Repository Details","Repository Business Service Method Arg","[Parent Name]='" + mname + "' AND [GParent Name]='" + bsname + "' AND [Repository Id]='" + bs.GetRepositoryId() + "' AND [Type]='Input' AND [Inactive]<>'Y'","Name",{"Name":""},{"viewmode":3,log:false});
                                    
                                    for (i = 0; i < data.GetChildCount(); i++){
                                       lov.push(data.GetChild(i).GetProperty("Name"));
                                    }
                                    bs.AddAutoComplete(pm,this.control,lov);
                                }
                            }
                            //bs.AddAutoComplete(pm,this.control,["Hello","World","Siebel","Test"]);
                            //pwEl.autocomplete({source:["Hello","World","Siebel","Test"]});
                        }
                    }
                }


                return BlacksheepAutoCompletePW;
            }()
                );




            SiebelApp.S_App.PluginBuilder.AttachPW(consts.get("SWE_CTRL_MVG"), SiebelAppFacade.BlacksheepAutoCompletePW, function (control, objName) {
                var retval = false;

                var bs = new SiebelAppFacade.Blacksheep();
                var modname = blacksheepAutocompleteModule;
                var wl = bs.GetWhiteList(modname);
                var pm = control.GetApplet().GetPModel();
                var is_whitelisted = bs.ProcessWhiteList(wl,pm);
                
                var propname = bs.GetMsg("PMPROP_MOD_PREFIX") + modname;  //the prefix of the user preference name
                var propuser = bs.GetMsg("PMPROP_MOD_USER"); //the 'user' suffix
                var is_user_enabled = bs.GetUserPref(pm,propname + propuser) == "true" ? true : false;

                if (is_whitelisted && is_user_enabled && bs.GetAppletType(control.GetApplet()) == bs.GetMsg("TYPE_LIST")){
                    retval = true;
                }
                return retval;
            });

            SiebelApp.S_App.PluginBuilder.AttachPW(consts.get("SWE_CTRL_PICK"), SiebelAppFacade.BlacksheepAutoCompletePW, function (control, objName) {
                var retval = false;

                var bs = new SiebelAppFacade.Blacksheep();
                var modname = blacksheepAutocompleteModule;
                var wl = bs.GetWhiteList(modname);
                var pm = control.GetApplet().GetPModel();
                var is_whitelisted = bs.ProcessWhiteList(wl,pm);
                
                var propname = bs.GetMsg("PMPROP_MOD_PREFIX") + modname;  //the prefix of the user preference name
                var propuser = bs.GetMsg("PMPROP_MOD_USER"); //the 'user' suffix
                var is_user_enabled = bs.GetUserPref(pm,propname + propuser) == "true" ? true : false;

                if (is_whitelisted && is_user_enabled && bs.GetAppletType(control.GetApplet()) == bs.GetMsg("TYPE_LIST")){
                    retval = true;
                }
                return retval;
            });

            SiebelApp.S_App.PluginBuilder.AttachPW(consts.get("SWE_CTRL_TEXT"), SiebelAppFacade.BlacksheepAutoCompletePW, function (control, objName) {
                var retval = false;

                var bs = new SiebelAppFacade.Blacksheep();
                var modname = blacksheepAutocompleteModule;
                var wl = bs.GetWhiteList(modname);
                var pm = control.GetApplet().GetPModel();
                var is_whitelisted = bs.ProcessWhiteList(wl,pm);
                
                var propname = bs.GetMsg("PMPROP_MOD_PREFIX") + modname;  //the prefix of the user preference name
                var propuser = bs.GetMsg("PMPROP_MOD_USER"); //the 'user' suffix
                var is_user_enabled = (bs.GetUserPref(pm,propname + propuser) == "true" || typeof(bs.GetUserPref(pm,propname + propuser)) === "undefined") ? true : false;

                if (is_whitelisted && is_user_enabled && bs.GetAppletType(control.GetApplet()) == bs.GetMsg("TYPE_LIST")){
                    retval = true;
                }
                if (objName != "PropertySetExProperty Mvg Applet"){
                    retval = false;
                }
                return retval;
            });

            return "SiebelAppFacade.BlacksheepAutoCompletePW";
        })
}
