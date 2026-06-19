# IIT Gandhinagar KISEM - Audit Annual Report

An interactive dashboard and map network for the Kotak IIT Gandhinagar Save Energy Mission (KISEM) auditing program across Gujarat, Rajasthan, and Daman.

**Live Website:** [https://audit-website-2025-26-kisem.vercel.app/](https://audit-website-2025-26-kisem.vercel.app/)

---

## 🚀 Key Features

*   **Interactive Audit Map**: Displays all audited plants with details, including coordinates and sector metrics, with responsive popups/drawers.
*   **Dynamic Year-over-Year Tracking**: Auto-calculates annual savings, CO₂ reductions, and ECM implementation rates dynamically across multiple years.
*   **Energy Savings Deep-Dive**: Visual charts showing electrical and thermal savings trends.
*   **Team Section**: Interactive cards displaying faculty members and auditing engineers.
*   **Automated Data Sync**: Connected directly to Google Sheets to fetch and publish live updates automatically.

---

## 🔄 Live Google Sheets Sync Pipeline

The website automatically syncs with your Google Sheet using GitHub Actions.

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
