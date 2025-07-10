"use client";

import type React from "react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Calendar, Building2 } from "lucide-react";
import {
  type ProgressItem,
  type OnboardingItem,
  createPivotTable,
  extractGoalsFromOnboarding,
  extractGoalsWithProgress,
  formatValue,
  cleanFieldName,
} from "../shared/progressUtils";
import GoalsTab from "./goalUpdateModal";

// Custom Tooltip Component
function CustomTooltip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className="fixed z-50 px-3 py-2 text-sm text-white bg-black rounded-md shadow-lg pointer-events-none break-words "
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
  );
}
// Function to get ordinal value for time involvement (lower is better)
function getTimeInvolvementOrder(value: string): number {
  const timeOrder = {
    "less than 1 hour a day": 1,
    "2 to 4 hours a day": 2,
    "5 to 6 hours a day": 3,
    "7 to 8 hours a day": 4,
    "more than 9 hours a day": 5,
  };

  const normalizedValue = value.toLowerCase().trim();
  return timeOrder[normalizedValue as keyof typeof timeOrder] || 0;
}

// Function to get ordinal value for business stage (higher is better)
function getBusinessStageOrder(value: string): number {
  const stageOrder = {
    "challenge ( target audience is not defined )": 1,
    challenge: 1,
    "existence ( right product to right customer but inconsistent sales & marketing )": 2,
    existence: 2,
    "consistency ( right product to right customer and sales, marketing is consistent - mostly done by me )": 3,
    consistency: 3,
    "growth ( teams in operations, sales, marketing, accounts, hr, execution office of pc, sc and ea ) and my business has orders for the next 12 months.": 4,
    growth: 4,
    "success ( core team is running my business - ceo or executive assistant run the business )": 5,
    success: 5,
  };

  const normalizedValue = value.toLowerCase().trim();

  // Try exact match first
  if (stageOrder[normalizedValue as keyof typeof stageOrder]) {
    return stageOrder[normalizedValue as keyof typeof stageOrder];
  }

  // Try partial matches
  if (normalizedValue.includes("challenge")) return 1;
  if (normalizedValue.includes("existence")) return 2;
  if (normalizedValue.includes("consistency")) return 3;
  if (normalizedValue.includes("growth")) return 4;
  if (normalizedValue.includes("success")) return 5;

  return 0;
}

// Function to determine if a field uses reversed logic (lower is better)
function isReversedLogicField(fieldName: string): boolean {
  const reversedFields = [
    "Total Debt as on Date",
    "Total Outstanding as on Date with Customers",
    "debt",
    "outstanding",
    "Time involvement in Day to day operations",
  ];
  return reversedFields.some((field) =>
    fieldName.toLowerCase().includes(field.toLowerCase())
  );
}

// Function to determine if a field uses ordinal comparison
function isOrdinalField(fieldName: string): boolean {
  return (
    fieldName.toLowerCase().includes("time involvement") ||
    fieldName.toLowerCase().includes("stage of business") ||
    fieldName.toLowerCase().includes("stage of the business")
  );
}

// Function to check if target is achieved
function isTargetAchieved(
  actualValue: string,
  targetValue: string,
  fieldName: string
): boolean | null {
  if (
    !actualValue ||
    actualValue === "-" ||
    !targetValue ||
    targetValue === "-"
  ) {
    return null; // Cannot determine
  }

  // Handle ordinal fields (Time involvement and Business stage)
  if (isOrdinalField(fieldName)) {
    if (fieldName.toLowerCase().includes("time involvement")) {
      const actualOrder = getTimeInvolvementOrder(actualValue);
      const targetOrder = getTimeInvolvementOrder(targetValue);

      if (actualOrder === 0 || targetOrder === 0) return null;

      // For time involvement: lower order is better
      return actualOrder <= targetOrder;
    }

    if (fieldName.toLowerCase().includes("stage")) {
      const actualOrder = getBusinessStageOrder(actualValue);
      const targetOrder = getBusinessStageOrder(targetValue);

      if (actualOrder === 0 || targetOrder === 0) return null;

      // For business stage: higher order is better
      return actualOrder >= targetOrder;
    }
  }

  const actual = Number.parseFloat(
    String(actualValue).replace(/[^0-9.-]/g, "")
  );
  const target = Number.parseFloat(
    String(targetValue).replace(/[^0-9.-]/g, "")
  );

  if (isNaN(actual) || isNaN(target)) {
    return null;
  }

  const isReversed = isReversedLogicField(fieldName);

  if (isReversed) {
    // For debt/outstanding: lower is better
    return actual <= target;
  } else {
    // For sales/profit: higher is better
    return actual >= target;
  }
}

// Function to get cell background color based on target achievement
function getCellBackgroundColor(
  actualValue: string,
  targetValue: string,
  fieldName: string
): string {
  const achieved = isTargetAchieved(actualValue, targetValue, fieldName);

  if (achieved === null) {
    return ""; // No special background
  }

  return achieved ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200";
}

interface ProgressGoalsProps {
  progress: ProgressItem[];
  onboarding: OnboardingItem[];
  email: string;
}

// Update the component to use both onboarding goals and progress goals
export function ProgressGoals({
  progress,
  onboarding,
  email,
}: ProgressGoalsProps) {
  console.log("Progress data", progress);
  console.log("Onboarding data", onboarding);

  const pivotTable = createPivotTable(progress, onboarding);
  const { goals: onboardingGoals } = extractGoalsFromOnboarding(onboarding);
  const { goals: progressGoals, months: goalMonths } =
    extractGoalsWithProgress(progress);

  // console.log("Progresssssssssssss",progressGoals);
  // Combine goals - use onboarding goals as titles but progress data for monthly tracking
  const combinedGoals = progressGoals.map((progressGoal, index) => ({
    name: onboardingGoals[index]?.value || progressGoal.name, // Use onboarding goal content as title
    data: progressGoal.data,
    fieldName: progressGoal.originalField,
  }));

  return (
    <div className="w-full mx-auto space-y-6">
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
                <Badge variant="outline">
                  {pivotTable.months.length} months
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
                  <span>Target Achieved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
                  <span>Target Not Achieved</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {pivotTable.metrics.length > 0 ? (
                <div className="rounded-lg border w-full overflow-x-auto">
                  <div className="min-w-[1000px] sm:min-w-full">
                    <Table className="w-full table-fixed">
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold w-[25%] border-r sticky left-0 bg-muted/50">
                            Metric
                          </TableHead>
                          <TableHead className="text-center font-semibold w-[12%] border-r bg-yellow-50">
                            6 Month Target
                          </TableHead>
                          <TableHead className="text-center font-semibold w-[12%] border-r bg-yellow-50">
                            Monthly Target
                          </TableHead>

                          {pivotTable.months.map((month, index) => (
                            <TableHead
                              key={month}
                              className={`text-center font-semibold w-[${Math.floor(
                                39 / pivotTable.months.length
                              )}%] ${
                                index < pivotTable.months.length - 1
                                  ? "border-r"
                                  : ""
                              }`}
                            >
                              <CustomTooltip content={month}>
                                <div className="truncate">{month}</div>
                              </CustomTooltip>
                            </TableHead>
                          ))}
                          <TableHead className="text-center font-semibold w-[12%] border-r bg-green-50">
                            Total
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pivotTable.metrics.map((metric, index) => {
                          const cleanedMetric = cleanFieldName(metric);
                          const targetData = pivotTable.targets[metric]; // Use exact metric name

                          return (
                            <TableRow
                              key={metric}
                              className={index % 2 === 0 ? "bg-muted/20" : ""}
                            >
                              <TableCell className="font-medium bg-background border-r w-[25%] p-2 sticky left-0 ">
                                <CustomTooltip content={cleanedMetric}>
                                  <div className="truncate text-sm">
                                    {cleanedMetric}
                                  </div>
                                </CustomTooltip>
                              </TableCell>
                              <TableCell className="text-center p-2 border-r bg-yellow-50/50 w-[12%]">
                                <CustomTooltip
                                  content={targetData?.sixMonth || "-"}
                                >
                                  <div className="truncate text-sm font-medium">
                                    {targetData?.sixMonth || "-"}
                                  </div>
                                </CustomTooltip>
                              </TableCell>
                              <TableCell className="text-center p-2 border-r bg-yellow-50/50 w-[12%]">
                                <CustomTooltip
                                  content={targetData?.monthly || "-"}
                                >
                                  <div className="truncate text-sm font-medium">
                                    {targetData?.monthly || "-"}
                                  </div>
                                </CustomTooltip>
                              </TableCell>

                              {pivotTable.months.map((month, monthIndex) => {
                                const cellValue = String(
                                  pivotTable.data[metric]?.[month] || "-"
                                );
                                const monthlyTarget =
                                  targetData?.monthly || "-";
                                const backgroundColorClass =
                                  getCellBackgroundColor(
                                    cellValue,
                                    monthlyTarget,
                                    metric
                                  );
                                return (
                                  <TableCell
                                    key={`${metric}-${month}`}
                                    className={`text-center p-2 w-[${Math.floor(
                                      39 / pivotTable.months.length
                                    )}%] ${
                                      monthIndex < pivotTable.months.length - 1
                                        ? "border-r"
                                        : ""
                                    } ${backgroundColorClass}`}
                                  >
                                    <CustomTooltip
                                      content={`${cellValue} ${
                                        monthlyTarget !== "-"
                                          ? `(Target: ${monthlyTarget})`
                                          : ""
                                      }`}
                                    >
                                      <div className="truncate text-sm">
                                        {formatValue(
                                          pivotTable.data[metric]?.[month] ||
                                            "-"
                                        )}
                                      </div>
                                    </CustomTooltip>
                                  </TableCell>
                                );
                              })}
                              <TableCell
                                className={`text-center border-r w-[120px] lg:w-[150px] px-2 sm:px-4 py-2 ${getCellBackgroundColor(
                                  targetData?.total || "-",
                                  targetData?.sixMonth || "-",
                                  metric
                                )}`}
                              >
                                <CustomTooltip
                                  content={`${targetData?.total || "-"} ${
                                    targetData?.sixMonth !== "-"
                                      ? `(Target: ${targetData?.sixMonth})`
                                      : ""
                                  }`}
                                >
                                  <div className="truncate text-sm font-semibold text-green-700">
                                    {targetData?.total || "-"}
                                  </div>
                                </CustomTooltip>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
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

        {/* <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Goals Tracking
                </CardTitle>
                <Badge variant="outline">{combinedGoals.length} goals</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {combinedGoals.length > 0 ? (
                <div className="space-y-4">
                  {combinedGoals.map((goal, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {goalMonths.map((month) => (
                            <div
                              key={month}
                              className="p-3 rounded-lg bg-muted/30 border"
                            >
                              <div className="text-sm font-medium text-muted-foreground mb-1">
                                {month}
                              </div>
                              <CustomTooltip
                                content={goal.data[month] || "Not set"}
                              >
                                <div className="font-semibold truncate">
                                  {goal.data[month] || "Not set"}
                                </div>
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
        </TabsContent> */}
        <GoalsTab
          combinedGoals={combinedGoals}
          goalMonths={goalMonths}
          email={email}
        />
      </Tabs>
    </div>
  );
}
