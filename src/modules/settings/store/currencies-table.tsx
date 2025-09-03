"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

type Currency = {
  code: string;
  name: string;
  taxInclusivePricing: boolean;
};

const DATA: Currency[] = [
  {
    code: "AED",
    name: "United Arab Emirates Dirham",
    taxInclusivePricing: true,
  },
  { code: "AFN", name: "Afghan Afghani", taxInclusivePricing: true },
  { code: "INR", name: "Indian Rupee", taxInclusivePricing: true },
];

function StatusDot({ on = true }: { on?: boolean }) {
  return (
    <span
      aria-label={on ? "true" : "false"}
      className={`inline-block h-2 w-2 rounded-full ${
        on ? "bg-green-500" : "bg-muted-foreground"
      }`}
    />
  );
}

export function CurrenciesTable() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DATA;
    return DATA.filter(
      (c) =>
        c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    );
  }, [query]);

  const allChecked =
    filtered.length > 0 && filtered.every((c) => selected[c.code]);
  const someChecked = filtered.some((c) => selected[c.code]) && !allChecked;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Currencies</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              aria-label="Search currencies"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 w-[220px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Table actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push("/settings/store/currencies")}
                className="cursor-pointer"
              >
                <Plus /> Add
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={allChecked}
                  onCheckedChange={(v) => {
                    const next = { ...selected };
                    filtered.forEach((c) => {
                      next[c.code] = Boolean(v);
                    });
                    setSelected(next);
                  }}
                  aria-checked={
                    allChecked ? "true" : someChecked ? "mixed" : "false"
                  }
                />
              </TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Tax inclusive pricing</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.code} data-code={c.code}>
                <TableCell className="w-10">
                  <Checkbox
                    checked={!!selected[c.code]}
                    onCheckedChange={(v) =>
                      setSelected((s) => ({ ...s, [c.code]: Boolean(v) }))
                    }
                    aria-label={`Select ${c.code}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{c.code}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <StatusDot on={c.taxInclusivePricing} />
                    <span>True</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Actions for ${c.code}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => alert(`Edit ${c.code}`)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => alert(`Delete ${c.code}`)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No currencies found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between px-6 py-3 text-sm text-muted-foreground">
          <span>
            {filtered.length > 0
              ? `1 — ${filtered.length} of ${filtered.length} results`
              : "0 results"}
          </span>
          <div className="flex items-center gap-4">
            <span>1 of 1 pages</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" disabled>
                Prev
              </Button>
              <Button variant="ghost" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
