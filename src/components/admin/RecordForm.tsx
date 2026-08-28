import { useState, type ChangeEvent, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { adminInsert } from "@/lib/api";

type FieldType = "text" | "textarea" | "datetime" | "number" | "switch" | "image";

type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | boolean;
};

export const CREATABLE_FORMS: Record<string, { title: string; fields: Field[] }> = {
  programs: {
    title: "Program",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "summary", label: "Short summary", type: "textarea" },
      { name: "description", label: "Full description", type: "textarea" },
      { name: "icon", label: "Icon key", type: "text", defaultValue: "graduation-cap" },
      { name: "image_url", label: "Image", type: "image" },
      { name: "sort_order", label: "Sort order", type: "number", defaultValue: "0" },
      { name: "published", label: "Published", type: "switch", defaultValue: true },
    ],
  },
  events: {
    title: "Event",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "location", label: "Location", type: "text" },
      { name: "starts_at", label: "Starts at", type: "datetime", required: true },
      { name: "ends_at", label: "Ends at", type: "datetime" },
      { name: "image_url", label: "Image", type: "image" },
      { name: "capacity", label: "Capacity", type: "number" },
      { name: "published", label: "Published", type: "switch", defaultValue: true },
    ],
  },
  blog: {
    title: "Blog Post",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "content", label: "Content", type: "textarea", required: true },
      { name: "category", label: "Category", type: "text", defaultValue: "Community" },
      { name: "cover_image_url", label: "Cover image", type: "image" },
      { name: "author_name", label: "Author", type: "text", defaultValue: "Hope Alliance" },
      { name: "published", label: "Published", type: "switch", defaultValue: true },
    ],
  },
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) || `item-${Date.now()}`;

export function RecordForm({ moduleSlug, table }: { moduleSlug: string; table: string }) {
  const config = CREATABLE_FORMS[moduleSlug];
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!config) return null;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {};

    for (const field of config.fields) {
      if (field.type === "switch") {
        payload[field.name] = fd.get(field.name) === "on";
        continue;
      }
      if (field.type === "image") {
        const value = await readImageField(field.name, fd);
        if (value) payload[field.name] = value;
        continue;
      }
      const raw = fd.get(field.name);
      const value = String(raw ?? "").trim();
      if (!value) continue;
      if (field.type === "number") payload[field.name] = Number(value);
      else if (field.type === "datetime") payload[field.name] = new Date(value).toISOString();
      else payload[field.name] = value;
    }

    payload["slug"] = slugify(String(payload["title"] ?? ""));
    if (moduleSlug === "blog") payload["published_at"] = new Date().toISOString();

    setBusy(true);
    try {
      await adminInsert(table, payload);
      await queryClient.invalidateQueries({ queryKey: ["admin", table] });
      toast.success(`${config.title} created.`);
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save this record.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1 size-4" /> New {config.title}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New {config.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          {config.fields.map((field) => (
            <div key={field.name} className="space-y-2">
              {field.type === "switch" ? (
                <div className="flex items-center justify-between rounded-md border px-3 py-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Switch
                    id={field.name}
                    name={field.name}
                    defaultChecked={Boolean(field.defaultValue)}
                  />
                </div>
              ) : field.type === "image" ? (
                <ImageField name={field.name} label={field.label} />
              ) : (
                <>
                  <Label htmlFor={field.name}>{field.label}</Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.name}
                      name={field.name}
                      rows={field.name === "content" ? 6 : 3}
                      required={field.required ?? false}
                      defaultValue={String(field.defaultValue ?? "")}
                    />
                  ) : (
                    <Input
                      id={field.name}
                      name={field.name}
                      type={
                        field.type === "number"
                          ? "number"
                          : field.type === "datetime"
                            ? "datetime-local"
                            : "text"
                      }
                      required={field.required ?? false}
                      defaultValue={String(field.defaultValue ?? "")}
                    />
                  )}
                </>
              )}
            </div>
          ))}
          <DialogFooter>
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : `Save ${config.title}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ImageField({ name, label }: { name: string; label: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPreview(null);
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
      <Label htmlFor={name}>{label}</Label>
      {preview ? (
        <div className="overflow-hidden rounded-md border">
          <img src={preview} alt={label} className="h-40 w-full object-cover" />
        </div>
      ) : null}
      <label
        htmlFor={name}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed px-4 py-5 text-center text-sm text-muted-foreground transition-colors hover:bg-muted/50"
      >
        <Upload className="size-4" />
        <span>{fileName ? fileName : "Browse your desktop for an image"}</span>
        <span className="text-xs">PNG, JPG, WEBP or GIF. The file is stored with the record.</span>
      </label>
      <Input
        id={name}
        name={name}
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
