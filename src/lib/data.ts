export type Goal = {
  id: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Not Started';
  deadline: string;
};

export type Progress = {
  id: string;
  month: string;
  metric: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
};

export type LeaderboardUser = {
  rank: number;
  name: string;
  progress: number;
  avatar: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  type: 'Individual' | 'Corporate' | 'Team';
  avatar: string;
  goals: Goal[];
  progress: Progress[];
};

export const goalsData: Goal[] = [
  { id: 'g1', description: 'Complete Q2 Project Alpha', status: 'Completed', deadline: '2024-06-30' },
  { id: 'g2', description: 'Onboard 5 new team members', status: 'In Progress', deadline: '2024-07-15' },
  { id: 'g3', description: 'Increase user engagement by 15%', status: 'In Progress', deadline: '2024-08-01' },
  { id: 'g4', description: 'Develop new reporting feature', status: 'Not Started', deadline: '2024-09-01' },
  { id: 'g5', description: 'Finalize 2025 budget proposal', status: 'Not Started', deadline: '2024-08-20' },
];

export const progressData: Progress[] = [
  { id: 'p1', month: 'January', metric: 'Tasks Completed', value: 45, change: 5, changeType: 'increase' },
  { id: 'p2', month: 'February', metric: 'Tasks Completed', value: 52, change: 7, changeType: 'increase' },
  { id: 'p3', month: 'March', metric: 'Tasks Completed', value: 60, change: 8, changeType: 'increase' },
  { id: 'p4', month: 'April', metric: 'Tasks Completed', value: 55, change: -5, changeType: 'decrease' },
  { id: 'p5', month: 'May', metric: 'Tasks Completed', value: 65, change: 10, changeType: 'increase' },
  { id: 'p6', month: 'June', metric: 'Tasks Completed', value: 72, change: 7, changeType: 'increase' },
];

export const leaderboardData: LeaderboardUser[] = [
  { rank: 1, name: 'Alex Thompson', progress: 98, avatar: 'https://placehold.co/100x100.png' },
  { rank: 2, name: 'Samantha Carter', progress: 95, avatar: 'https://placehold.co/100x100.png' },
  { rank: 3, name: 'Benjamin Miles', progress: 92, avatar: 'https://placehold.co/100x100.png' },
  { rank: 4, name: 'Olivia Chen', progress: 89, avatar: 'https://placehold.co/100x100.png' },
  { rank: 5, name: 'You', progress: 85, avatar: 'https://placehold.co/100x100.png' },
  { rank: 6, name: 'Daniel Jackson', progress: 82, avatar: 'https://placehold.co/100x100.png' },
];

export const clientsData: Client[] = [
  { id: '1', name: 'Alex Thompson', email: 'alex.t@example.com', type: 'Individual', avatar: 'https://placehold.co/100x100.png', goals: goalsData, progress: progressData },
  { id: '2', name: 'Samantha Carter', email: 'sam.c@example.com', type: 'Corporate', avatar: 'https://placehold.co/100x100.png', goals: [...goalsData].reverse(), progress: progressData.map(p => ({...p, value: p.value - 5})) },
  { id: '3', name: 'Benjamin Miles', email: 'ben.m@example.com', type: 'Team', avatar: 'https://placehold.co/100x100.png', goals: goalsData.slice(0, 3), progress: progressData.map(p => ({...p, value: p.value + 2})) },
  { id: '4', name: 'Olivia Chen', email: 'olivia.c@example.com', type: 'Individual', avatar: 'https://placehold.co/100x100.png', goals: goalsData.slice(1,4), progress: progressData.map(p => ({...p, value: p.value - 10})) },
  { id: '5', name: 'Daniel Jackson', email: 'daniel.j@example.com', type: 'Corporate', avatar: 'https://placehold.co/100x100.png', goals: goalsData, progress: progressData.map(p => ({...p, value: p.value + 5})) },
  { id: '6', name: 'InovaTech Inc.', email: 'contact@inovatech.com', type: 'Corporate', avatar: 'https://placehold.co/100x100.png', goals: goalsData, progress: progressData },
  { id: '7', name: 'Quantum Leap Co.', email: 'support@quantumleap.com', type: 'Corporate', avatar: 'https://placehold.co/100x100.png', goals: goalsData.slice(2,5), progress: progressData },
  { id: '8', name: 'Nexus Solutions', email: 'hello@nexussolutions.dev', type: 'Team', avatar: 'https://placehold.co/100x100.png', goals: goalsData, progress: progressData.map(p => ({...p, value: p.value - 2})) },
];


export const dummyUsers = Array.from({ length: 35 }).map((_, i) => ({
  "Timestamp": `2025-07-0${(i % 9) + 1} 10:0${i % 5}`,
  "Name": `Client ${i + 1}`,
  "Email Address": `client${i + 1}@example.com`,
  "Phone Number": `98765432${(i % 10).toString().padStart(2, "0")}`,
  "Age": `${20 + (i % 10)}`,
  "City": ["Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata"][i % 5],
  "Feedback": ["Great", "Good", "Average", "Poor", "Excellent"][i % 5],
  "role": "client", // All are clients
}));

export const getClientById = (id: string) => clientsData.find(client => client.id === id);
