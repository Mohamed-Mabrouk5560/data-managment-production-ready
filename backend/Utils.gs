// ============================================
// Utils.gs - Utility Functions
// ============================================

/**
 * Sanitize input to prevent injection attacks
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Validate email format
 */
function validateEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate National ID format (14 digits)
 */
function validateNationalId(id) {
  if (!id) return false;
  var idStr = id.toString();
  return /^\d{14}$/.test(idStr);
}

/**
 * Format standardized API response
 */
function formatResponse(success, data, message) {
  var response = {
    success: success,
    data: data,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Log errors to spreadsheet
 */
function logError(error, context) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var logSheet = ss.getSheetByName('ErrorLog');
    
    if (!logSheet) {
      logSheet = ss.insertSheet('ErrorLog');
      logSheet.appendRow(['Timestamp', 'Context', 'Error Message', 'Stack Trace']);
    }
    
    logSheet.appendRow([
      new Date(),
      context,
      error.message,
      error.stack || 'N/A'
    ]);
    
  } catch (logError) {
    // If logging fails, at least log to console
    Logger.log('Error in ' + context + ': ' + error.message);
  }
}

/**
 * Clear expired sessions (optional maintenance function)
 */
function clearExpiredSessions() {
  // CacheService automatically removes expired items
  // This is just a placeholder for any manual cleanup if needed
  Logger.log('Cache cleanup completed');
}
