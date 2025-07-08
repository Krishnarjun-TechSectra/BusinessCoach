import React from "react"
export interface ProgressItem {
  [key: string]: any
}

export interface OnboardingItem {
  [key: string]: any
}

export interface PivotTableData {
  months: string[]
  metrics: string[]
  data: { [metric: string]: { [month: string]: string } }
  targets: { [metric: string]: { monthly: string; sixMonth: string; total: string } }
}

export function cleanFieldName(fieldName: string): string {
  return fieldName
    .replace(/\s*$$[^)]*$$/g, "") // Remove content in parentheses
    .replace(/\s*\[[^\]]*\]/g, "") // Remove content in square brackets
    .replace(/\s*\{[^}]*\}/g, "") // Remove content in curly brackets
    .trim()
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
}

// Add a function to normalize field names for better matching
export function normalizeFieldName(fieldName: string): string {
  return fieldName
    .toLowerCase()
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/[^\w\s]/g, "") // Remove special characters except spaces
    .trim()
}

export function isGoalField(fieldName: string): boolean {
  return /goal\s*no\s*\d+\s*progress/i.test(fieldName)
}

export function isExcludedField(fieldName: string): boolean {
  const excludePatterns = [
    /timestamp/i,
    /email/i,
    /mail/i,
    /id/i,
    /name/i,
    /company/i,
    /password/i,
    /whatsapp/i,
    /location/i,
    /program/i,
    /role/i,
  ]
  return excludePatterns.some((pattern) => pattern.test(fieldName))
}

export function isTargetField(fieldName: string): boolean {
  const targetPatterns = [
    /sales target.*2025-26/i,
    /gross profit.*2025-26/i,
    /net profit.*2025-26/i,
    /outstanding amount.*below.*2025-26/i,
    /cc.*debt balance.*below.*2025-26/i,
    /stage of business.*next year/i,
    /total number of team members.*sales.*marketing.*operations/i,
    /how much time.*involved.*day to day operations/i,
  ]
  return targetPatterns.some((pattern) => pattern.test(fieldName))
}

export function shouldDivideBy12(fieldName: string): boolean {
  const divideBy12Patterns = [
    /sales target.*2025-26/i,
    /gross profit.*2025-26/i,
    /net profit.*2025-26/i,
    /outstanding amount.*below.*2025-26/i,
    /cc.*debt balance.*below.*2025-26/i,
    /total number of team members.*sales.*marketing.*operations/i,
  ]
  return divideBy12Patterns.some((pattern) => pattern.test(fieldName))
}

export function shouldDivideBy2(fieldName: string): boolean {
  return false
}

export function shouldDivideBy6(fieldName: string): boolean {
  const divideBy6Patterns = [
    /sales target.*2025-26/i,
    /gross profit.*2025-26/i,
    /net profit.*2025-26/i,
    /outstanding amount.*below.*2025-26/i,
    /cc.*debt balance.*below.*2025-26/i,
    /total number of team members.*sales.*marketing.*operations/i,
  ]
  return divideBy6Patterns.some((pattern) => pattern.test(fieldName))
}

export function isStringField(fieldName: string): boolean {
  const stringPatterns = [/stage of business.*next year/i, /how much time.*involved.*day to day/i]
  return stringPatterns.some((pattern) => pattern.test(fieldName))
}

// Create a more flexible field mapping function
export function getFlexibleTargetFieldMapping(): { [key: string]: string } {
  // Normalize both progress and target field names for matching
  const mappings = [
    {
      progress: "Total Sales for the month ( Without GST )",
      target: "Sales Target for 2025-26 ( Basic value without GST )",
    },
    {
      progress:
        "Total Gross Profit for the month ( Sales minus Cost of Goods sold ( Cost of Goods sold = Product cost only ) Do not include Wages, Salaries, Packing, Logistics on Sales etc in cost of Goods sold ( for this form only ) )",
      target: "Gross Profit for 2025-26 ( In Value only )",
    },
    {
      progress:
        "Total Net Profit for the month ( Gross Profit less all expenses of the company including fixed expenses and variable expenses )",
      target: "Net Profit for 2025-26 ( In Value only )",
    },
    {
      progress:
        "Total Debt as on Date ( Includes CC or OD limit with bank, Personal Loans, Business Loans etc ) Does NOT Include Home or Car loan outstanding",
      target: "CC + Debt balance should below Rs. ___________ by end of 2025-26 ?",
    },
    {
      progress: "Total Outstanding as on Date with Customers ( only the invoices value which have crossed due dates )",
      target: "Outstanding Amount should be below Rs. _________ by end of 2025-26 ?",
    },
    {
      progress: "Total Number of team members",
      target:
        "Total Number of team members in Sales, Marketing, Operations, HR, Accounts, R&D and Management ( Managers only )",
    },
    {
      progress: "Time involvement in Day to day operations",
      target: "How much time would you like to be involved in Day to day operations",
    },
    {
      progress: "What stage of the business are you in today",
      target: "Stage of business by next year you would want to be in ?",
    },
  ]

  const normalizedMapping: { [key: string]: string } = {}
  mappings.forEach(({ progress, target }) => {
    normalizedMapping[normalizeFieldName(progress)] = target
  })

  return normalizedMapping
}

// Create a function to find matching target field from onboarding data
export function findMatchingTargetField(progressField: string, onboardingFields: string[]): string | null {
  const normalizedMapping = getFlexibleTargetFieldMapping()
  const normalizedProgressField = normalizeFieldName(progressField)

  // First try exact normalized match
  const exactTarget = normalizedMapping[normalizedProgressField]
  if (exactTarget) {
    // Find the actual field name in onboarding data that matches this target
    const matchingField = onboardingFields.find(
      (field) => normalizeFieldName(field) === normalizeFieldName(exactTarget),
    )
    if (matchingField) {
      return matchingField
    }
  }

  // If no exact match, try fuzzy matching based on key terms
  const keyTermsMapping = [
    { progressTerms: ["total sales", "sales month"], targetTerms: ["sales target", "2025-26"] },
    { progressTerms: ["gross profit", "month"], targetTerms: ["gross profit", "2025-26"] },
    { progressTerms: ["net profit", "month"], targetTerms: ["net profit", "2025-26"] },
    { progressTerms: ["total debt", "date"], targetTerms: ["debt balance", "2025-26"] },
    { progressTerms: ["total outstanding", "customers"], targetTerms: ["outstanding amount", "2025-26"] },
    { progressTerms: ["total number", "team members"], targetTerms: ["team members", "sales", "marketing"] },
    { progressTerms: ["time involvement", "day to day"], targetTerms: ["time", "involved", "day to day"] },
    { progressTerms: ["stage", "business", "today"], targetTerms: ["stage", "business", "next year"] },
  ]

  const normalizedProgress = normalizeFieldName(progressField)

  for (const { progressTerms, targetTerms } of keyTermsMapping) {
    const progressMatch = progressTerms.every((term) => normalizedProgress.includes(term))

    if (progressMatch) {
      const matchingField = onboardingFields.find((field) => {
        const normalizedField = normalizeFieldName(field)
        return targetTerms.every((term) => normalizedField.includes(term))
      })

      if (matchingField) {
        return matchingField
      }
    }
  }

  return null
}

// Update the field matching logic to only match the 8 specific field pairs

export function getTargetFieldMapping(): { [progressField: string]: string } {
  return {
    "Total Sales for the month ( Without GST )": "Sales Target for 2025-26 ( Basic value without GST )",
    "Total Gross Profit for the month ( Sales minus Cost of Goods sold ( Cost of Goods sold = Product cost only ) Do not include Wages, Salaries, Packing, Logistics on Sales etc in cost of Goods sold ( for this form only ) )":
      "Gross Profit for 2025-26 ( In Value only )",
    "Total Net Profit for the month ( Gross Profit less all expenses of the company including fixed expenses and variable expenses )":
      "Net Profit for 2025-26 ( In Value only )",
    "Total Debt as on Date ( Includes CC or OD limit with bank, Personal Loans, Business Loans etc ) Does NOT Include Home or Car loan outstanding":
      "CC + Debt balance should below Rs. ___________ by end of 2025-26 ?",
    "Total Outstanding as on Date with Customers ( only the invoices value which have crossed due dates )":
      "Outstanding Amount should be below Rs. _________ by end of 2025-26 ?",
    "Total Number of team members":
      "Total Number of team members in Sales, Marketing, Operations, HR, Accounts, R&D and Management ( Managers only )",
    "Time involvement in Day to day operations": "How much time would you like to be involved in Day to day operations",
    "What stage of the business are you in today": "Stage of business by next year you would want to be in ?",
  }
}

export function getLastSixMonths(months: string[]): string[] {
  const sortedMonths = months.sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime() // Most recent first
  })
  return sortedMonths.slice(0, 6) // Take first 6 (most recent)
}

export function calculateTotal(data: { [month: string]: string }, months: string[], fieldName: string): string {
  // For string mode fields, calculate mode or latest
  if (isStringModeField(fieldName)) {
    return calculateModeOrLatest(data, months)
  }

  // For numeric fields, sum them up
  let total = 0
  let hasNumericData = false

  months.forEach((month) => {
    const value = data[month]
    if (value && value !== "-") {
      const numValue = Number.parseFloat(String(value).replace(/[^0-9.-]/g, ""))
      if (!isNaN(numValue)) {
        total += numValue
        hasNumericData = true
      }
    }
  })

  return hasNumericData ? total.toLocaleString() : "-"
}

export function calculateModeOrLatest(data: { [month: string]: string }, months: string[]): string {
  const values: string[] = []
  const valuesByMonth: { [month: string]: string } = {}

  // Collect all non-empty values and track by month
  months.forEach((month) => {
    const value = data[month]
    if (value && value !== "-") {
      values.push(value)
      valuesByMonth[month] = value
    }
  })

  if (values.length === 0) return "-"

  // Count frequency of each value
  const frequency: { [value: string]: number } = {}
  values.forEach((value) => {
    frequency[value] = (frequency[value] || 0) + 1
  })

  // Find the maximum frequency
  const maxFreq = Math.max(...Object.values(frequency))

  // Get all values with maximum frequency
  const mostFrequentValues = Object.keys(frequency).filter((value) => frequency[value] === maxFreq)

  // If there's only one most frequent value, return it
  if (mostFrequentValues.length === 1) {
    return mostFrequentValues[0]
  }

  // If there's a tie, return the most recent value among the tied values
  // Go through months from most recent to oldest
  for (const month of months) {
    const value = valuesByMonth[month]
    if (value && mostFrequentValues.includes(value)) {
      return value
    }
  }

  // Fallback to the first most frequent value
  return mostFrequentValues[0]
}

export function isStringModeField(fieldName: string): boolean {
  const stringModePatterns = [
    "Time involvement in Day to day operations",
    "What stage of the business are you in today",
  ]
  return stringModePatterns.some((pattern) => fieldName.includes(pattern))
}

export function calculateTarget(value: string, fieldName: string): { monthly: string; sixMonth: string } {
  if (!value || value === "-" || isStringField(fieldName)) {
    return { monthly: value || "-", sixMonth: value || "-" }
  }

  const numValue = Number.parseFloat(String(value).replace(/[^0-9.-]/g, ""))
  if (isNaN(numValue)) {
    return { monthly: value, sixMonth: value }
  }

  let monthly = numValue
  let sixMonth = numValue

  if (shouldDivideBy12(fieldName)) {
    monthly = numValue / 12
  }

  if (shouldDivideBy6(fieldName)) {
    sixMonth = numValue / 2
  }

  return {
    monthly: monthly.toLocaleString(),
    sixMonth: sixMonth.toLocaleString(),
  }
}

// Update the createPivotTable function to use flexible matching
export function createPivotTable(rawData: ProgressItem[], onboardingData: OnboardingItem[]): PivotTableData {
  if (!rawData || rawData.length === 0) {
    return { months: [], metrics: [], data: {}, targets: {} }
  }

  // Get all unique field names from progress data
  const allFields = new Set<string>()
  rawData.forEach((row) => {
    Object.keys(row).forEach((key) => allFields.add(key))
  })

  // Find the month column
  let monthColumn = ""
  for (const field of allFields) {
    if (/month/i.test(field)) {
      monthColumn = field
      break
    }
  }

  // Get unique months and limit to last 6 (most recent first)
  const allMonths = [...new Set(rawData.map((row) => row[monthColumn] || "").filter(Boolean))]
  const months = getLastSixMonths(allMonths)

  // Get metric columns (exclude goals, personal info, and timestamp)
  const metrics = Array.from(allFields).filter(
    (field) => !isExcludedField(field) && !isGoalField(field) && field !== monthColumn,
  )

  // Create pivot data structure
  const pivotData: { [metric: string]: { [month: string]: string } } = {}
  metrics.forEach((metric) => {
    pivotData[metric] = {}
    months.forEach((month) => {
      const matchingRow = rawData.find((row) => row[monthColumn] === month)
      pivotData[metric][month] = matchingRow?.[metric] || "-"
    })
  })

  // Extract targets from onboarding data using flexible field matching
  const targets: { [metric: string]: { monthly: string; sixMonth: string; total: string } } = {}

  if (onboardingData && onboardingData.length > 0) {
    const onboardingRow = onboardingData[0]
    const onboardingFields = Object.keys(onboardingRow)

    console.log("Available progress fields:", metrics)
    console.log("Available onboarding fields:", onboardingFields)

    metrics.forEach((progressField) => {
      const matchingTargetField = findMatchingTargetField(progressField, onboardingFields)

      console.log(`Progress field: "${progressField}"`)
      console.log(`Matched target field: "${matchingTargetField}"`)
      console.log(`Target value:`, matchingTargetField ? onboardingRow[matchingTargetField] : "Not found")

      if (matchingTargetField && onboardingRow[matchingTargetField] !== undefined) {
        const targetCalc = calculateTarget(onboardingRow[matchingTargetField], matchingTargetField)
        const total = calculateTotal(pivotData[progressField] || {}, months, progressField)

        targets[progressField] = {
          monthly: targetCalc.monthly,
          sixMonth: targetCalc.sixMonth,
          total: total,
        }
      } else {
        // No target available for this field
        targets[progressField] = {
          monthly: "-",
          sixMonth: "-",
          total: calculateTotal(pivotData[progressField] || {}, months, progressField),
        }
      }
    })
  }

  console.log("Final targets:", targets)

  return {
    months,
    metrics,
    data: pivotData,
    targets,
  }
}

// Add back the function to extract goals with monthly data
export function extractGoalsFromOnboarding(onboardingData: OnboardingItem[]): { goals: any[] } {
  if (!onboardingData || onboardingData.length === 0) {
    return { goals: [] }
  }

  const onboardingRow = onboardingData[0] // Assuming single onboarding record
  const goalFields = Object.keys(onboardingRow).filter(
    (field) => /goal\s*no\s*\d+/i.test(field) && !field.includes("Progress"),
  )

  const goals = goalFields.map((field) => {
    const goalValue = onboardingRow[field] || "Not set"
    return {
      name: goalValue, // Use the actual goal content as the name (e.g., "Weight 60 Kg")
      originalField: field,
      value: goalValue,
    }
  })

  return { goals }
}

// Add function to extract goals with monthly progress data
export function extractGoalsWithProgress(rawData: ProgressItem[]): { goals: any[]; months: string[] } {
  if (!rawData || rawData.length === 0) {
    return { goals: [], months: [] }
  }

  const monthColumn = Object.keys(rawData[0]).find((key) => /month/i.test(key)) || ""
  const months = getLastSixMonths([...new Set(rawData.map((row) => row[monthColumn] || "").filter(Boolean))])
  const goalFields = Object.keys(rawData[0]).filter(isGoalField)

  const goals = goalFields.map((field) => ({
    name: cleanFieldName(field),
    originalField: field,
    data: months.reduce(
      (acc, month) => {
        const matchingRow = rawData.find((row) => row[monthColumn] === month)
        acc[month] = matchingRow?.[field] || "-"
        return acc
      },
      {} as { [month: string]: string },
    ),
  }))

  return { goals, months }
}

export function formatValue(value: any): React.ReactNode {
  if (!value || value === "-") return "-"

  const stringValue = String(value)

  // Check for positive/negative indicators
  if (/positive/i.test(stringValue)) {
    return React.createElement(
      "span",
      { className: "px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs" },
      stringValue
    )
  }

  if (/negative/i.test(stringValue)) {
    return React.createElement(
      "span",
      { className: "px-2 py-1 bg-red-100 text-red-800 rounded-md text-xs" },
      stringValue
    )
  }

  return stringValue
}
