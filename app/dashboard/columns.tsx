"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone_number: string;
  pain_quality: string;
  location: string;
  stress: string;
  sob: string;
  hypertension: string;
  hyperlipidemia: string;
  diabetes: string;
  smoking: string;
  probability: number;
};

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
  },
  {
    accessorKey: "pain_quality",
    header: "Pain Quality",
  },
  {
    accessorKey: "location",
    header: "Substernal?",
  },
  {
    accessorKey: "stress",
    header: "Stressed?",
  },
  {
    accessorKey: "sob",
    header: "Shortness of Breath?",
  },
  {
    accessorKey: "hypertension",
    header: "Hypertension?",
  },
  {
    accessorKey: "diabetes",
    header: "Diabetes?",
  },
  {
    accessorKey: "smoking",
    header: "Smoking?",
  },
  {
    accessorKey: "probability",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {" "}
          Risk Score{" "}
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("probability") as number;
      return `${value}%`;
    },
  },
];
