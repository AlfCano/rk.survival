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
  
    var time = getValue("km_time");
    var status = getValue("km_status");
    var strata = getValue("km_strata");
    
    // Options
    var show_risk = (getValue("opt_risk") == "1") ? "TRUE" : "FALSE";
    var show_pval = (getValue("opt_pval") == "1") ? "TRUE" : "FALSE";
    var show_conf = (getValue("opt_conf") == "1") ? "TRUE" : "FALSE";
    var show_cens = (getValue("opt_censor") == "1") ? "TRUE" : "FALSE";
    var pal = getValue("opt_palette");
    var do_print_plot = getValue("opt_print_plot");
    
    // Parse DF
    var pTime = parseVar(time);
    var df = pTime.df;
    
    var cmd_fit = "";
    var cmd_plot = "";
    
    if (df != "") {
        var formula = "survival::Surv(" + pTime.raw_col + ", " + parseVar(status).raw_col + ")";
        if (strata != "") {
            formula += " ~ " + parseVar(strata).raw_col;
        } else {
            formula += " ~ 1";
        }
        
        cmd_fit = "survival::survfit(" + formula + ", data = " + df + ")";
        
        cmd_plot = "survminer::ggsurvplot(km_fit, data = " + df + ", " +
                   "risk.table = " + show_risk + ", " +
                   "pval = " + show_pval + ", " +
                   "conf.int = " + show_conf + ", " +
                   "censor = " + show_cens + ", " +
                   "palette = \"" + pal + "\", " +
                   "ggtheme = ggplot2::theme_bw())";
    }
  
    if (cmd_fit != "") {
        echo("km_fit <- " + cmd_fit + "\n");
        echo("print(" + cmd_plot + ")\n");
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
	}	if(is_preview) {
		echo("if(!base::require(ggplot2)){stop(" + i18n("Preview not available, because package ggplot2 is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(ggplot2)\n");
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
  
    var time = getValue("km_time");
    var status = getValue("km_status");
    var strata = getValue("km_strata");
    
    // Options
    var show_risk = (getValue("opt_risk") == "1") ? "TRUE" : "FALSE";
    var show_pval = (getValue("opt_pval") == "1") ? "TRUE" : "FALSE";
    var show_conf = (getValue("opt_conf") == "1") ? "TRUE" : "FALSE";
    var show_cens = (getValue("opt_censor") == "1") ? "TRUE" : "FALSE";
    var pal = getValue("opt_palette");
    var do_print_plot = getValue("opt_print_plot");
    
    // Parse DF
    var pTime = parseVar(time);
    var df = pTime.df;
    
    var cmd_fit = "";
    var cmd_plot = "";
    
    if (df != "") {
        var formula = "survival::Surv(" + pTime.raw_col + ", " + parseVar(status).raw_col + ")";
        if (strata != "") {
            formula += " ~ " + parseVar(strata).raw_col;
        } else {
            formula += " ~ 1";
        }
        
        cmd_fit = "survival::survfit(" + formula + ", data = " + df + ")";
        
        cmd_plot = "survminer::ggsurvplot(km_fit, data = " + df + ", " +
                   "risk.table = " + show_risk + ", " +
                   "pval = " + show_pval + ", " +
                   "conf.int = " + show_conf + ", " +
                   "censor = " + show_cens + ", " +
                   "palette = \"" + pal + "\", " +
                   "ggtheme = ggplot2::theme_bw())";
    }
  
    if (cmd_fit != "") {
        echo("km_fit <- " + cmd_fit + "\n");
    }
  
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("Kaplan-Meier results")).print();	
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
  
    var time = getValue("km_time");
    var status = getValue("km_status");
    var strata = getValue("km_strata");
    
    // Options
    var show_risk = (getValue("opt_risk") == "1") ? "TRUE" : "FALSE";
    var show_pval = (getValue("opt_pval") == "1") ? "TRUE" : "FALSE";
    var show_conf = (getValue("opt_conf") == "1") ? "TRUE" : "FALSE";
    var show_cens = (getValue("opt_censor") == "1") ? "TRUE" : "FALSE";
    var pal = getValue("opt_palette");
    var do_print_plot = getValue("opt_print_plot");
    
    // Parse DF
    var pTime = parseVar(time);
    var df = pTime.df;
    
    var cmd_fit = "";
    var cmd_plot = "";
    
    if (df != "") {
        var formula = "survival::Surv(" + pTime.raw_col + ", " + parseVar(status).raw_col + ")";
        if (strata != "") {
            formula += " ~ " + parseVar(strata).raw_col;
        } else {
            formula += " ~ 1";
        }
        
        cmd_fit = "survival::survfit(" + formula + ", data = " + df + ")";
        
        cmd_plot = "survminer::ggsurvplot(km_fit, data = " + df + ", " +
                   "risk.table = " + show_risk + ", " +
                   "pval = " + show_pval + ", " +
                   "conf.int = " + show_conf + ", " +
                   "censor = " + show_cens + ", " +
                   "palette = \"" + pal + "\", " +
                   "ggtheme = ggplot2::theme_bw())";
    }
  
    if (cmd_plot != "") {
        echo("rk.header(\"Kaplan-Meier Plot\", level=3);\n");
        echo("rk.header(\"Survival Summary\", level=4);\n");
        echo("print(km_fit)\n");
        
        if (do_print_plot == "1") {
            echo("rk.graph.on()\n");
            echo("print(" + cmd_plot + ")\n");
            echo("rk.graph.off()\n");
        } else {
            echo("print(" + cmd_plot + ")\n");
        }
    }
  
	if(!is_preview) {
		//// save result object
		// read in saveobject variables
		var kmSaveObj = getValue("km_save_obj");
		var kmSaveObjActive = getValue("km_save_obj.active");
		var kmSaveObjParent = getValue("km_save_obj.parent");
		// assign object to chosen environment
		if(kmSaveObjActive) {
			echo(".GlobalEnv$" + kmSaveObj + " <- km_fit\n");
		}	
	}

}

