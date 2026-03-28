# Illinois AI Legislative Ecosystem Map

A comprehensive, interactive dashboard tracking all AI-related bills and enacted statutes in Illinois' 104th General Assembly. Built to make AI policy accessible to policymakers, compliance teams, researchers, and the public.

**Live site:** [strategy.techne.ai/illinois-AI-laws](https://strategy.techne.ai/illinois-AI-laws/)

## What This Covers

- **7 enacted AI statutes** — from the AI Video Interview Act (2020) to the WOPR Act (2025)
- **29 pending bills** — tracked through committee, floor votes, and deadlines
- **6 regulatory vectors** — thematic clusters mapping how bills relate to each other
- **Interactive timeline** — key milestones from first passage through projected effective dates
- **Bill detail pages** — sponsor info, committee status, penalties, and links to official text

## Regulatory Vectors

| # | Vector | Bills |
|---|--------|-------|
| 01 | Frontier Model & Systemic Risk | 4 |
| 02 | Algorithmic Discrimination & Consumer Civil Rights | 2 |
| 03 | Transparency, Provenance & Disclosure | 6 |
| 04 | Companion AI & Minor Protection | 5 |
| 05 | Data Privacy, Neuro-Data & Model Training | 3 |
| 06 | Public Sector & Human-in-the-Loop | 10 |

## Data Sources

All legislative data is sourced from the [Illinois General Assembly](https://ilga.gov) (ILGA). Bill statuses, sponsors, committee assignments, and public act numbers are verified against official ILGA records.

Data is maintained in `data/bills.json` and updated as bills progress through the legislative process.

## Built With

- HTML, CSS, vanilla JavaScript
- [Chart.js](https://www.chartjs.org/) for dashboard visualizations
- [D3.js](https://d3js.org/) for the regulatory vectors network graph
- Deployed via GitHub Pages

## About

Built by [Khullani Abdullahi](https://www.linkedin.com/in/khullani/) at [Techne AI](https://techne.ai/).

This project is part of a broader effort to map the emerging AI regulatory landscape at the state level — making complex legislative ecosystems transparent and navigable for the people building, deploying, and governing AI systems.

Contributions, corrections, and feedback are welcome. Open an issue or reach out on [LinkedIn](https://www.linkedin.com/in/khullani/).

## License

This work is licensed under [CC BY 4.0](./LICENSE). You are free to share and adapt this material with appropriate credit.
