"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useUserContext } from "@/context/userContext";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export function ClientList() {
  const { users, loading } = useUserContext();
  const [search, setSearch] = useState("");

  // const filteredUsers = users.filter((user) =>
  //   Object.values(user).some((value) =>
  //     value?.toLowerCase?.().includes(search.toLowerCase())
  //   )
  // );
  const filteredUsers = users
  .filter((user) => (user["role"] || "").toLowerCase() !== "admin") // Exclude admins
  .filter((user) =>
    Object.values(user).some((value) =>
      value?.toLowerCase?.().includes(search.toLowerCase())
    )
  );


  // Only use headers at indexes 1, 2, 3, 7
  const rawHeaders = users.length > 0 ? Object.keys(users[0]) : [];
  const selectedHeaderIndexes = [1, 2, 3, 7];
  const headers = selectedHeaderIndexes
    .filter((i) => i < rawHeaders.length)
    .map((i) => rawHeaders[i]);

  if (loading) return <div>Loading users...</div>;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search anything..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full max-w-sm"
          />
        </div>

        <div className="rounded-md border w-full">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, i) => (
                  <TableRow key={i}>
                    {headers.map((key) => (
                      <TableCell key={key}>{user[key]}</TableCell>
                    ))}
                    <TableCell>
                      <Button asChild variant="outline" size="sm">
                        <Link
                          href={`/admin-dashboard/client/${user["Email Address"]}`}
                        >
                          View Dashboard
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={headers.length + 1}
                    className="text-center h-24"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
