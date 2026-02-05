// ============================================
// Code.gs - Main Entry Points
// ============================================

/**
 * Handles GET requests
 * Routes: search, getAllRecords, getPendingUsers
 */
function doGet(e) {
  try {
    var params = e.parameter;
    var action = params.action;
    var token = params.token;
    
    // Validate session for all GET requests
    var session = validateSession(token);
    if (!session.valid) {
      return formatResponse(false, null, 'Unauthorized: Invalid or expired session');
    }
    
    // Route based on action
    switch(action) {
      case 'search':
        var nationalId = params.nationalId;
        if (!nationalId) {
          return formatResponse(false, null, 'National ID is required');
        }
        var record = getRecordByNationalId(nationalId);
        return formatResponse(true, record, record ? 'Record found' : 'No record found');
        
      case 'getAllRecords':
        if (!isAdmin(token)) {
          return formatResponse(false, null, 'Unauthorized: Admin access required');
        }
        var records = getAllRecords();
        return formatResponse(true, records, 'Records retrieved successfully');
        
      case 'getPendingUsers':
        if (!isAdmin(token)) {
          return formatResponse(false, null, 'Unauthorized: Admin access required');
        }
        var pendingUsers = getPendingUsers();
        return formatResponse(true, pendingUsers, 'Pending users retrieved successfully');
        
      default:
        return formatResponse(false, null, 'Invalid action');
    }
    
  } catch (error) {
    logError(error, 'doGet');
    return formatResponse(false, null, 'Server error: ' + error.message);
  }
}

/**
 * Handles POST requests
 * Routes: register, login, submitData, updateRecord, deleteRecord, confirmUser
 */
function doPost(e) {
  try {
    var params = JSON.parse(e.postData.contents);
    var action = params.action;
    
    // Routes that don't require authentication
    if (action === 'register') {
      var email = sanitizeInput(params.email);
      var password = params.password;
      var role = params.role || 'user';
      
      if (!validateEmail(email)) {
        return formatResponse(false, null, 'Invalid email format');
      }
      
      var result = registerUser(email, password, role);
      return result;
    }
    
    if (action === 'login') {
      var email = sanitizeInput(params.email);
      var password = params.password;
      
      var result = loginUser(email, password);
      return result;
    }
    
    // All other routes require authentication
    var token = params.token;
    var session = validateSession(token);
    if (!session.valid) {
      return formatResponse(false, null, 'Unauthorized: Invalid or expired session');
    }
    
    // Route based on action
    switch(action) {
      case 'submitData':
        var formData = params.data;
        
        // Validate national ID
        if (!formData['الرقم القومي']) {
          return formatResponse(false, null, 'National ID is required');
        }
        
        // Check for duplicates
        if (nationalIdExists(formData['الرقم القومي'])) {
          return formatResponse(false, null, 'National ID already exists');
        }
        
        var created = createRecord(formData);
        return formatResponse(true, created, 'Data submitted successfully');
        
      case 'updateRecord':
        if (!isAdmin(token)) {
          return formatResponse(false, null, 'Unauthorized: Admin access required');
        }
        var nationalId = params.nationalId;
        var updates = params.updates;
        var updated = updateRecord(nationalId, updates);
        return formatResponse(true, updated, 'Record updated successfully');
        
      case 'deleteRecord':
        if (!isAdmin(token)) {
          return formatResponse(false, null, 'Unauthorized: Admin access required');
        }
        var nationalId = params.nationalId;
        var deleted = deleteRecord(nationalId);
        return formatResponse(true, deleted, 'Record deleted successfully');
        
      case 'confirmUser':
        if (!isAdmin(token)) {
          return formatResponse(false, null, 'Unauthorized: Admin access required');
        }
        var userEmail = params.email;
        var confirmed = confirmUser(userEmail);
        return formatResponse(true, confirmed, 'User confirmed successfully');
        
      default:
        return formatResponse(false, null, 'Invalid action');
    }
    
  } catch (error) {
    logError(error, 'doPost');
    return formatResponse(false, null, 'Server error: ' + error.message);
  }
}
