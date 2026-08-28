import { useState, type ChangeEvent, type FormEvent } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PencilLine, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { ADMIN_MODULES, AdminShell } from "@/components/admin/AdminShell";
import { RecordForm } from "@/components/admin/RecordForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/date";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { adminDelete, adminList, adminUpdate } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/$module")({
  head: () => ({
    meta: [
      { title: "Manage Records | Hope Alliance Admin" },
      { name: "description", content: "Review and manage Hope Alliance records." },
      { property: "og:title", content: "Manage Records | Hope Alliance Admin" },
      { property: "og:description", content: "Internal record management." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ModulePage,
});

type Row = Record<string, unknown>;
type FieldType = "text" | "textarea" | "number" | "datetime-local" | "checkbox" | "image";

type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helper?: string;
};

type FormConfig = {
  singular: string;
  description: string;
  fields: FieldConfig[];
};

const HIDDEN = new Set(["id", "created_at", "updated_at", "content", "body"]);
const STATUS_SUBMITTED_TABLES = new Set([
  "event_registrations",
  "mentors",
  "prayer_requests",
  "volunteers",
]);

const FORM_CONFIG: Record<string, FormConfig> = {
  programs: {
    singular: "Program",
    description: "Create and update published programs for the public site.",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true, helper: "Used in URLs." },
      { name: "summary", label: "Summary", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "icon", label: "Icon", type: "text", required: true, placeholder: "graduation-cap" },
      {
        name: "image_url",
        label: "Image",
        type: "image",
        helper: "Browse from your computer to replace the image.",
      },
      { name: "sort_order", label: "Sort order", type: "number", required: true },
      { name: "published", label: "Published", type: "checkbox" },
    ],
  },
  events: {
    singular: "Event",
    description: "Create and update upcoming events for the public site.",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true, helper: "Used in URLs." },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "starts_at", label: "Starts at", type: "datetime-local", required: true },
      { name: "ends_at", label: "Ends at", type: "datetime-local" },
      {
        name: "image_url",
        label: "Image",
        type: "image",
        helper: "Browse from your computer to replace the image.",
      },
      { name: "capacity", label: "Capacity", type: "number" },
      { name: "published", label: "Published", type: "checkbox" },
    ],
  },
  blog_posts: {
    singular: "Blog post",
    description: "Create and update stories, insights and updates for the blog.",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true, helper: "Used in URLs." },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
      { name: "content", label: "Content", type: "textarea", required: true },
      { name: "category", label: "Category", type: "text", required: true },
      {
        name: "cover_image_url",
        label: "Cover image",
        type: "image",
        helper: "Browse from your computer to replace the cover image.",
      },
      { name: "author_name", label: "Author name", type: "text", required: true },
      { name: "published_at", label: "Published at", type: "datetime-local", required: true },
      { name: "published", label: "Published", type: "checkbox" },
    ],
  },
};

const APP_TABLE_LABELS: Record<string, string> = {
  event_registrations: "Submitted",
  mentors: "Submitted",
  prayer_requests: "Submitted",
  volunteers: "Submitted",
};

function ModulePage() {
  const { module } = Route.useParams();
  const config = ADMIN_MODULES.find((m) => m.slug === module);
  if (!config) throw notFound();

  const queryClient = useQueryClient();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Row | null>(null);

  const formConfig = FORM_CONFIG[config.table];
  const editable = Boolean(formConfig);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", config.table],
    queryFn: () => adminList<Row>(config.table, config.order),
  });

  const rows = data ?? [];
  const columns = rows[0]
    ? Object.keys(rows[0])
        .filter((k) => !HIDDEN.has(k))
        .slice(0, 6)
    : [];

  const remove = async (id: string) => {
    try {
      await adminDelete(config.table, id);
      await queryClient.invalidateQueries({ queryKey: ["admin", config.table] });
      toast.success("Record deleted.");
    } catch {
      toast.error("Could not delete this record.");
    }
  };

  const save = async (payload: Record<string, unknown>) => {
    if (!editingRow?.["id"]) return;

    try {
      await adminUpdate(config.table, String(editingRow["id"]), payload);
      toast.success(`${formConfig?.singular ?? config.label} updated.`);
      await queryClient.invalidateQueries({ queryKey: ["admin", config.table] });
      setEditorOpen(false);
      setEditingRow(null);
    } catch {
      toast.error("Could not save this record.");
    }
  };

  return (
    <AdminShell title={config.label}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">{config.label}</h2>
          {editable && formConfig ? (
            <p className="mt-1 text-sm text-muted-foreground">{formConfig?.description}</p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Review, delete and manage submitted records.
            </p>
          )}
        </div>

        {editable ? <RecordForm moduleSlug={config.slug} table={config.table} /> : null}
      </div>

      <Card className="overflow-hidden p-0 shadow-card">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="space-y-2 p-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No records yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((c) => (
                    <TableHead key={c} className="whitespace-nowrap capitalize">
                      {c.replace(/_/g, " ")}
                    </TableHead>
                  ))}
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, i) => (
                  <TableRow key={String(row["id"] ?? i)}>
                    {columns.map((c) => (
                      <TableCell key={c} className="max-w-[220px] truncate">
                        {formatCell(row[c], c, config.table)}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {editable && row["id"] ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Edit record"
                            onClick={() => {
                              setEditingRow(row);
                              setEditorOpen(true);
                            }}
                          >
                            <PencilLine className="size-4" />
                          </Button>
                        ) : null}
                        {row["id"] ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Delete record"
                            onClick={() => remove(String(row["id"]))}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      {editable && formConfig ? (
        <RecordEditor
          open={editorOpen}
          onOpenChange={(open) => {
            setEditorOpen(open);
            if (!open) setEditingRow(null);
          }}
          config={formConfig}
          row={editingRow}
          onSave={save}
        />
      ) : null}
    </AdminShell>
  );
}

function RecordEditor({
  open,
  onOpenChange,
  config,
  row,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: FormConfig;
  row: Row | null;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const isEdit = Boolean(row?.["id"]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const payload: Record<string, unknown> = {};
    for (const field of config.fields) {
      payload[field.name] = await readField(field, fd);
    }

    setBusy(true);
    try {
      await onSave(payload);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader className="mb-4 text-left">
          <SheetTitle>{isEdit ? `Edit ${config.singular}` : `Add ${config.singular}`}</SheetTitle>
          <SheetDescription>{config.description}</SheetDescription>
        </SheetHeader>

        <form key={String(row?.["id"] ?? "new")} onSubmit={submit} className="grid gap-4 pb-8">
          {config.fields.map((field) => (
            <FieldInput key={field.name} field={field} value={row?.[field.name]} />
          ))}

          <div className="sticky bottom-0 mt-2 flex flex-col-reverse gap-2 border-t bg-background pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={busy}>
              {busy ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function FieldInput({ field, value }: { field: FieldConfig; value: unknown }) {
  const baseClass = "w-full";

  if (field.type === "checkbox") {
    return (
      <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
        <div className="space-y-1">
          <Label htmlFor={field.name}>{field.label}</Label>
          {field.helper ? <p className="text-xs text-muted-foreground">{field.helper}</p> : null}
        </div>
        <Checkbox id={field.name} name={field.name} defaultChecked={Boolean(value ?? true)} />
      </div>
    );
  }

  if (field.type === "image") {
    return <ImageFieldInput field={field} value={value} />;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>{field.label}</Label>
      {field.type === "textarea" ? (
        <Textarea
          id={field.name}
          name={field.name}
          defaultValue={typeof value === "string" ? value : ""}
          placeholder={field.placeholder}
          required={field.required}
          rows={field.name === "content" ? 10 : 4}
        />
      ) : (
        <Input
          id={field.name}
          name={field.name}
          type={field.type}
          defaultValue={formatInputValue(field, value)}
          placeholder={field.placeholder}
          required={field.required}
          className={cn(
            baseClass,
            field.type === "datetime-local"
              ? "[&::-webkit-calendar-picker-indicator]:cursor-pointer"
              : "",
          )}
          step={field.type === "number" ? "1" : undefined}
        />
      )}
      {field.helper ? <p className="text-xs text-muted-foreground">{field.helper}</p> : null}
    </div>
  );
}

function formatInputValue(field: FieldConfig, value: unknown) {
  if (value === null || value === undefined) {
    if (field.name === "sort_order") return 0;
    return "";
  }

  if (field.type === "datetime-local") {
    return toDateTimeLocal(String(value));
  }

  return String(value);
}

function readField(field: FieldConfig, fd: FormData) {
  if (field.type === "checkbox") {
    return fd.has(field.name);
  }

  if (field.type === "image") {
    return readImageField(field.name, fd);
  }

  const raw = String(fd.get(field.name) ?? "").trim();
  if (!raw) {
    if (field.name === "sort_order") return 0;
    return null;
  }

  if (field.type === "number") {
    return Number(raw);
  }

  if (field.type === "datetime-local") {
    return new Date(raw).toISOString();
  }

  return raw;
}

function ImageFieldInput({ field, value }: { field: FieldConfig; value: unknown }) {
  const [preview, setPreview] = useState<string | null>(typeof value === "string" ? value : null);
  const [fileName, setFileName] = useState<string | null>(null);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPreview(typeof value === "string" ? value : null);
      setFileName(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(typeof reader.result === "string" ? reader.result : null);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor={field.name}>{field.label}</Label>
        {field.helper ? <p className="text-xs text-muted-foreground">{field.helper}</p> : null}
      </div>
      {preview ? (
        <div className="overflow-hidden rounded-md border">
          <img src={preview} alt={field.label} className="h-44 w-full object-cover" />
        </div>
      ) : null}
      {typeof value === "string" && value ? (
        <input type="hidden" name={`${field.name}__current`} value={value} />
      ) : null}
      <label
        htmlFor={field.name}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed px-4 py-5 text-center text-sm text-muted-foreground transition-colors hover:bg-muted/50"
      >
        <Upload className="size-4" />
        <span>{fileName ? fileName : "Browse your desktop for an image"}</span>
        <span className="text-xs">
          PNG, JPG, WEBP or GIF. The selected file is stored with the record.
        </span>
      </label>
      <Input
        id={field.name}
        name={field.name}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
      />
    </div>
  );
}

async function readImageField(name: string, fd: FormData) {
  const file = fd.get(name);
  if (file instanceof File && file.size > 0) {
    return await fileToDataUrl(file);
  }

  const current = String(fd.get(`${name}__current`) ?? "").trim();
  return current || null;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not read the selected file."));
    };
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.readAsDataURL(file);
  });
}

function toDateTimeLocal(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join("-") +
    "T" +
    [pad(date.getHours()), pad(date.getMinutes())].join(":")
  );
}

function formatCell(value: unknown, column: string, table: string) {
  if (value === null || value === undefined || value === "") return "-";

  if (
    column === "status" &&
    STATUS_SUBMITTED_TABLES.has(table) &&
    String(value).toLowerCase() === "pending"
  ) {
    return APP_TABLE_LABELS[table] ?? "Submitted";
  }

  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string" && column.endsWith("_at")) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return formatDate(date, "dd MMM yyyy");
  }

  if (typeof value === "number" && Number.isFinite(value)) return String(value);

  return String(value);
}
