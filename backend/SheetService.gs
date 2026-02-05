/**
 * Get user by email from Users sheet
 */
function getUserByEmail(email) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var usersSheet = ss.getSheetByName('Users');
    
    if (!usersSheet) {
      throw new Error('Users sheet not found');
    }
    
    var data = usersSheet.getDataRange().getValues();
    
    // Skip header row
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === email) {
        return {
          email: data[i][0],
          password: data[i][1],
          role: data[i][2],
          confirmed: data[i][3],
          created: data[i][4]
        };
      }
    }
    
    return null;
    
  } catch (error) {
    logError(error, 'getUserByEmail');
    throw error;
  }
}

/**
 * Create new user in Users sheet
 */
function createUser(userData) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var usersSheet = ss.getSheetByName('Users');
    
    if (!usersSheet) {
      // Create Users sheet if it doesn't exist
      usersSheet = ss.insertSheet('Users');
      usersSheet.appendRow(['Email', 'Password', 'Role', 'Confirmed', 'Created']);
    }
    
    usersSheet.appendRow([
      userData.email,
      userData.password,
      userData.role,
      userData.confirmed,
      userData.created
    ]);
    
    return true;
    
  } catch (error) {
    logError(error, 'createUser');
    throw error;
  }
}

/**
 * Get record by National ID from Data sheet
 */
function getRecordByNationalId(nationalId) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dataSheet = ss.getSheetByName('Data');
    
    if (!dataSheet) {
      return null;
    }
    
    var data = dataSheet.getDataRange().getValues();
    var headers = data[0];
    
    // Find the column index for National ID (الرقم القومي)
    var nationalIdCol = headers.indexOf('الرقم القومي');
    
    if (nationalIdCol === -1) {
      throw new Error('National ID column not found');
    }
    
    // Search for matching record
    for (var i = 1; i < data.length; i++) {
      if (data[i][nationalIdCol] === nationalId) {
        var record = {};
        for (var j = 0; j < headers.length; j++) {
          record[headers[j]] = data[i][j];
        }
        return record;
      }
    }
    
    return null;
    
  } catch (error) {
    logError(error, 'getRecordByNationalId');
    throw error;
  }
}

/**
 * Get all records from Data sheet (admin only)
 */
function getAllRecords() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dataSheet = ss.getSheetByName('Data');
    
    if (!dataSheet) {
      return [];
    }
    
    var data = dataSheet.getDataRange().getValues();
    var headers = data[0];
    var records = [];
    
    // Convert rows to objects
    for (var i = 1; i < data.length; i++) {
      var record = {};
      for (var j = 0; j < headers.length; j++) {
        record[headers[j]] = data[i][j];
      }
      records.push(record);
    }
    
    return records;
    
  } catch (error) {
    logError(error, 'getAllRecords');
    throw error;
  }
}

/**
 * Create new record in Data sheet
 */
function createRecord(recordData) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dataSheet = ss.getSheetByName('Data');
    
    if (!dataSheet) {
      // Create Data sheet with headers if it doesn't exist
      dataSheet = ss.insertSheet('Data');
      dataSheet.appendRow([
        'Timestamp',
        'الاسم ثلاثي',
        'رقم التليفون',
        'القرية',
        'المحافظة',
        'الرقم القومي',
        'نوع الاعاقة',
        'دليل القرية',
        'رقم دليل القرية',
        'المركز الطبي الشريك',
        'الخدمة المقدمة',
        'فورتي موكس',
        'الشركة الشريكة بتنفيذ النظارات',
        'رقم مسؤول الشركة',
        'الملاحظات الخاصة بتنفيذ النظارات',
        'المركز والشريك الطبي',
        'الجهة',
        'الملاحظات للعمليات',
        'الكود'
      ]);
    }
    
    var headers = dataSheet.getRange(1, 1, 1, dataSheet.getLastColumn()).getValues()[0];
    var row = [new Date()]; // Timestamp
    
    // Build row based on headers
    for (var i = 1; i < headers.length; i++) {
      row.push(recordData[headers[i]] || '');
    }
    
    dataSheet.appendRow(row);
    return true;
    
  } catch (error) {
    logError(error, 'createRecord');
    throw error;
  }
}

/**
 * Update record by National ID
 */
function updateRecord(nationalId, updates) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dataSheet = ss.getSheetByName('Data');
    
    if (!dataSheet) {
      return false;
    }
    
    var data = dataSheet.getDataRange().getValues();
    var headers = data[0];
    var nationalIdCol = headers.indexOf('الرقم القومي');
    
    // Find the row to update
    for (var i = 1; i < data.length; i++) {
      if (data[i][nationalIdCol] === nationalId) {
        // Update each field
        for (var key in updates) {
          var colIndex = headers.indexOf(key);
          if (colIndex !== -1) {
            dataSheet.getRange(i + 1, colIndex + 1).setValue(updates[key]);
          }
        }
        return true;
      }
    }
    
    return false;
    
  } catch (error) {
    logError(error, 'updateRecord');
    throw error;
  }
}

/**
 * Delete record by National ID
 */
function deleteRecord(nationalId) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dataSheet = ss.getSheetByName('Data');
    
    if (!dataSheet) {
      return false;
    }
    
    var data = dataSheet.getDataRange().getValues();
    var headers = data[0];
    var nationalIdCol = headers.indexOf('الرقم القومي');
    
    // Find and delete the row
    for (var i = 1; i < data.length; i++) {
      if (data[i][nationalIdCol] === nationalId) {
        dataSheet.deleteRow(i + 1);
        return true;
      }
    }
    
    return false;
    
  } catch (error) {
    logError(error, 'deleteRecord');
    throw error;
  }
}

/**
 * Check if National ID already exists
 */
function nationalIdExists(nationalId) {
  try {
    var record = getRecordByNationalId(nationalId);
    return record !== null;
    
  } catch (error) {
    logError(error, 'nationalIdExists');
    throw error;
  }
}
