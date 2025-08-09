"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UserTable } from "@/app/data/admin/get-all-users";
import { RoleSelect } from "./_components/row-select";
import { DeleteUserButton } from "./_components/delete-user";


export const columns: ColumnDef<UserTable>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "enrolleeId", header: "Enrollee ID" },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <RoleSelect user={row.original} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DeleteUserButton userId={row.original.id} />,
  },
];
