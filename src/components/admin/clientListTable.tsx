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
import { dummyUsers } from "@/lib/data";

const ITEMS_PER_PAGE = 10;

export function ClientList() {
  const { users, loading } = useUserContext();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // const users = dummyUsers

  // const nonAdminUsers = users.filter(
  //   (user) => (user["role"] || "").toLowerCase() !== "admin"
  // );
  const nonAdminUsers = users.filter(
    (user) =>
      (user["role"] || "").toLowerCase() !== "admin" &&
      user["Email Address"] !== ""
  );

  const filteredUsers = nonAdminUsers.filter((user) =>
    Object.values(user).some((value) =>
      value?.toLowerCase?.().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="pl-10 w-full max-w-sm"
          />
        </div>

        <div className="rounded-md border w-full overflow-x-auto">
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
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, i) => (
                  <TableRow key={i}>
                    {headers.map((key) => (
                      <TableCell key={key}>{user[key]}</TableCell>
                    ))}
                    <TableCell>
                      <Button asChild variant="outline" size="sm">
                        <Link
                          href={`/admin-dashboard/client/${user["Email Address"]}`}
                          target="_blank"
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
