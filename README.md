# Exit Interview Form

A single-page, three-step exit interview form for M1 Global / Metro One Security.
Responses are sent to a Google Apps Script Web App that appends them to a Google Sheet.

```
index.html            The form (HTML, CSS and JS in one file, no build step)
m1-logo.png           Logo shown in the header
apps-script/Code.gs   Backend: receives submissions and writes them to a Sheet
```

## Setup

### 1. Create the backend

1. Create a Google Sheet to hold responses, in an account your org controls.
2. In the Sheet, open **Extensions > Apps Script**.
3. Replace the contents of `Code.gs` with `apps-script/Code.gs` from this repo, then save.
4. Click **Deploy > New deployment**, choose type **Web app**, and set:
   - **Execute as:** Me
   - **Who has access:** Anyone. Use "Anyone within <your domain>" instead if the
     form will only be used by people signed in to your Google Workspace.
5. Authorize the script when prompted and copy the Web app URL (ends in `/exec`).

A `Responses` tab with a header row is created automatically on the first submission.

### 2. Point the form at your backend

In `index.html`, set `APPS_SCRIPT_URL` to your Web app URL:

```js
var APPS_SCRIPT_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
```

**Important:** the URL committed in this repo belongs to the original author's
Sheet. Replace it, or your submissions will go to their Sheet instead of yours.

If the value contains `PLACEHOLDER`, the form skips submitting and just shows the
thank-you screen, which is handy for local testing.

### 3. Host the form

`index.html` is a static file, so any web host works: an internal web server,
SharePoint, Azure Static Web Apps, S3, Netlify, GitHub Pages and so on. Upload
`index.html` and `m1-logo.png` together in the same folder.

To try it locally:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Customizing

- **Dropdown options:** the reasons list (`REASONS`) and rating questions
  (`RATING_FIELDS`) are defined near the top of the `<script>` in `index.html`.
  Other dropdowns are plain `<select>` elements in the HTML.
- **Adding a field:** give the input a `name`, then add that same name to `FIELDS`
  in `Code.gs` and redeploy (**Deploy > Manage deployments > Edit > New version**).
  Add the matching column header to the Sheet if the header row already exists.
- **Anonymous mode:** when "Keep yourself anonymous" is checked, the backend
  blanks out the name and employee ID before saving.

## Security notes

- The Apps Script URL is visible in the page source, so anyone who has it can
  POST data to it. If that matters, restrict the deployment to your Workspace
  domain or add a shared-secret check in `doPost`.
- Limit sharing on the response Sheet to the people who should read submissions.
