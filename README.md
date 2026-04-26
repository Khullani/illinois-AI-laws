# Illinois AI Legislative Ecosystem Map

A bill-by-bill map of every AI-related law and pending bill in Illinois' 104th General Assembly — with TL;DRs, full procedural history, amendment tracking, and an analyst view on where each bill is likely to land.

**Live site:** [strategy.techne.ai/illinois-AI-laws](https://strategy.techne.ai/illinois-AI-laws/)
**Written testimony to the Illinois Senate (April 2026):** [Khullani Abdullahi — IL Senate AI Hearings](https://strategy.techne.ai/illinois-AI-laws/docs/Khullani_Abdullahi_Written_Testimony_IL_Senate_AI_Hearings_April2026.pdf)

---

## Why this exists

Illinois has 7 enacted AI statutes and 30 pending bills across the 104th General Assembly, sponsored by 17 different legislators, moving in and out of two committees on different deadlines. The official tracker — [ilga.gov](https://www.ilga.gov/) — is authoritative but flat: it shows status, not state. You can read every bill and still not see the shape of the ecosystem.

This site builds the shape. Bills are grouped into six **regulatory vectors** (frontier risk, algorithmic discrimination, transparency/provenance, companion AI and minor protection, data privacy, public-sector ADS), each bill's procedural trail is tracked, and the moves that signal where negotiation is happening — co-sponsor adds, amendment filings, deadline extensions, the OpenAI-vs-Anthropic split over SB 3444, the workforce-AI bill (HB 4980) that cleared committee with a 25+ co-sponsor coalition then quietly missed the floor whip count — are annotated.

## What it covers

- **7 enacted statutes** (PA 103-0804, PA 104-0054 / WOPR Act, PA 103-0880, PA 103-0882, PA 103-0806, PA 104-0399, 820 ILCS 42)
- **30 pending bills** with full action history, amendment tracking, and analyst notes on likely landing
- **6 regulatory vectors** as a thematic taxonomy
- **Compliance assessment** — a 35-question wizard and PDF gap report for organizations subject to PA 103-0804 and the WOPR Act
- **Timeline** — every milestone from 2020 (the AI Video Interview Act) through the May 15, 2026 Senate third-reading deadline

## Per-bill depth

| Field | What it tells you |
|---|---|
| `tldr` | One-paragraph plain-language summary of what the bill does |
| `summary` | Longer formal description |
| `history` | Chronological action trail with intent annotations on what each move signals |
| `amendments` | Each amendment with adopted/filed status and what it changes |
| `intent` | Read on negotiation dynamics and likely landing spot |
| `vectorIds` | Which regulatory vectors the bill touches |

## How to use it

- **Policy researchers:** Start with the [Regulatory Vectors](https://strategy.techne.ai/illinois-AI-laws/vectors.html) view. Each vector is a hypothesis about how bills cluster; the bill-detail pages let you trace the evidence.
- **Compliance leads:** Start with [Enacted Laws](https://strategy.techne.ai/illinois-AI-laws/enacted.html) and the [Compliance](https://strategy.techne.ai/illinois-AI-laws/compliance.html) assessment.
- **Journalists and advocates:** The [Bill Tracker](https://strategy.techne.ai/illinois-AI-laws/bills.html) supports search across IDs, names, sponsors, summaries, and TL;DRs.
- **Engineering review:** [ARCHITECTURE.md](./ARCHITECTURE.md) covers the data flow, optimization opportunities, integrity gaps, and a roadmap for scaling beyond a single state.

## Data sources

All legislative data comes from the [Illinois General Assembly](https://www.ilga.gov/). For each bill, the canonical record is the ILGA bill-status page (linked from every detail page). Status, sponsors, committee assignments, amendments, and public act numbers are verified against ILGA before each refresh.

Secondary context — co-sponsor signals, hearing dynamics, public testimony — is drawn from Illinois Senate hearing transcripts, Capitol News Illinois, the Transparency Coalition, and contemporary press coverage. Each source feeds into the `intent` annotations, not the `status`/`history` fields, which stay tied to ILGA's record of action.

The data file (`data/bills.json`) is the source of truth. Every page derives from it.

## Built with

Vanilla HTML, CSS, and JavaScript. Chart.js for the dashboard charts; D3.js for the vectors graph. Hosted on GitHub Pages with a Jekyll deploy. No build step, no framework, no JS dependencies in `package.json` (there is no `package.json`). The full stack is what you see in the repo.

This is deliberate — the data layer should be auditable end-to-end by someone who isn't a JavaScript developer. Every transformation between `data/bills.json` and what you see on the page is a few lines of plain code in one of the seven HTML files. See [ARCHITECTURE.md](./ARCHITECTURE.md) for the costs and tradeoffs of that choice.

## Refresh cadence

The site is refreshed by hand against ILGA after major legislative deadlines (March 27 committee deadline, April 17 House floor deadline, April 24 Senate AI committee deadline, May 15 third-reading deadline). Each refresh is a single commit; the timestamp in `data/bills.json` (`meta.lastUpdated`) is the canonical "as of" date.

## Citing a snapshot

To cite the state of the ecosystem at a specific point in time, link to a specific commit's `data/bills.json` rather than the live URL — the live data file moves as bills advance:

```
https://github.com/Khullani/illinois-AI-laws/blob/<commit-sha>/data/bills.json
```

(See ARCHITECTURE.md for plans to make this easier.)

## About

Built by [Khullani Abdullahi](https://www.linkedin.com/in/khullani/) at [Techne AI](https://techne.ai/). This project maps Illinois' AI regulatory landscape so legislators, compliance leads, and researchers can engage with policy as it's actually being made.

Contributions, corrections, and feedback are welcome. Open an issue or [a pull request](https://github.com/Khullani/illinois-AI-laws/pulls).

## License

Code and data are licensed [CC BY 4.0](./LICENSE). You may share and adapt with attribution. The written testimony is © Khullani Abdullahi and not licensed for reuse without permission.
