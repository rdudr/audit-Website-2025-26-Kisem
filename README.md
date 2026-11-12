# IIT Gandhinagar KISEM - Audit Annual Report

An interactive dashboard and map network for the Kotak IIT Gandhinagar Save Energy Mission (KISEM) auditing program across Gujarat, Rajasthan, and Daman.

**Live Website:** [https://audit-website-2025-26-kisem.vercel.app/](https://audit-website-2025-26-kisem.vercel.app/)

---

## What the site shows

* **Impact, year by year, sectors and scope**: recommended against achieved savings, ECMs and CO₂, worked out from the master data sheet.
* **All audits**: every audit by its KISEM audit number and sector, with search, filters, a map and a side panel per audit.
* **Company names are private.** The public data file holds no company names, plant addresses, plant contacts or source of lead. A team member signs in with their FOX Console login to see names, add companies, update implementation, keep each company's recommendation ledger and download the master Excel. All of that is served and logged by FOX Console (`lib/routes-site.js` in the fox-console repository).

---

## Data: from the master sheet to the website

```bash
cd kisem-annual-report
node scripts/parse-excel.cjs "../IIT Gandhinagar KISEM - Audit Master Data Sheet Latest 2026-27.xlsx"
```

This writes two files:

* `kisem-annual-report/src/data/audits.json`: **public**, bundled into the site. Commit this one.
* `private/kisem-master-full.json`: **team only** (names, addresses, plant contacts). Git ignores it. It goes to FOX Console once, on the server, with `scripts/site-import.mjs` (see fox-console `docs/AUDIT_WEBSITE.md`). Never e-mail or chat it.

The import cleans the sheet as it reads it: one spelling per district, sector groups for the filters (`Dyeing and Printing` → Textile), blank cells kept blank rather than 0, and the status line above each column turned into one of *Implementation verified*, *Post-audit pending* or *Report under process*. Walkthrough assessments (132) are not in the sheet; change `WALKTHROUGH_ASSESSMENTS` in the script when that number changes.

The GitHub Action (`.github/workflows/update-data.yml`) runs the same import every night from the published Google Sheet and commits only `audits.json`.

**Settings:** `VITE_CONSOLE_URL` (default `https://console.eassiitgn.page`) is where the site signs in and reads team data. For a local check, put `VITE_CONSOLE_URL=http://127.0.0.1:<port>` in `kisem-annual-report/.env.local`.

---

## Google Sheets sync (set-up)

The website syncs with the Google Sheet using GitHub Actions. Note: "Publish to web" makes the whole sheet, contacts included, readable by anyone who has the link. Keep the link out of public places, or publish a copy of the sheet without the team-only rows.

### Setup Instructions
1. Open your master Google Sheet.
2. Go to **File** > **Share** > **Publish to web**.
3. Select **Entire Document** and **Microsoft Excel (.xlsx)**.
4. Click **Publish** and copy the link.
5. Paste the link into the `google-sheet-config.json` file in the root folder of this repository:
   ```json
   {
     "googleSheetExcelUrl": "https://docs.google.com/spreadsheets/d/your-published-id/pub?output=xlsx"
   }
   ```

### Triggering an Immediate Update
The pipeline runs automatically once a day at midnight. To trigger an update immediately:
1. Go to the **Actions** tab on your GitHub repository.
2. Select the **"Update KISEM Company Data"** workflow on the left sidebar.
3. Click the **Run workflow** dropdown on the right and click the green **Run workflow** button.
4. The workflow will download, parse, commit the updated data, and trigger a Vercel rebuild automatically!

---

## 🛠️ Local Development

### 1. Installation
Install all dependencies in the frontend directory:
```bash
cd kisem-annual-report
npm install
```

### 2. Run Locally
Start the Vite local development server:
```bash
npm run dev
```

### 3. Build for Production
To build the static files for production deployment:
```bash
npm run build
```
The built files will be located in the `dist/` directory, ready to be deployed to static hosting (Vercel, Netlify, etc.).
