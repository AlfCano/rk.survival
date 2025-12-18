// this code was generated using the rkwarddev package.
// perhaps don't make changes here, but in the rkwarddev script instead!

function preview(){
	
    function parseVar(fullPath) {
        if (!fullPath) return {df: '', col: '', raw_col: ''};
        
        var df = '';
        var raw_col = '';
        
        if (fullPath.indexOf('[[') > -1) {
            var parts = fullPath.split('[[');
            df = parts[0];
            var inner = parts[1].replace(']]', '');
            raw_col = inner.replace(/["']/g, ''); 
        } else if (fullPath.indexOf('$') > -1) {
            var parts = fullPath.split('$');
            df = parts[0];
            raw_col = parts[1];
        } else {
            raw_col = fullPath;
        }
        return { df: df, raw_col: raw_col };
    }
  
    var time = getValue("cox_time");
    var status = getValue("cox_status");
    var covars = getValue("cox_covars");
    var do_forest = getValue("cox_forest_chk");
    
    var pTime = parseVar(time);
    var df = pTime.df;
    
    var cmd_model = "";
    
    if (df != "" && covars != "") {
        var varList = covars.split("\n");
        var colList = [];
        for (var i = 0; i < varList.length; i++) {
            colList.push(parseVar(varList[i]).raw_col);
        }
        var formula = "survival::Surv(" + pTime.raw_col + ", " + parseVar(status).raw_col + ") ~ " + colList.join(" + ");
        cmd_model = "survival::coxph(" + formula + ", data = " + df + ")";
    }
  
    if (cmd_model != "") {
        echo("cox_model <- " + cmd_model + "\n");
        if (do_forest == "1") {
             echo("print(survminer::ggforest(cox_model, data = " + df + "))\n");
        } else {
             // Fallback if plot is disabled, to avoid confusion in plot-mode preview
             echo("plot(0, type='n', axes=FALSE, xlab='', ylab='')\n");
             echo("text(1, 1, \"Check 'Generate Forest Plot' to view graph.\")\n");
        }
    }
  
}

function preprocess(is_preview){
	// add requirements etc. here
	if(is_preview) {
		echo("if(!base::require(survival)){stop(" + i18n("Preview not available, because package survival is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(survival)\n");
	}	if(is_preview) {
		echo("if(!base::require(survminer)){stop(" + i18n("Preview not available, because package survminer is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(survminer)\n");
	}
}

function calculate(is_preview){
	// read in variables from dialog


	// the R code to be evaluated

    function parseVar(fullPath) {
        if (!fullPath) return {df: '', col: '', raw_col: ''};
        
        var df = '';
        var raw_col = '';
        
        if (fullPath.indexOf('[[') > -1) {
            var parts = fullPath.split('[[');
            df = parts[0];
            var inner = parts[1].replace(']]', '');
            raw_col = inner.replace(/["']/g, ''); 
        } else if (fullPath.indexOf('$') > -1) {
            var parts = fullPath.split('$');
            df = parts[0];
            raw_col = parts[1];
        } else {
            raw_col = fullPath;
        }
        return { df: df, raw_col: raw_col };
    }
  
    var time = getValue("cox_time");
    var status = getValue("cox_status");
    var covars = getValue("cox_covars");
    var do_forest = getValue("cox_forest_chk");
    
    var pTime = parseVar(time);
    var df = pTime.df;
    
    var cmd_model = "";
    
    if (df != "" && covars != "") {
        var varList = covars.split("\n");
        var colList = [];
        for (var i = 0; i < varList.length; i++) {
            colList.push(parseVar(varList[i]).raw_col);
        }
        var formula = "survival::Surv(" + pTime.raw_col + ", " + parseVar(status).raw_col + ") ~ " + colList.join(" + ");
        cmd_model = "survival::coxph(" + formula + ", data = " + df + ")";
    }
  
    if (cmd_model != "") {
        echo("cox_model <- " + cmd_model + "\n");
    }
  
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("CoxPH results")).print();	
	}
    function parseVar(fullPath) {
        if (!fullPath) return {df: '', col: '', raw_col: ''};
        
        var df = '';
        var raw_col = '';
        
        if (fullPath.indexOf('[[') > -1) {
            var parts = fullPath.split('[[');
            df = parts[0];
            var inner = parts[1].replace(']]', '');
            raw_col = inner.replace(/["']/g, ''); 
        } else if (fullPath.indexOf('$') > -1) {
            var parts = fullPath.split('$');
            df = parts[0];
            raw_col = parts[1];
        } else {
            raw_col = fullPath;
        }
        return { df: df, raw_col: raw_col };
    }
  
    var time = getValue("cox_time");
    var status = getValue("cox_status");
    var covars = getValue("cox_covars");
    var do_forest = getValue("cox_forest_chk");
    
    var pTime = parseVar(time);
    var df = pTime.df;
    
    var cmd_model = "";
    
    if (df != "" && covars != "") {
        var varList = covars.split("\n");
        var colList = [];
        for (var i = 0; i < varList.length; i++) {
            colList.push(parseVar(varList[i]).raw_col);
        }
        var formula = "survival::Surv(" + pTime.raw_col + ", " + parseVar(status).raw_col + ") ~ " + colList.join(" + ");
        cmd_model = "survival::coxph(" + formula + ", data = " + df + ")";
    }
  
    if (cmd_model != "") {
        echo("rk.header(\"Cox Proportional Hazards Model\", level=3);\n");
        echo("summary(cox_model)\n");
        
        if (do_forest == "1") {
             echo("rk.graph.on()\n");
             echo("print(survminer::ggforest(cox_model, data = " + df + "))\n");
             echo("rk.graph.off()\n");
        }
    }
  
	if(!is_preview) {
		//// save result object
		// read in saveobject variables
		var coxSaveObj = getValue("cox_save_obj");
		var coxSaveObjActive = getValue("cox_save_obj.active");
		var coxSaveObjParent = getValue("cox_save_obj.parent");
		// assign object to chosen environment
		if(coxSaveObjActive) {
			echo(".GlobalEnv$" + coxSaveObj + " <- cox_model\n");
		}	
	}

}

