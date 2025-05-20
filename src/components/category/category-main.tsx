"use client";

import { Pen, Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const CategoriesMain = () => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button className="cursor-pointer">
          <Plus />
          Category
        </Button>
      </div>
      <div className="border rounded-md">
        <Table className="">
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>ID</TableHead>
              <TableHead className="min-w-[250px]">Category</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="h-14">
              <TableCell>1</TableCell>
              <TableCell>T-shirt</TableCell>
              <TableCell>Men</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>1</TableCell>
              <TableCell>05/20/2025</TableCell>
              <TableCell>
                <div className="flex items-center justify-end">
                  <Pen className="w-4 h-4" />
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="h-14">
              <TableCell>1</TableCell>
              <TableCell>T-shirt</TableCell>
              <TableCell>Men</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>1</TableCell>
              <TableCell>05/20/2025</TableCell>
              <TableCell>
                <div className="flex items-center justify-end">
                  <Pen className="w-4 h-4" />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default CategoriesMain;
