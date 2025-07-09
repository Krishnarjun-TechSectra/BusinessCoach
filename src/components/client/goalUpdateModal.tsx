"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { PencilIcon, PlusIcon, Target } from "lucide-react";
// import CustomTooltip from "@/components/ui/tooltip"; // assuming you have this
import { useUpdateGoal } from "@/hooks/useUpdateGoals";
import { useAuth } from "@/context/authContext";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

// Props expected: combinedGoals: Goal[], goalMonths: string[]
export default function GoalsTab({
  combinedGoals,
  goalMonths,
  email,
}: {
  combinedGoals: any[];
  goalMonths: string[];
  email: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    month: "",
    goalColumn: "",
    value: "",
    currentValue: "",
    goalName: "",
  });

  const { updateGoal, loading } = useUpdateGoal();
  const { toast } = useToast();
  const router = useRouter();
  //   const { user } = useAuth();

  function openModal({
    month,
    goalColumn,
    currentValue,
    goalName,
  }: {
    month: string;
    goalColumn: string;
    currentValue: string;
    goalName: string;
  }) {
    setForm({
      month,
      goalColumn,
      currentValue,
      value: currentValue,
      goalName,
    });
    setIsModalOpen(true);
  }
  async function handleSubmit() {
    try {
      await updateGoal({
        email,
        month: form.month,
        goalColumn: form.goalColumn,
        value: form.value,
      });

      toast({
        title: "Goal updated",
        description:
          "Goal updated successfully.Refresh the page to see changes",
        variant: "success",
      });

      setIsModalOpen(false);
      router.refresh(); // ✅ refresh data
    } catch (err) {
      console.error("Update failed", err);

      toast({
        title: "Update failed",
        description:
          (err as Error).message ||
          "An error occurred while updating the goal.",
        variant: "destructive",
      });
    }
  }

  return (
    <>
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
                            className="p-3 rounded-lg bg-muted/30 border relative"
                          >
                            <div className="text-sm font-medium text-muted-foreground mb-1">
                              {month}
                            </div>
                            <div className="font-semibold truncate">
                              {goal.data[month] || "Not set"}
                            </div>
                            <button
                              onClick={() =>
                                openModal({
                                  month,
                                  goalName: goal.name,
                                  goalColumn: goal.fieldName,
                                  currentValue: goal.data[month] || "",
                                })
                              }
                              className="absolute bottom-2 right-2 p-1 rounded-full hover:bg-muted transition"
                              title="Update goal"
                            >
                              <PencilIcon className="h-4 w-4 text-primary" />
                            </button>
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

      {/* 🔽 Modal for goal update */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Goal: {form.goalName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Month</div>
              <div className="font-semibold">{form.month}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Value</div>
              <Input
                value={form.value}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, value: e.target.value }))
                }
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Saving..." : "Update Goal"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
