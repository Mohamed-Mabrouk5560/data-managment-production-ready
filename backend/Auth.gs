// ============================================
// Auth.gs - Authentication & Authorization
// ============================================

/**
 * Register a new user
 */
function registerUser(email, password, role) {
  try {
    // Check if user already exists
    var existingUser = getUserByEmail(email);
    if (existingUser) {
      return formatResponse(false, null, 'Email already registered');
    }
    
    // Hash password
    var hashedPassword = hashPassword(password);
    
    // Create user data
    var userData = {
      email: email,
      password: hashedPassword,
      role: role,
      confirmed: false, // New users need admin approval
      created: new Date()
    };
    
    // Save to Users sheet
    createUser(userData);
    
    return formatResponse(true, { email: email, role: role }, 'Registration successful. Please wait for admin approval.');
    
  } catch (error) {
    logError(error, 'registerUser');
    return formatResponse(false, null, 'Registration failed: ' + error.message);
  }
}

/**
 * Login user and create session
 */
function loginUser(email, password) {
  try {
    // Get user from database
    var user = getUserByEmail(email);
    if (!user) {
      return formatResponse(false, null, 'Invalid email or password');
    }
    
    // Verify password
    var hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      return formatResponse(false, null, 'Invalid email or password');
    }
    
    // Check if user is confirmed
    if (!user.confirmed) {
      return formatResponse(false, null, 'Account pending admin approval');
    }
    
    // Generate session token
    var token = generateToken();
    
    // Store session in cache (6 hours)
    var cache = CacheService.getScriptCache();
    var sessionData = JSON.stringify({
      email: user.email,
      role: user.role,
      confirmed: user.confirmed
    });
    cache.put(token, sessionData, 21600); // 6 hours in seconds
    
    return formatResponse(true, {
      token: token,
      email: user.email,
      role: user.role
    }, 'Login successful');
    
  } catch (error) {
    logError(error, 'loginUser');
    return formatResponse(false, null, 'Login failed: ' + error.message);
  }
}

/**
 * Validate session token
 */
function validateSession(token) {
  try {
    if (!token) {
      return { valid: false };
    }
    
    var cache = CacheService.getScriptCache();
    var sessionData = cache.get(token);
    
    if (!sessionData) {
      return { valid: false };
    }
    
    var session = JSON.parse(sessionData);
    return {
      valid: true,
      email: session.email,
      role: session.role,
      confirmed: session.confirmed
    };
    
  } catch (error) {
    logError(error, 'validateSession');
    return { valid: false };
  }
}

/**
 * Check if user is admin
 */
function isAdmin(token) {
  var session = validateSession(token);
  return session.valid && session.role === 'admin';
}

/**
 * Confirm user (admin only)
 */
function confirmUser(email) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var usersSheet = ss.getSheetByName('Users');
    var data = usersSheet.getDataRange().getValues();
    
    // Find user row
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === email) { // Email is in column A
        usersSheet.getRange(i + 1, 4).setValue(true); // Confirmed is in column D
        return true;
      }
    }
    
    return false;
    
  } catch (error) {
    logError(error, 'confirmUser');
    throw error;
  }
}

/**
 * Get pending users (admin only)
 */
function getPendingUsers() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var usersSheet = ss.getSheetByName('Users');
    var data = usersSheet.getDataRange().getValues();
    
    var pendingUsers = [];
    
    // Skip header row
    for (var i = 1; i < data.length; i++) {
      if (data[i][3] === false) { // Confirmed column
        pendingUsers.push({
          email: data[i][0],
          role: data[i][2],
          created: data[i][4]
        });
      }
    }
    
    return pendingUsers;
    
  } catch (error) {
    logError(error, 'getPendingUsers');
    throw error;
  }
}

/**
 * Hash password using SHA-256
 */
function hashPassword(password) {
  var rawHash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    password,
    Utilities.Charset.UTF_8
  );
  
  var hash = '';
  for (var i = 0; i < rawHash.length; i++) {
    var byte = rawHash[i];
    if (byte < 0) byte += 256;
    var byteStr = byte.toString(16);
    if (byteStr.length == 1) byteStr = '0' + byteStr;
    hash += byteStr;
  }
  
  return hash;
}

/**
 * Generate unique session token
 */
function generateToken() {
  var timestamp = new Date().getTime();
  var random = Math.random().toString(36).substring(2);
  return 'token_' + timestamp + '_' + random;
}
