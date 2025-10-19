# Pricing Page Requirements

Users: loan underwriters who run complex Excel models (formulas only, no VBA) to produce pricing and credit metrics.

Problem: the current process is manual and repetitive — upload/open an Excel file, change inputs, run the sheet, inspect outputs. This prevents automated, repeatable analysis and makes parameter sweeps tedious.

Goal: let users drag-and-drop an Excel workbook into the web app and automatically expose its logic as a microservice (REST API). The UI should let users enter inputs and view outputs instantly, and provide a "pricing grid" to evaluate outputs over multiple input combinations.

## Requirements

- Input format

  - Accept Excel workbooks (.xlsx) that contain only cell formulas (no macros).
  - Identify input cells (annotated or inferred) and output cells to expose via the API/UI.

- Conversion

  - Translate the workbook’s formula logic into a reproducible computation service (stateless microservice with a documented REST API).
  - Preserve numeric precision and formula semantics.

- UI

  - Simple input form for single-run evaluations.
  - Interactive pricing grid: define ranges or lists for multiple inputs and compute outputs across combinations (cartesian product or configurable sampling).
  - Display results in a tabular/grid view with export (CSV/XLSX) and basic visualizations.

- Automation & Batch

  - Support bulk evaluation of many scenarios with job status tracking and result retrieval.

- Validation & Safety

  - Validate uploaded workbooks for unsupported features (VBA, external links, volatile functions) and report issues.
  - Input validation, type checks, and clear error reporting for invalid scenarios.

- Versioning & Traceability

  - Store versions of uploaded models and track provenance of each API endpoint and grid run.
  - If the new version has identical formulas as the old version, do not create a new version, and warn user about duplicate upload.

- Security & Privacy

  - Isolate execution (sandboxing) to prevent arbitrary code execution and protect tenant data.
  - Encrypt stored files and restrict access to authorized users.

- Non‑functional
  - Low-latency single-run responses; scalable batch processing for pricing grids.
  - Deterministic results under identical inputs and model versions.

## Success criteria

- The workbook is converted to a REST endpoint seemlessly without the user's explicit action or knowledge.
- Single-run latency and grid throughput meet target SLAs.
- Pricing grid enables efficient exploration of multi-input scenarios and exports results for downstream use.
- Clear validation and error messages reduce failed conversions or runs.
- Model versions and run logs provide reproducibility and auditability.

## Q&A

### Question 1

I’m new to private credit. What are the common underwriting and pricing workflows? Are the input and output parameters typically standardized, or do they vary by deal and model?

### Answer 1

Private credit underwriting follows a fairly repeatable flow, but each deal’s specifics (industry, structure, collateral) drive meaningful model variation.

Typical workflow

- Sourcing & screening: preliminary data, quick metrics (EBITDA, leverage, liquidity) to assess fit with mandate and risk appetite.
- Diligence & modeling: collect historical financials (P&L, BS, CF), management case, QoE, customer/supplier concentration, legal/structural terms. Build or adapt a cash flow model with base/downside cases and covenant headroom.
- Structure & terms: size the facility, choose tranche mix (senior/unitranche/2L/Mezz), set tenor, amortization, call protection, covenants, collateral package, intercreditor.
- Pricing: determine all‑in yield from base rate (e.g., SOFR) + spread + floors + OID + fees + PIK, adjusted for prepayment, amortization, and expected life; benchmark comps and internal risk grades.
- IC/approval & documentation: finalize credit memo, risk rating, conditions precedent, and monitoring plan.

Common/standardized inputs (usually present across models)

- Company and transaction: business description, sponsor strength, use of proceeds, purchase price, equity contribution.
- Historicals & KPIs: 24–36 months of financials; LTM EBITDA; cash conversion; working capital; capex; customer concentration. For software/recurring revenue: ARR, NRR, churn, gross margin, burn, runway.
- Capital structure & terms: leverage targets, security/collateral, tranches, base rate curve, spread, floors, OID, fees, tenor, amortization, call schedule, revolver assumptions.
- Policy/risk parameters: rating model factors, loss‑given‑default, recovery on collateral, covenant frameworks (max leverage, min interest/fixed‑charge coverage, liquidity).

Deal‑specific/variable inputs (drive model idiosyncrasies)

- Forecast drivers: revenue growth, pricing/mix, margin expansion, synergies, cost saves, M&A add‑ons, one‑offs, capex cadence, working capital turns.
- Collateral/asset nuances: borrowing base (ABL), eligibility haircuts, advance rates; specialty finance pools (defaults, prepayments, loss curves).
- Structure features: cash vs PIK toggles, payment holidays, cash sweeps, springing covenants, delayed‑draw schedules, MFN protections.
- Sector‑specific KPIs: unit economics (CAC payback, LTV/CAC), project milestones, commodity sensitivities, regulatory constraints.

Common/standardized outputs (what credit committees expect)

- Leverage and coverage: Net Debt/EBITDA, Interest Coverage, Fixed‑Charge Coverage, DSCR, minimum liquidity.
- Cash flow & headroom: free cash flow after interest/capex, covenant headroom by quarter, liquidity runway, breakeven analysis.
- Returns & pricing: all‑in yield (cash and accrual), IRR to lender including OID/fees/call, fee economics, expected life.
- Risk view: internal risk rating, probability of default / expected loss proxy, recovery sensitivity, collateral coverage/LTV.
- Sensitivities: downside and severe downside outcomes, key driver tornado/sweep outputs.

How standardized is it?

- There is a strong “skeleton” of standardized inputs/outputs imposed by credit policy and IC templates, but each deal’s model varies in drivers, schedules, and sector/structure detail. Expect 60–70% shared anatomy and 30–40% deal‑specific logic.

Implications for this app

- Input detection: support a canonical schema (financials, capital structure, terms, covenants) but allow custom named ranges/labels for deal‑specific drivers.
- Output mapping: normalize core metrics (leverage, coverage, yield, liquidity) for the API/UI while preserving additional model‑specific outputs.
- Pricing grid axes: commonly swept across leverage, spread, base‑rate floors, OID, amortization, EBITDA haircuts, growth/margin sensitivities, and prepayment timing.
- Validation: flag volatile Excel functions and ambiguous ranges; enforce units (%, bps, months, currency) to maintain determinism and precision.
