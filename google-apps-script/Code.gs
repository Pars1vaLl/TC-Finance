/**
 * Warehouse Profit Analytics - Google Apps Script Backend
 * 
 * This script provides the API endpoints for the warehouse analytics system.
 * It manages data in Google Sheets and provides REST API access.
 */

// Configuration
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE' // Replace with your actual spreadsheet ID
const SHEET_NAMES = {
  TRANSACTIONS: 'Transactions',
  WAREHOUSES: 'Warehouses', 
  COST_TYPES: 'CostTypes',
  SNAPSHOTS: 'Snapshots'
}

// CORS headers for cross-origin requests
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
}

/**
 * Main entry point for GET requests
 */
function doGet(e) {
  try {
    const path = e.parameter.path || ''
    const action = e.parameter.action || ''
    
    // Handle CORS preflight requests
    if (e.parameter.method === 'OPTIONS') {
      return createResponse(200, { message: 'OK' }, CORS_HEADERS)
    }
    
    switch (path) {
      case 'meta':
        return getMetadata()
      case 'report':
        return getReport(e.parameter.month)
      case 'snapshot':
        return getSnapshot(e.parameter.month)
      default:
        return createResponse(404, { error: 'Endpoint not found' })
    }
  } catch (error) {
    console.error('doGet error:', error)
    return createResponse(500, { error: 'Internal server error' })
  }
}

/**
 * Main entry point for POST requests
 */
function doPost(e) {
  try {
    const path = e.parameter.path || ''
    const data = JSON.parse(e.postData.contents)
    
    switch (path) {
      case 'txn':
        return createTransaction(data)
      case 'warehouse':
        return createWarehouse(data)
      case 'costType':
        return createCostType(data)
      default:
        return createResponse(404, { error: 'Endpoint not found' })
    }
  } catch (error) {
    console.error('doPost error:', error)
    return createResponse(500, { error: 'Internal server error' })
  }
}

/**
 * Get metadata (warehouses and cost types)
 */
function getMetadata() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
    
    // Get warehouses
    const warehousesSheet = spreadsheet.getSheetByName(SHEET_NAMES.WAREHOUSES)
    const warehouses = getSheetData(warehousesSheet, ['id', 'name', 'emoji', 'color'])
    
    // Get cost types
    const costTypesSheet = spreadsheet.getSheetByName(SHEET_NAMES.COST_TYPES)
    const costTypes = getSheetData(costTypesSheet, ['id', 'name', 'is_direct'])
    
    return createResponse(200, {
      warehouses: warehouses,
      costTypes: costTypes
    })
  } catch (error) {
    console.error('getMetadata error:', error)
    return createResponse(500, { error: 'Failed to get metadata' })
  }
}

/**
 * Create a new transaction
 */
function createTransaction(data) {
  try {
    // Validate required fields
    const requiredFields = ['date', 'warehouse_id', 'cost_type_id', 'is_income', 'amount', 'currency']
    for (const field of requiredFields) {
      if (!data[field]) {
        return createResponse(400, { error: `Missing required field: ${field}` })
      }
    }
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
    const transactionsSheet = spreadsheet.getSheetByName(SHEET_NAMES.TRANSACTIONS)
    
    // Generate UUID for transaction ID
    const transactionId = generateUUID()
    
    // Convert amount to TJS (simplified - you'll need to implement real currency conversion)
    const amountTJS = convertToTJS(data.amount, data.currency, data.date)
    
    // Prepare row data
    const rowData = [
      transactionId,
      data.date,
      data.warehouse_id,
      data.cost_type_id,
      data.is_income ? 1 : 0,
      data.amount,
      data.currency,
      amountTJS,
      new Date().toISOString() // created_at
    ]
    
    // Append to sheet
    transactionsSheet.appendRow(rowData)
    
    // Invalidate cache for the month
    invalidateCache(data.date.substring(0, 7))
    
    return createResponse(201, {
      id: transactionId,
      message: 'Transaction created successfully'
    })
  } catch (error) {
    console.error('createTransaction error:', error)
    return createResponse(500, { error: 'Failed to create transaction' })
  }
}

/**
 * Create a new warehouse
 */
function createWarehouse(data) {
  try {
    // Validate required fields
    if (!data.name) {
      return createResponse(400, { error: 'Warehouse name is required' })
    }
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
    const warehousesSheet = spreadsheet.getSheetByName(SHEET_NAMES.WAREHOUSES)
    
    // Check if warehouse name already exists
    const existingWarehouses = getSheetData(warehousesSheet, ['id', 'name'])
    const nameExists = existingWarehouses.some(w => w.name.toLowerCase() === data.name.toLowerCase())
    
    if (nameExists) {
      return createResponse(409, { error: 'Warehouse name already exists' })
    }
    
    // Generate UUID for warehouse ID
    const warehouseId = generateUUID()
    
    // Prepare row data
    const rowData = [
      warehouseId,
      data.name,
      data.emoji || '🏢',
      data.color || '#3B82F6',
      new Date().toISOString() // created_at
    ]
    
    // Append to sheet
    warehousesSheet.appendRow(rowData)
    
    return createResponse(201, {
      id: warehouseId,
      message: 'Warehouse created successfully'
    })
  } catch (error) {
    console.error('createWarehouse error:', error)
    return createResponse(500, { error: 'Failed to create warehouse' })
  }
}

/**
 * Create a new cost type
 */
function createCostType(data) {
  try {
    // Validate required fields
    if (!data.name) {
      return createResponse(400, { error: 'Cost type name is required' })
    }
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
    const costTypesSheet = spreadsheet.getSheetByName(SHEET_NAMES.COST_TYPES)
    
    // Check if cost type name already exists
    const existingCostTypes = getSheetData(costTypesSheet, ['id', 'name'])
    const nameExists = existingCostTypes.some(ct => ct.name.toLowerCase() === data.name.toLowerCase())
    
    if (nameExists) {
      return createResponse(409, { error: 'Cost type name already exists' })
    }
    
    // Generate UUID for cost type ID
    const costTypeId = generateUUID()
    
    // Prepare row data
    const rowData = [
      costTypeId,
      data.name,
      data.is_direct ? 1 : 0,
      new Date().toISOString() // created_at
    ]
    
    // Append to sheet
    costTypesSheet.appendRow(rowData)
    
    return createResponse(201, {
      id: costTypeId,
      message: 'Cost type created successfully'
    })
  } catch (error) {
    console.error('createCostType error:', error)
    return createResponse(500, { error: 'Failed to create cost type' })
  }
}

/**
 * Get report data for a specific month
 */
function getReport(month) {
  try {
    if (!month) {
      return createResponse(400, { error: 'Month parameter is required (YYYY-MM)' })
    }
    
    // Check cache first
    const cachedReport = getCachedReport(month)
    if (cachedReport) {
      return createResponse(200, cachedReport)
    }
    
    // Calculate report
    const report = calculateReport(month)
    
    // Cache the report
    cacheReport(month, report)
    
    return createResponse(200, report)
  } catch (error) {
    console.error('getReport error:', error)
    return createResponse(500, { error: 'Failed to get report' })
  }
}

/**
 * Get snapshot data for a specific month
 */
function getSnapshot(month) {
  try {
    if (!month) {
      return createResponse(400, { error: 'Month parameter is required (YYYY-MM)' })
    }
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
    const transactionsSheet = spreadsheet.getSheetByName(SHEET_NAMES.TRANSACTIONS)
    
    // Get all transactions for the month
    const transactions = getTransactionsForMonth(transactionsSheet, month)
    
    return createResponse(200, { transactions })
  } catch (error) {
    console.error('getSnapshot error:', error)
    return createResponse(500, { error: 'Failed to get snapshot' })
  }
}

// Helper functions

/**
 * Create a standardized response
 */
function createResponse(statusCode, data, additionalHeaders = {}) {
  const headers = { ...CORS_HEADERS, ...additionalHeaders }
  const response = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
  
  // Set headers
  for (const [key, value] of Object.entries(headers)) {
    response.setHeader(key, value)
  }
  
  return response
}

/**
 * Get data from a sheet as objects
 */
function getSheetData(sheet, columns) {
  if (!sheet) return []
  
  const data = sheet.getDataRange().getValues()
  if (data.length <= 1) return [] // Only header row
  
  const rows = data.slice(1) // Skip header row
  return rows.map(row => {
    const obj = {}
    columns.forEach((col, index) => {
      obj[col] = row[index]
    })
    return obj
  })
}

/**
 * Generate a UUID
 */
function generateUUID() {
  return Utilities.getUuid()
}

/**
 * Convert amount to TJS (simplified implementation)
 */
function convertToTJS(amount, currency, date) {
  // This is a simplified implementation
  // In production, you should use real exchange rates
  const rates = {
    'TJS': 1,
    'USD': 10.5, // Approximate rate
    'EUR': 11.5  // Approximate rate
  }
  
  return amount * (rates[currency] || 1)
}

/**
 * Get transactions for a specific month
 */
function getTransactionsForMonth(sheet, month) {
  if (!sheet) return []
  
  const data = sheet.getDataRange().getValues()
  if (data.length <= 1) return []
  
  const rows = data.slice(1)
  return rows.filter(row => {
    const transactionDate = new Date(row[1]) // date column
    const transactionMonth = Utilities.formatDate(transactionDate, Session.getScriptTimeZone(), 'yyyy-MM')
    return transactionMonth === month
  }).map(row => ({
    id: row[0],
    date: row[1],
    warehouse_id: row[2],
    cost_type_id: row[3],
    is_income: row[4] === 1,
    amount: row[5],
    currency: row[6],
    amount_tjs: row[7]
  }))
}

/**
 * Calculate report for a month
 */
function calculateReport(month) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
  const transactionsSheet = spreadsheet.getSheetByName(SHEET_NAMES.TRANSACTIONS)
  const warehousesSheet = spreadsheet.getSheetByName(SHEET_NAMES.WAREHOUSES)
  
  const transactions = getTransactionsForMonth(transactionsSheet, month)
  const warehouses = getSheetData(warehousesSheet, ['id', 'name', 'emoji', 'color'])
  
  // Calculate totals
  let totalRevenue = 0
  let totalExpenses = 0
  
  transactions.forEach(txn => {
    if (txn.is_income) {
      totalRevenue += txn.amount_tjs
    } else {
      totalExpenses += txn.amount_tjs
    }
  })
  
  const grossProfit = totalRevenue - totalExpenses
  const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0
  
  // Calculate by warehouse
  const warehouseStats = warehouses.map(warehouse => {
    const warehouseTransactions = transactions.filter(txn => txn.warehouse_id === warehouse.id)
    let warehouseRevenue = 0
    let warehouseExpenses = 0
    
    warehouseTransactions.forEach(txn => {
      if (txn.is_income) {
        warehouseRevenue += txn.amount_tjs
      } else {
        warehouseExpenses += txn.amount_tjs
      }
    })
    
    const warehouseProfit = warehouseRevenue - warehouseExpenses
    const warehouseMargin = warehouseRevenue > 0 ? (warehouseProfit / warehouseRevenue) * 100 : 0
    
    return {
      id: warehouse.id,
      name: warehouse.name,
      emoji: warehouse.emoji,
      color: warehouse.color,
      revenue: warehouseRevenue,
      expenses: warehouseExpenses,
      profit: warehouseProfit,
      margin: warehouseMargin,
      transactionCount: warehouseTransactions.length
    }
  })
  
  return {
    month,
    summary: {
      totalRevenue,
      totalExpenses,
      grossProfit,
      profitMargin,
      transactionCount: transactions.length,
      warehouseCount: warehouses.length
    },
    warehouses: warehouseStats
  }
}

/**
 * Cache management functions
 */
function getCachedReport(month) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
  const snapshotsSheet = spreadsheet.getSheetByName(SHEET_NAMES.SNAPSHOTS)
  
  if (!snapshotsSheet) return null
  
  const data = snapshotsSheet.getDataRange().getValues()
  const cachedRow = data.find(row => row[0] === month)
  
  if (cachedRow) {
    try {
      return JSON.parse(cachedRow[1])
    } catch (error) {
      console.error('Error parsing cached report:', error)
      return null
    }
  }
  
  return null
}

function cacheReport(month, report) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
  let snapshotsSheet = spreadsheet.getSheetByName(SHEET_NAMES.SNAPSHOTS)
  
  if (!snapshotsSheet) {
    snapshotsSheet = spreadsheet.insertSheet(SHEET_NAMES.SNAPSHOTS)
    snapshotsSheet.getRange(1, 1, 1, 3).setValues([['month', 'report_data', 'created_at']])
  }
  
  // Check if month already exists
  const data = snapshotsSheet.getDataRange().getValues()
  const existingRowIndex = data.findIndex(row => row[0] === month)
  
  if (existingRowIndex > 0) {
    // Update existing row
    snapshotsSheet.getRange(existingRowIndex + 1, 2, 1, 2).setValues([
      [JSON.stringify(report), new Date().toISOString()]
    ])
  } else {
    // Add new row
    snapshotsSheet.appendRow([month, JSON.stringify(report), new Date().toISOString()])
  }
}

function invalidateCache(month) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
  const snapshotsSheet = spreadsheet.getSheetByName(SHEET_NAMES.SNAPSHOTS)
  
  if (!snapshotsSheet) return
  
  const data = snapshotsSheet.getDataRange().getValues()
  const rowIndex = data.findIndex(row => row[0] === month)
  
  if (rowIndex > 0) {
    snapshotsSheet.deleteRow(rowIndex + 1)
  }
} 