# Reymen · Analytics — Daily Stock Reports

> Automated swing trade analysis reports, generated every weekday.

**Live dashboard:** https://reynolgzz.github.io/stock-reports/

---

## Overview

This repository powers the **Reymen Analytics** daily stock report platform:

- **Automated generation** — A GitHub Actions workflow runs every weekday at 13:00 UTC (8:00 AM ET), calls the Anthropic Claude API with live web search, and generates a premium dark-themed HTML report.
- **Report browser** — `index.html` (hosted on GitHub Pages) provides a polished sidebar + iframe viewer for browsing all reports by date.
- **Self-contained reports** — Each report is a standalone HTML file with embedded CSS, SVGs, and JavaScript.

---

## One-Time Setup

### 1. Add the Anthropic API Key

Go to **Settings → Secrets and variables → Actions → New repository secret**:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key (`sk-ant-…`) |

### 2. Enable GitHub Pages

Go to **Settings → Pages**:
- **Source:** Deploy from a branch
- **Branch:** `main` → Folder: `/ (root)` → **Save**

The dashboard will be live at `https://reynolgzz.github.io/stock-reports/` within ~1 minute.

### 3. Trigger the First Report (Optional)

Go to **Actions → Generate Daily Stock Report → Run workflow → Run workflow** to immediately generate the first report.

---

## Schedule

Reports are generated **Monday through Friday at 13:00 UTC (8:00 AM ET)**.

> GitHub disables scheduled workflows after 60 days of inactivity. Any commit or manual workflow run re-enables the schedule.

---

## Customizing the Prompt

Edit `scripts/prompt.md` to change what Claude generates. The file contents are sent verbatim as the user message to the API.

---

## File Structure

```
stock-reports/
├── index.html                     # Report browser (GitHub Pages entry point)
├── .nojekyll                      # Disables Jekyll on GitHub Pages
├── reports/
│   ├── manifest.json              # List of report dates (newest first)
│   └── YYYY-MM-DD.html            # Daily report files
└── scripts/
    ├── generate_report.py         # Report generation script
    └── prompt.md                  # Claude generation prompt
    .github/
    └── workflows/
        └── generate-report.yml    # Scheduled GitHub Actions workflow
```

---

## Disclaimer

Reports are for **educational purposes only** and do not constitute financial advice.
