local({
  # =========================================================================================
  # 1. Package Definition and Metadata
  # =========================================================================================
  require(rkwarddev)
  rkwarddev.required("0.10-3")

  package_about <- rk.XML.about(
    name = "rk.survival",
    author = person(
      given = "Alfonso",
      family = "Cano",
      email = "alfonso.cano@correo.buap.mx",
      role = c("aut", "cre")
    ),
    about = list(
      desc = "An RKWard plugin for modern survival analysis and visualization using 'survival' and 'survminer'.",
      version = "0.0.1", # FROZEN
      url = "https://github.com/AlfCano/rk.survival",
      license = "GPL (>= 3)"
    )
  )

  common_hierarchy <- list("analysis", "Survival Analysis (survminer)")

  # =========================================================================================
  # 2. JS Helper
  # =========================================================================================
  js_parse_helper <- "
    function parseVar(fullPath) {
        if (!fullPath) return {df: '', col: '', raw_col: ''};

        var df = '';
        var raw_col = '';

        if (fullPath.indexOf('[[') > -1) {
            var parts = fullPath.split('[[');
            df = parts[0];
            var inner = parts[1].replace(']]', '');
            raw_col = inner.replace(/[\"']/g, '');
        } else if (fullPath.indexOf('$') > -1) {
            var parts = fullPath.split('$');
            df = parts[0];
            raw_col = parts[1];
        } else {
            raw_col = fullPath;
        }
        return { df: df, raw_col: raw_col };
    }
  "

  # =========================================================================================
  # COMPONENT 1: Kaplan-Meier (Fit & Plot)
  # =========================================================================================

  help_km <- rk.rkh.doc(
    title = rk.rkh.title(text = "Kaplan-Meier Estimate & Plot"),
    summary = rk.rkh.summary(text = "Fits a survival curve using the Kaplan-Meier method and generates a publication-ready plot using 'ggsurvplot'."),
    usage = rk.rkh.usage(text = "Select Time and Status variables. Optionally select a Grouping variable (Strata).")
  )

  km_selector <- rk.XML.varselector(id.name = "km_selector")

  # Data Inputs
  km_time <- rk.XML.varslot(label = "Time Variable (Numeric)", source = "km_selector", classes = "numeric", required = TRUE, id.name = "km_time")
  km_status <- rk.XML.varslot(label = "Status Variable (0=Censored, 1=Event)", source = "km_selector", required = TRUE, id.name = "km_status")
  km_strata <- rk.XML.varslot(label = "Grouping Variable (Strata, Optional)", source = "km_selector", id.name = "km_strata")

  # Plot Options
  km_opts <- rk.XML.col(
      rk.XML.cbox(label = "Show Risk Table", value = "1", chk = TRUE, id.name = "opt_risk"),
      rk.XML.cbox(label = "Show P-Value", value = "1", chk = TRUE, id.name = "opt_pval"),
      rk.XML.cbox(label = "Show Confidence Intervals", value = "1", chk = TRUE, id.name = "opt_conf"),
      rk.XML.cbox(label = "Show Censoring Marks", value = "1", chk = TRUE, id.name = "opt_censor"),
      rk.XML.dropdown(label = "Color Palette", options = list(
          "Dark2" = list(val="Dark2", chk=TRUE), "Set1" = list(val="Set1"),
          "JCO" = list(val="jco"), "Lancet" = list(val="lancet"), "Grey" = list(val="grey")
      ), id.name = "opt_palette"),
      rk.XML.stretch(),
      rk.XML.cbox(label = "Print Plot to Output Window", value = "1", chk = TRUE, id.name = "opt_print_plot")
  )

  km_save <- rk.XML.saveobj(label = "Save 'survfit' object as", chk = TRUE, initial = "km_fit", id.name = "km_save_obj")
  km_preview <- rk.XML.preview(mode = "plot")

  dialog_km <- rk.XML.dialog(
    label = "Kaplan-Meier Analysis",
    child = rk.XML.row(
        km_selector,
        rk.XML.col(
            rk.XML.frame(km_time, km_status, km_strata, label = "Data"),
            rk.XML.frame(km_opts, label = "Plot Options"),
            km_save,
            km_preview
        )
    )
  )

  js_body_km <- paste0(js_parse_helper, '
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
                   "palette = \\\"" + pal + "\\\", " +
                   "ggtheme = ggplot2::theme_bw())";
    }
  ')

  js_calc_km <- paste0(js_body_km, '
    if (cmd_fit != "") {
        echo("km_fit <- " + cmd_fit + "\\n");
    }
  ')

  js_print_km <- paste0(js_body_km, '
    if (cmd_plot != "") {
        echo("rk.header(\\"Kaplan-Meier Plot\\", level=3);\\n");
        echo("rk.header(\\"Survival Summary\\", level=4);\\n");
        echo("print(km_fit)\\n");

        if (do_print_plot == "1") {
            echo("rk.graph.on()\\n");
            echo("print(" + cmd_plot + ")\\n");
            echo("rk.graph.off()\\n");
        } else {
            echo("print(" + cmd_plot + ")\\n");
        }
    }
  ')

  js_preview_km <- paste0(js_body_km, '
    if (cmd_fit != "") {
        echo("km_fit <- " + cmd_fit + "\\n");
        echo("print(" + cmd_plot + ")\\n");
    }
  ')

  component_km <- rk.plugin.component(
    "KaplanMeier",
    xml = list(dialog = dialog_km),
    js = list(require=c("survival", "survminer", "ggplot2"), calculate = js_calc_km, preview = js_preview_km, printout = js_print_km),
    hierarchy = common_hierarchy,
    rkh = list(help = help_km)
  )

  # =========================================================================================
  # COMPONENT 2: Cox Proportional Hazards (CoxPH)
  # =========================================================================================

  help_cox <- rk.rkh.doc(
    title = rk.rkh.title(text = "Cox Proportional Hazards"),
    summary = rk.rkh.summary(text = "Fit a CoxPH model and generate a Forest Plot of hazard ratios."),
    usage = rk.rkh.usage(text = "Select Time, Status, and one or more Covariates.")
  )

  cox_selector <- rk.XML.varselector(id.name = "cox_selector")

  cox_time <- rk.XML.varslot(label = "Time Variable", source = "cox_selector", required = TRUE, id.name = "cox_time")
  cox_status <- rk.XML.varslot(label = "Status Variable", source = "cox_selector", required = TRUE, id.name = "cox_status")
  cox_covars <- rk.XML.varslot(label = "Covariates (Predictors)", source = "cox_selector", multi = TRUE, required = TRUE, id.name = "cox_covars")

  cox_forest <- rk.XML.cbox(label = "Generate Forest Plot (ggforest)", value = "1", chk = TRUE, id.name = "cox_forest_chk")

  cox_save <- rk.XML.saveobj(label = "Save Model as", chk = TRUE, initial = "cox_model", id.name = "cox_save_obj")

  # CHANGED: Mode set to "plot" to ensure the graph is visible
  cox_preview <- rk.XML.preview(mode = "plot")

  dialog_cox <- rk.XML.dialog(
    label = "Cox Proportional Hazards",
    child = rk.XML.row(
        cox_selector,
        rk.XML.col(
            rk.XML.frame(cox_time, cox_status, label = "Survival Object"),
            cox_covars,
            cox_forest,
            cox_save,
            cox_preview
        )
    )
  )

  js_body_cox <- paste0(js_parse_helper, '
    var time = getValue("cox_time");
    var status = getValue("cox_status");
    var covars = getValue("cox_covars");
    var do_forest = getValue("cox_forest_chk");

    var pTime = parseVar(time);
    var df = pTime.df;

    var cmd_model = "";

    if (df != "" && covars != "") {
        var varList = covars.split("\\n");
        var colList = [];
        for (var i = 0; i < varList.length; i++) {
            colList.push(parseVar(varList[i]).raw_col);
        }
        var formula = "survival::Surv(" + pTime.raw_col + ", " + parseVar(status).raw_col + ") ~ " + colList.join(" + ");
        cmd_model = "survival::coxph(" + formula + ", data = " + df + ")";
    }
  ')

  js_calc_cox <- paste0(js_body_cox, '
    if (cmd_model != "") {
        echo("cox_model <- " + cmd_model + "\\n");
    }
  ')

  js_print_cox <- paste0(js_body_cox, '
    if (cmd_model != "") {
        echo("rk.header(\\"Cox Proportional Hazards Model\\", level=3);\\n");
        echo("summary(cox_model)\\n");

        if (do_forest == "1") {
             echo("rk.graph.on()\\n");
             echo("print(survminer::ggforest(cox_model, data = " + df + "))\\n");
             echo("rk.graph.off()\\n");
        }
    }
  ')

  # FIXED: Now prints the plot inside the preview block
  js_preview_cox <- paste0(js_body_cox, '
    if (cmd_model != "") {
        echo("cox_model <- " + cmd_model + "\\n");
        if (do_forest == "1") {
             echo("print(survminer::ggforest(cox_model, data = " + df + "))\\n");
        } else {
             // Fallback if plot is disabled, to avoid confusion in plot-mode preview
             echo("plot(0, type=\'n\', axes=FALSE, xlab=\'\', ylab=\'\')\\n");
             echo("text(1, 1, \\"Check \'Generate Forest Plot\' to view graph.\\")\\n");
        }
    }
  ')

  component_cox <- rk.plugin.component(
    "CoxPH",
    xml = list(dialog = dialog_cox),
    js = list(require=c("survival", "survminer"), calculate = js_calc_cox, preview = js_preview_cox, printout = js_print_cox),
    hierarchy = common_hierarchy,
    rkh = list(help = help_cox)
  )

  # =========================================================================================
  # COMPONENT 3: Diagnostics (Schoenfeld)
  # =========================================================================================

  help_diag <- rk.rkh.doc(
    title = rk.rkh.title(text = "Cox Diagnostics"),
    summary = rk.rkh.summary(text = "Check the Proportional Hazards assumption using Schoenfeld residuals."),
    usage = rk.rkh.usage(text = "Select a fitted 'coxph' object from your workspace.")
  )

  diag_selector <- rk.XML.varselector(id.name = "diag_selector")
  diag_model <- rk.XML.varslot(label = "Select Cox Model", source = "diag_selector", classes = "coxph", required = TRUE, id.name = "diag_model")
  diag_preview <- rk.XML.preview(mode = "plot")

  dialog_diag <- rk.XML.dialog(
    label = "Cox Diagnostics (Schoenfeld)",
    child = rk.XML.row(
        diag_selector,
        rk.XML.col(diag_model, diag_preview)
    )
  )

  js_calc_diag <- '// No object to save'

  js_print_diag <- '
    var model = getValue("diag_model");
    if (model) {
        echo("rk.header(\\"Schoenfeld Residuals Test\\");\\n");
        echo("zph_fit <- survival::cox.zph(" + model + ")\\n");
        echo("print(zph_fit)\\n");
        echo("rk.graph.on()\\n");
        echo("print(survminer::ggcoxzph(zph_fit))\\n");
        echo("rk.graph.off()\\n");
    }
  '

  js_preview_diag <- '
    var model = getValue("diag_model");
    if (model) {
        echo("zph_fit <- survival::cox.zph(" + model + ")\\n");
        echo("print(survminer::ggcoxzph(zph_fit))\\n");
    }
  '

  component_diag <- rk.plugin.component(
    "CoxDiagnostics",
    xml = list(dialog = dialog_diag),
    js = list(require=c("survival", "survminer"), calculate = js_calc_diag, preview = js_preview_diag, printout = js_print_diag),
    hierarchy = common_hierarchy,
    rkh = list(help = help_diag)
  )

  # =========================================================================================
  # BUILD SKELETON
  # =========================================================================================

  rk.plugin.skeleton(
    about = package_about,
    path = ".",
    xml = list(dialog = dialog_km),
    js = list(
        require = c("survival", "survminer", "ggplot2"),
        calculate = js_calc_km,
        printout = js_print_km,
        preview = js_preview_km
    ),
    rkh = list(help = help_km),
    components = list(
        component_cox,
        component_diag
    ),
    pluginmap = list(
        name = "Kaplan-Meier",
        hierarchy = common_hierarchy
    ),
    create = c("pmap", "xml", "js", "desc", "rkh"),
    load = TRUE,
    overwrite = TRUE,
    show = FALSE
  )

  cat("\nPlugin package 'rk.survival' (v0.0.1) generated successfully.\n")
  cat("  1. rk.updatePluginMessages(path=\".\")\n")
  cat("  2. devtools::install(\".\")\n")
})
