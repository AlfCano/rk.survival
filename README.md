# rk.survival: Modern Survival Analysis for RKWard

![Version](https://img.shields.io/badge/Version-0.0.1-blue.svg)
![License](https://img.shields.io/badge/License-GPL--3-green.svg)
![R Version](https://img.shields.io/badge/R-%3E%3D%203.0.0-lightgrey.svg)

**rk.survival** upgrades the survival analysis capabilities of RKWard by integrating the powerful **[`survival`](https://github.com/therneau/survival)** and **[`survminer`](https://rpkgs.datanovia.com/survminer/)** packages. It allows users to perform rigorous survival analysis and generate publication-quality, `ggplot2`-based visualizations (Kaplan-Meier curves, Forest plots, and Diagnostic plots) via a simple GUI.

## Features

This package installs a new submenu in RKWard: **Analysis > Survival Analysis (survminer)**.

*   **Kaplan-Meier Analysis:**
    *   Fit survival curves (`survfit`) and plot them instantly (`ggsurvplot`).
    *   **Visuals:** Add Risk Tables, P-Values (Log-Rank), Confidence Intervals, and Censoring marks with a click.
    *   **Themes:** Support for scientific journals (JCO, Lancet, etc.).

*   **Cox Proportional Hazards:**
    *   Fit multivariate Cox models (`coxph`).
    *   **Forest Plot:** Automatically generate a `ggforest` plot to visualize Hazard Ratios.

*   **Cox Diagnostics:**
    *   Test the Proportional Hazards assumption using Schoenfeld residuals (`cox.zph`).
    *   **Visuals:** Plot residuals to identify time-varying effects.

## Requirements

1.  A working installation of **RKWard**.
2.  The following R packages:
    ```R
    install.packages(c("survival", "survminer", "ggplot2"))
    ```
3.  The R package **`devtools`** (for installation from source).

## Installation

1.  Open R in RKWard.
2.  Run the following commands in the R console:

```R
local({
## Preparar
require(devtools)
## Computar
  install_github(
    repo="AlfCano/rk.survival"
  )
## Imprimir el resultado
rk.header ("Resultados de Instalar desde git")
})
```
3.  Restart RKWard to ensure the new menu items appear correctly.

## Usage & Examples

To test these plugins, we will use the standard `lung` cancer dataset included in R.

### Step 0: Prepare Data
Run this code in the RKWard console to load the data and label the factors (so the plots look nice):

```R
library(survival)
data(lung)

# Convert 'sex' from 1/2 to Male/Female labels
lung$sex <- factor(lung$sex, levels = c(1, 2), labels = c("Male", "Female"))
```

### Example 1: Kaplan-Meier Curve
Compare survival rates between Men and Women.

1.  Navigate to **Analysis > Survival Analysis (survminer) > Kaplan-Meier Analysis**.
2.  **Time Variable:** Select `time`.
3.  **Status Variable:** Select `status`.
4.  **Grouping Variable (Strata):** Select `sex`.
5.  **Options:** Check **"Show Risk Table"** and **"Show P-Value"**.
6.  Click **Submit**.
    *   *Result:* A professional survival curve showing that Females have a significantly better survival probability (p < 0.01), with a table of "Number at risk" below the x-axis.

### Example 2: Cox Proportional Hazards
Analyze the effect of Age, Sex, and Performance Score on survival.

1.  Navigate to **Analysis > Survival Analysis (survminer) > Cox Proportional Hazards**.
2.  **Time Variable:** Select `time`.
3.  **Status Variable:** Select `status`.
4.  **Covariates:** Select `age`, `sex`, and `ph.ecog` (ECOG performance score).
5.  **Options:** Ensure **"Generate Forest Plot"** is checked.
6.  **Save Model as:** `cox_model`.
7.  Click **Submit**.
    *   *Result:* 
        *   **Text:** A summary table of coefficients.
        *   **Graph:** A Forest Plot showing Hazard Ratios. Note that `sexFemale` is to the left of the line (HR < 1), indicating a protective effect.

### Example 3: Model Diagnostics
Check if the "Proportional Hazards" assumption holds true for our model.

1.  Navigate to **Analysis > Survival Analysis (survminer) > Cox Diagnostics**.
2.  **Select Cox Model:** Choose the `cox_model` created in the previous step.
3.  Click **Submit**.
    *   *Result:* Three plots (one for each variable: age, sex, ph.ecog). If the red trend line is roughly horizontal, the assumption holds. If it slopes significantly, the effect of that variable changes over time.

## Author

**Alfonso Cano Robles**
*   Email: alfonso.cano@correo.buap.mx

Assisted by Gemini, a large language model from Google.
