"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload, MultiImageUpload } from "@/components/ui/image-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { SearchInput } from "@/components/ui/search-input";
import { FilterBar, FilterConfig } from "@/components/ui/filter-bar";
import { useToast } from "@/hooks/use-toast";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DemoItem {
  id: string;
  name: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
}

const demoData: DemoItem[] = [
  { id: "1", name: "Item 1", status: "active", createdAt: "2024-01-01" },
  { id: "2", name: "Item 2", status: "inactive", createdAt: "2024-01-02" },
  { id: "3", name: "Item 3", status: "pending", createdAt: "2024-01-03" },
];

export default function DemoPage() {
  const { toast } = useToast();
  const [image, setImage] = React.useState("");
  const [images, setImages] = React.useState<string[]>([]);
  const [content, setContent] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<Record<string, string>>({});

  const columns: ColumnDef<DemoItem>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              status === "active"
                ? "bg-green-100 text-green-800"
                : status === "inactive"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      key: "status",
      label: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Pending", value: "pending" },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Component Demo</h1>
        <p className="text-muted-foreground">
          Testing all new shadcn/ui components and features
        </p>
      </div>

      {/* Toast Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Toast Notifications</CardTitle>
          <CardDescription>Test different toast variants</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            onClick={() =>
              toast({
                title: "Success!",
                description: "Your changes have been saved.",
                variant: "success",
              })
            }
          >
            Success Toast
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              toast({
                title: "Error!",
                description: "Something went wrong.",
                variant: "destructive",
              })
            }
          >
            Error Toast
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast({
                title: "Info",
                description: "This is an informational message.",
              })
            }
          >
            Info Toast
          </Button>
        </CardContent>
      </Card>

      {/* Image Upload Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Image Upload</CardTitle>
          <CardDescription>Single and multiple image upload with preview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Single Image</Label>
            <ImageUpload value={image} onChange={setImage} />
          </div>
          <div>
            <Label>Multiple Images (max 5)</Label>
            <MultiImageUpload value={images} onChange={setImages} maxImages={5} />
          </div>
        </CardContent>
      </Card>

      {/* Rich Text Editor Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Rich Text Editor</CardTitle>
          <CardDescription>TipTap editor with full formatting options</CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Start writing your content here..."
          />
        </CardContent>
      </Card>

      {/* Search & Filter Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
          <CardDescription>Debounced search with filter options</CardDescription>
        </CardHeader>
        <CardContent>
          <FilterBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search items..."
            filters={filterConfig}
            filterValues={filters}
            onFilterChange={(key, value) =>
              setFilters((prev) => ({ ...prev, [key]: value }))
            }
            onClearAll={() => setFilters({})}
          />
        </CardContent>
      </Card>

      {/* DataTable Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Data Table</CardTitle>
          <CardDescription>
            Advanced table with sorting, filtering, and pagination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={demoData} searchKey="name" />
        </CardContent>
      </Card>
    </div>
  );
}
