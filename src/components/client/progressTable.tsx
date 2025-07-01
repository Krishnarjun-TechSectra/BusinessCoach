"use client"

import type React from "react"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Calendar, Building2 } from "lucide-react"

interface ProgressItem {
  [key: string]: any
}

interface PivotTableData {
  months: string[]
  metrics: string[]
  data: { [metric: string]: { [month: string]: string } }
}

function cleanFieldName(fieldName: string): string {
  // Remove content within brackets/parentheses and clean up
  return fieldName
    .replace(/\s*$$[^)]*$$/g, "") // Remove content in parentheses
    .replace(/\s*\[[^\]]*\]/g, "") // Remove content in square brackets
    .replace(/\s*\{[^}]*\}/g, "") // Remove content in curly brackets
    .trim()
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
}

function isGoalField(fieldName: string): boolean {
  return /goal\s*no\s*\d+/i.test(fieldName)
}

function isExcludedField(fieldName: string): boolean {
  const excludePatterns = [/timestamp/i, /email/i, /mail/i, /id/i, /name/i, /company/i]
  return excludePatterns.some((pattern) => pattern.test(fieldName))
}

function getLastSixMonths(months: string[]): string[] {
  // Sort months and return last 6
  const sortedMonths = months.sort((a, b) => {
    // Basic month sorting - you might want to improve this based on your date format
    return new Date(a).getTime() - new Date(b).getTime()
  })
  return sortedMonths.slice(-6)
}

function createPivotTable(rawData: ProgressItem[]): PivotTableData {
  if (!rawData || rawData.length === 0) {
    return { months: [], metrics: [], data: {} }
  }

  // Get all unique field names from the data
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

  // Get unique months and limit to last 6
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

  return {
    months,
    metrics,
    data: pivotData,
  }
}

function extractGoalsData(rawData: ProgressItem[]): { goals: any[]; months: string[] } {
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

function formatValue(value: any): React.ReactNode {
  if (!value || value === "-") return "-"

  // Convert value to string to ensure we can use string methods
  const stringValue = String(value)

  // Check for positive/negative indicators
  if (/positive/i.test(stringValue)) {
    return <Badge variant="outline">{stringValue}</Badge>
  }
  if (/negative/i.test(stringValue)) {
    return <Badge variant="outline">{stringValue}</Badge>
  }

  return stringValue
}

// Custom Tooltip Component
function CustomTooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    })
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  return (
    <>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="cursor-help">
        {children}
      </div>
      {isVisible && (
        <div
          className="fixed z-50 px-3 py-2 text-sm text-white bg-black rounded-md shadow-lg pointer-events-none break-words"
          style={{
            left: position.x,
            top: position.y,
            transform: "translateX(-50%) translateY(-100%)",
          }}
        >
          {content}
        </div>
      )}
    </>
  )
}

export function ProgressGoals({ progress }: { progress: ProgressItem[] }) {
  console.log("Progress data", progress);
  const pivotTable = createPivotTable(progress)
  const { goals: extractedGoals, months: goalMonths } = extractGoalsData(progress)

  return (
    <div className="w-full  mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Business Dashboard</h2>
      </div>

      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Goals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Monthly Progress Overview
                </CardTitle>
                <Badge variant="outline">{pivotTable.months.length} months</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {pivotTable.metrics.length > 0 ? (
                <div className="rounded-lg border w-full">
                  <Table className="w-full table-fixed">
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold w-[40%] border-r">Metric</TableHead>
                        {pivotTable.months.map((month, index) => (
                          <TableHead
                            key={month}
                            className={`text-center font-semibold ${
                              index < pivotTable.months.length - 1 ? "border-r" : ""
                            }`}
                            style={{ width: `${60 / pivotTable.months.length}%` }}
                          >
                            <CustomTooltip content={month}>
                              <div className="truncate">{month}</div>
                            </CustomTooltip>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pivotTable.metrics.map((metric, index) => (
                        <TableRow key={metric} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                          <TableCell className="font-medium bg-background border-r w-[40%] p-2">
                            <CustomTooltip content={cleanFieldName(metric)}>
                              <div className="truncate text-sm">{cleanFieldName(metric)}</div>
                            </CustomTooltip>
                          </TableCell>
                          {pivotTable.months.map((month, monthIndex) => {
                            const cellValue = String(pivotTable.data[metric]?.[month] || "-")
                            return (
                              <TableCell
                                key={`${metric}-${month}`}
                                className={`text-center p-2 ${
                                  monthIndex < pivotTable.months.length - 1 ? "border-r" : ""
                                }`}
                                style={{ width: `${60 / pivotTable.months.length}%` }}
                              >
                                <CustomTooltip content={cellValue}>
                                  <div className="truncate text-sm">
                                    {formatValue(pivotTable.data[metric]?.[month] || "-")}
                                  </div>
                                </CustomTooltip>
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No progress data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Goals Tracking
                </CardTitle>
                <Badge variant="outline">{extractedGoals.length} goals</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {extractedGoals.length > 0 ? (
                <div className="space-y-4">
                  {extractedGoals.map((goal, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {goalMonths.map((month) => (
                            <div key={month} className="p-3 rounded-lg bg-muted/30 border">
                              <div className="text-sm font-medium text-muted-foreground mb-1">{month}</div>
                              <CustomTooltip content={goal.data[month] || "Not set"}>
                                <div className="font-semibold truncate">{goal.data[month] || "Not set"}</div>
                              </CustomTooltip>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No goals data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
