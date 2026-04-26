# Architecture, methodology, and what to change

A retrospective on the Illinois AI Legislative Ecosystem Map — what's strong, what's weak, and what would change with another iteration.

## TL;DR

The site does one thing well — gives a busy reader a coherent, auditable view of Illinois AI policy at a specific moment in time — and several things half-well. The biggest gaps are not visual, they are epistemic: the data has no automated provenance, no schema validation, no versioned snapshots, and no automated cross-check against ILGA. The strategic question for a v2 is not "rewrite in React" but "make the data layer defensible enough to cite in a research paper."

---

## 1. How the data flows today

```
ilga.gov  ─┐
           │  manual review + extraction (against bill-status pages)
           ▼
data/bills.json  ─── git commit ─── GitHub Pages deploy
           │
           ▼
  fetch('data/bills.json') from each HTML page → DOM rendering
```

There is one data file (`data/bills.json`). Every page (`index.html`, `bills.html`, `enacted.html`, `vectors.html`, `timeline.html`, `bill-detail.html`, `compliance.html`) calls `fetch('data/bills.json')` independently and renders client-side. There is no build step, no preprocessor, no API.

This is intentional — the data layer should be auditable by someone who isn't a JS developer. Open the JSON, read it, see what's there. The cost is everything below.

## 2. Surface optimizations (concrete fixes for v1.x)

**Data fetch is duplicated across pages.**
Six pages each call `fetch('data/bills.json')` and parse the same ~100KB document. On a cold visit that walks the site that's six round-trips and six parses. Fix: a single `js/data.js` module exporting a memoized `getBillsData()` that uses `Cache-Control: max-age=300` plus a `sessionStorage` fallback for navigation between pages. Cuts ~500ms off intra-site clicks on a slow connection.

**JSON has no schema.**
A typo in `statusClass` silently produces a default-styled badge. A missing `vectorIds` silently breaks the dashboard chart. There is no test catching either. Fix: a JSON Schema (Draft 2020-12) checked into `schema/bills.schema.json` and a GitHub Action that validates `data/bills.json` against it on every push. Catches roughly 80% of the dataset bugs that have shipped.

**`compliance.html` is one file with 163 inline-style attributes and ~145KB of HTML/JS/CSS.**
This is the most actively-developed page (assessment wizard + PDF generation) and the one most likely to grow. It needs to be split: assessment questions to JSON (so they're editable like bills are), the wizard logic to a single ES module, and the PDF generator to its own script. Right now changing one question in the assessment requires reading through 400 lines of inline JSON in HTML.

**Charts only render two categories now.**
The Bills-by-Status doughnut on the dashboard expects `Enacted | In Committee | 2nd Reading | Re-referred/Stalled`. After the April refresh, the data is `In Committee | Re-referred` only — two of the four buckets are empty. The chart is technically correct but visually misleading. Fix: derive the chart's category list from the data, not hard-code it. Either drop empty categories or normalize statuses to the four canonical buckets at refresh time.

**Date formatting is repeated in every page's JS.**
Each HTML file ships its own `formatDate()` helper, with subtle inconsistencies (some use UTC, some don't; some spell out the month, some abbreviate). There should be one `formatDate()`.

**No accessibility audit.**
Color contrast on the purple badge classes hasn't been checked against WCAG AA; the doughnut chart has no text-equivalent for screen readers; the timeline is a `<div>` soup with no semantic structure (`<ol>` would be correct). The site is being marketed as a public resource — this matters.

**No analytics, no error reporting.**
There's no instrumentation telling us which bills people actually click into, which referrers send traffic, or whether the JSON ever fails to load in a real browser. A single `data-tracking` attribute scheme with a privacy-respecting analytics endpoint (Plausible / a self-hosted Umami) would close that loop without compromising visitor privacy.

**The lead-capture form on the compliance page is the most legally-loaded element on the site.**
It collects name, company, and work email behind a webhook to an external automation tool. That is a "personal information collection" event under PA 103-0804's adjacent expectations. There's no privacy notice, no retention statement, and no opt-out. For a site that publishes IL privacy law commentary, this is awkward. Fix: a privacy notice next to the form, a link to a deletion-request mailbox, a documented retention window, and a server-side hash of the email rather than raw transmission to webhook providers.

**JS uses `var`-era patterns mixed with modern syntax.**
Mostly fine, but the inconsistency makes the codebase harder to read than it needs to be. ESLint with a small config and a pre-commit hook would homogenize this in an afternoon.

## 3. Strategic rebuild — scaling beyond a single state

Most of the surface fixes above are work to do regardless. The strategic question is different: this site is a one-state, manual-refresh artifact. What would it take to make it credible as the basis for ongoing research, or to scale to a multi-state version?

**Separate the data project from the presentation project.**
Right now the JSON is bundled with the website. The right shape is two repositories:
1. `il-ai-policy-data` — a versioned, schema-validated dataset of Illinois AI legislation. CSV / JSON exports. Releases tagged by date. Citable.
2. `il-ai-policy-tracker` — the website, which consumes the data project as a dependency.

This separation is what makes the dataset usable by people who don't want to scrape the website. It also lets the dataset be cited at a specific version in research papers.

**Automate the ingestion from ILGA.**
ILGA publishes an HTML status page per bill at a stable URL pattern. A nightly GitHub Action could scrape the action-history table for every tracked bill, diff against the committed JSON, and either auto-commit changes or open a PR for review. Manual data entry is the single biggest source of errors.

**Track provenance per field.**
Every field in `data/bills.json` should know where it came from and when. Concretely: each field becomes `{value, source, fetchedAt}`. The `intent` field stays manual-with-attribution; the `status` and `history` fields become automatically refreshed and timestamped. This is the difference between "a blog post about Illinois bills" and "a citable dataset on Illinois AI legislation."

**Add a methodology doc, separate from the README.**
What counts as an "AI bill"? Right now the inclusion criterion is "this is relevant," which is a defensible heuristic for a small project but indefensible for research. A `METHODOLOGY.md` should specify (a) the inclusion criteria, (b) the source list and their priorities, (c) the refresh cadence, (d) what we don't track and why (executive orders, agency rules, AG opinions, federal preemption questions, court cases — all currently invisible).

**Make the regulatory vectors taxonomy defensible.**
The six vectors are a research framework, not a fact. They were drawn by hand based on reading the bills. They should be argued for in a separate document — what's a vector, how are they bounded, what's the basis for putting SB 3261 in v1+v4 but SB 3262 in only v4 — and ideally cross-checked against another taxonomy (e.g., the NIST AI RMF risk categories, the NCSL's tagging scheme). Right now this is the part of the site most vulnerable to "well, that's just one view."

**Scale the schema for cross-state analysis.**
To answer "which states have addressed companion AI?" requires the same fields — `tldr`, `coreMechanism`, `effectiveDate`, `enforcementBody`, vectors — across states with consistent definitions. A schema that's good for IL is the prerequisite for a schema that works for IL + CA + TX + NY.

**Build a "diff between snapshots" view.**
A common first question is "what changed between March and April?" A built-in diff view — pick two commit hashes, get a side-by-side diff of bill statuses, amendments adopted, new bills introduced — would dramatically increase the site's usefulness for longitudinal analysis. The data is already in git history; this is just a UI on top of it.

**Add a public changelog + RSS.**
Anyone who actually relies on the site needs to be told when it updates. Right now they aren't. A `CHANGELOG.md`, an RSS feed of `meta.lastUpdated`, and an email-digest opt-in form (which would also legitimize the lead-capture form mentioned above) closes that loop.

## 4. What this site is *not*, and the integrity gaps that come with that

Honest framing for anyone evaluating the work:

- **It is not legal advice.** Bill summaries and TL;DRs are written for a non-lawyer audience and trade precision for accessibility. The compliance assessment generates a directional gap report, not a legal opinion.
- **It is not exhaustive.** AI-named bills and bills with substantive AI provisions are tracked. AI-adjacent bills (broader privacy bills like SB 3890 are included; the IL Right of Publicity Act amendments are; but every consumer-protection bill that mentions algorithms is not). The inclusion criterion needs to be written down.
- **It tracks legislation, not regulation.** Agency rules (e.g., IDHR's Subpart J on AI employment discrimination, ISBE's AI guidance under PA 104-0399) are where the substantive enforcement-shaping happens. They are not tracked here. They should be.
- **It does not track court cases or AG opinions.** The first major litigation under HB 1806 (the WOPR Act) will define the law in ways the statute text doesn't. Same for HB 3773 disparate-impact theories. Both deserve their own tracker.
- **The `intent` annotations are interpretive, not factual.** They reflect a reading of procedural moves. They've been written to be falsifiable (specific predictions, dated) but should be read as analysis, not record. A v2 should make this distinction visible in the UI — different styling for record vs. analysis, and ideally a track record showing past predictions and how they resolved.

## 5. Priorities to ship next

In order of marginal value per hour of work:

1. **JSON Schema + CI validation.** ~3 hours. Catches data-entry bugs immediately. Bigger payoff than anything else on this list.
2. **Methodology doc.** ~4 hours. Required for the site to be cite-able at all. Pairs with item 1.
3. **Single shared `getBillsData()` module + dedup.** ~2 hours. Closes the perf and consistency gap.
4. **Automated ILGA ingestion (action-history diff bot).** ~2 days. The biggest reduction in manual labor and the biggest reduction in error rate.
5. **Snapshot/diff UI for longitudinal analysis.** ~3 days. Highest research value once the data layer is solid.
6. **Split the data project from the website.** ~1 day for the split, ongoing for the discipline. Necessary precondition for items 4-5.
7. **Cross-state schema + a single second state (probably CA or TX).** ~1-2 weeks. Where the comparative work becomes possible.

---

*Last updated April 26, 2026.*
