// this code was generated using the rkwarddev package.
// perhaps don't make changes here, but in the rkwarddev script instead!

function preview(){
	
    var model = getValue("diag_model");
    if (model) {
        echo("zph_fit <- survival::cox.zph(" + model + ")\n");
        echo("print(survminer::ggcoxzph(zph_fit))\n");
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
// No object to save
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("CoxDiagnostics results")).print();	
	}
    var model = getValue("diag_model");
    if (model) {
        echo("rk.header(\"Schoenfeld Residuals Test\");\n");
        echo("zph_fit <- survival::cox.zph(" + model + ")\n");
        echo("print(zph_fit)\n");
        echo("rk.graph.on()\n");
        echo("print(survminer::ggcoxzph(zph_fit))\n");
        echo("rk.graph.off()\n");
    }
  

}

