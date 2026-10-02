// Backend for the Exit Interview form (index.html).
//
// Bind this script to the Google Sheet that should collect responses
// (Extensions > Apps Script in that Sheet), then deploy it as a Web App.
// The form POSTs each field by its input `name`; every submission is
// appended as one row, with columns in the order of FIELDS below.

var SHEET_NAME = "Responses";

var FIELDS = [
  "anonymous", "fullName", "employeeId", "company", "jobTitle", "department",
  "site", "supervisor", "employmentType", "startDate", "lastDay", "tenure",
  "separationType", "primaryReason", "secondaryReason", "noticeGiven",
  "nextMove", "recommend", "rehire", "mainReason", "retentionSuggestion",
  "additionalComments", "confirm",
  "overallSatisfaction", "payCompensation", "supervisorRelationship",
  "safetyConditions", "workplaceCulture"
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["timestamp"].concat(FIELDS));
      sheet.setFrozenRows(1);
    }
    var params = (e && e.parameter) || {};
    if (params.anonymous === "Yes") {
      params.fullName = "";
      params.employeeId = "";
    }
    var row = [new Date()].concat(FIELDS.map(function (f) { return params[f] || ""; }));
    sheet.appendRow(row);
    return ContentService.createTextOutput("OK");
  } finally {
    lock.releaseLock();
  }
}
