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

interface ProgressGoalsProps {
  progress: ProgressItem[];
  onboarding: OnboardingItem[];
}

// Update the component to use both onboarding goals and progress goals
export function ProgressGoals({ progress, onboarding }: ProgressGoalsProps) {
  console.log("Progress data", progress);
  console.log("Onboarding data", onboarding);

  const pivotTable = createPivotTable(progress, onboarding);
  const { goals: onboardingGoals } = extractGoalsFromOnboarding(onboarding);
  const { goals: progressGoals, months: goalMonths } =
    extractGoalsWithProgress(progress);

  // Combine goals - use onboarding goals as titles but progress data for monthly tracking
  const combinedGoals = progressGoals.map((progressGoal, index) => ({
    name: onboardingGoals[index]?.value || progressGoal.name, // Use onboarding goal content as title
    data: progressGoal.data,
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
                                return (
                                  <TableCell
                                    key={`${metric}-${month}`}
                                    className={`text-center p-2 w-[${Math.floor(
                                      39 / pivotTable.months.length
                                    )}%] ${
                                      monthIndex < pivotTable.months.length - 1
                                        ? "border-r"
                                        : ""
                                    }`}
                                  >
                                    <CustomTooltip content={cellValue}>
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
                              <TableCell className="text-center p-2 border-r bg-green-50/50 w-[12%]">
                                <CustomTooltip
                                  content={targetData?.total || "-"}
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

        <TabsContent value="goals" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
