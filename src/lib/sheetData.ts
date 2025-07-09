// lib/sheetData.ts
interface SheetUser {
  [key: string]: string;
}
export interface ProgressItem {
  [key: string]: string;
}

export interface GoalItem {
  [key: string]: string;
}

export interface ProcessedData {
  progress: ProgressItem[];
  goals: GoalItem[];
}

export interface OnboardingItems {
  [key: string]: string;
}

export async function fetchAllUsersFromSheet(): Promise<SheetUser[]> {
  try {
    const response = await fetch(
      `${process.env.GOOGLE_APPS_SCRIPT_URL}?action=getAllUsers`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch users from sheet");
    }

    const data = await response.json();

    if (!data.users || !Array.isArray(data.users)) {
      throw new Error("Invalid response format from sheet");
    }

    return data.users;
  } catch (error) {
    console.error("[SheetData] fetchAllUsersFromSheet error:", error);
    throw error;
  }
}

// export async function fetchMonthlyDataByEmail(email: string) {
//   try {
//     const response = await fetch(
//       `${process.env.GOOGLE_APPS_SCRIPT_URL}?action=getMonthlyDataByEmail&email=${encodeURIComponent(email)}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Failed to fetch monthly data");
//     }

//     const data = await response.json();

//     if (!data.progress || !data.goals) {
//       throw new Error("Invalid format returned from Apps Script");
//     }

//     return data;
//   } catch (error) {
//     console.error("[SheetData] fetchMonthlyDataByEmail error:", error);
//     throw new Error("Failed to load data");
//   }
// }

export async function fetchOnboardingByEmail(
  email: string
): Promise<OnboardingItems> {
  try {
    const response = await fetch(
      `${
        process.env.GOOGLE_APPS_SCRIPT_URL
      }?action=getOnboarding&email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        credentials: "omit",
      }
    );

    if (response.status === 302) {
      const redirectUrl = response.headers.get("location") ?? "unknown";
      throw new Error(
        [
          "Google Apps Script responded with HTTP 302 (redirect).",
          "This typically means the Web App needs to be deployed with",
          'access level set to **"Anyone (anonymous)"**.',
          `Redirect target: ${redirectUrl}`,
        ].join(" ")
      );
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }

    return {
      user: result.data,
    };
  } catch (error) {
    console.error("[SheetData] fetchOnboardingByEmail error:", error);
    throw error;
  }
}

export async function fetchMonthlyDataByEmail(
  email: string
): Promise<ProgressItem> {
  try {
    const response = await fetch(
      `${
        process.env.GOOGLE_APPS_SCRIPT_URL
      }?action=getMonthlyDataByEmail&email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        credentials: "omit",
      }
    );

    // Handle Google Apps Script redirects that usually indicate
    // the Web App is not shared with “Anyone”.
    if (response.status === 302) {
      const redirectUrl = response.headers.get("location") ?? "unknown";
      throw new Error(
        [
          "Google Apps Script responded with HTTP 302 (redirect).",
          "This typically means the Web App needs to be deployed with",
          'access level set to **"Anyone" (anonymous)**.',
          `Redirect target: ${redirectUrl}`,
        ].join(" ")
      );
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }

    // Return the raw data directly - no processing needed
    return {
      progress: result.data,
    };
  } catch (error) {
    console.error("[SheetData] fetchMonthlyDataByEmail error:", error);
    throw error;
  }
}

export async function fetchLeaderboardByMonth(): Promise<
  { name: string; score: number }[]
> {
  try {
    const response = await fetch(
      `${process.env.GOOGLE_APPS_SCRIPT_URL}?action=getLeaderboard`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        credentials: "omit",
      }
    );

    if (response.status === 302) {
      const redirectUrl = response.headers.get("location") ?? "unknown";
      throw new Error(
        [
          "Google Apps Script responded with HTTP 302 (redirect).",
          "Ensure the Web App is deployed with access: Anyone (anonymous).",
          `Redirect target: ${redirectUrl}`,
        ].join(" ")
      );
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }

    return result.leaderboard || [];
  } catch (error) {
    console.error("[SheetData] fetchLeaderboardByMonth error:", error);
    throw error;
  }
}

export async function updateGoal({
  email,
  month,
  goalColumn,
  value,
}: {
  email: string;
  month: string;
  goalColumn: string;
  value: string;
}): Promise<{ success: boolean }> {
  const response = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "updateGoal", // ✅ Include this inside body
      email,
      month,
      goalColumn,
      value,
    }),
  });

  if (!response.ok)
    throw new Error(`Failed to update goal: ${response.statusText}`);

  const result = await response.json();

  if (result.error) throw new Error(result.error);

  return result;
}

