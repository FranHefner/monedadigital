import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useMyRestaurant,
  useSaveRestaurant,
  useUploadImage,
} from "@/hooks/useRestaurant";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ImageIcon,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// ─── Slug utilities ───────────────────────────────────────────────────────────

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}

// ─── ImageUploadField ─────────────────────────────────────────────────────────

interface ImageUploadFieldProps {
  label: string;
  currentUrl: string;
  onUpload: (url: string) => void;
  onClear?: () => void;
  accept?: string;
  dataOcid?: string;
}

function ImageUploadField({
  label,
  currentUrl,
  onUpload,
  onClear,
  accept = "image/*",
  dataOcid,
}: ImageUploadFieldProps) {
  const { t } = useTranslation(["modules"]);
  const { upload } = useUploadImage();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const result = await upload(file, (pct) => setProgress(pct));

    setUploading(false);
    if (result.url) {
      onUpload(result.url);
    } else {
      toast.error(result.error ?? "Upload failed");
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-start gap-3">
        {/* Preview thumbnail */}
        <div
          className="h-16 w-16 shrink-0 rounded-lg border border-border bg-muted/40 overflow-hidden flex items-center justify-center"
          data-ocid={dataOcid ? `${dataOcid}-preview` : undefined}
        >
          {currentUrl ? (
            <img
              src={currentUrl}
              alt={label}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <ImageIcon size={20} className="text-muted-foreground" />
          )}
        </div>

        {/* Upload controls */}
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
            data-ocid={dataOcid}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                {progress}%
              </>
            ) : (
              <>
                <Upload size={13} />
                {currentUrl
                  ? t("modules:restaurant.fields.replace")
                  : t("modules:restaurant.fields.uploadImage")}
              </>
            )}
          </Button>

          {currentUrl && onClear && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground hover:text-destructive"
              onClick={onClear}
            >
              <X size={13} />
              {t("modules:restaurant.fields.remove")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  description: string;
  city: string;
  slug: string;
  logoUrl: string;
  backgroundColor: string;
  backgroundImageUrl: string;
  isActive: boolean;
}

const INITIAL_FORM: FormState = {
  name: "",
  description: "",
  city: "",
  slug: "",
  logoUrl: "",
  backgroundColor: "#454C92",
  backgroundImageUrl: "",
  isActive: true,
};

// ─── RestaurantPage ───────────────────────────────────────────────────────────

/**
 * RestaurantPage — Manager module for configuring the restaurant profile.
 * Loads existing data on mount, saves create/update to backend.
 * Uses object-storage for logo and background image uploads.
 */
export default function RestaurantPage() {
  const { t } = useTranslation(["modules"]);
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [savedOk, setSavedOk] = useState(false);

  const { data: restaurant, isLoading } = useMyRestaurant();
  const { mutateAsync: saveRestaurant, isPending: isSaving } =
    useSaveRestaurant();

  // Populate form when restaurant data loads
  useEffect(() => {
    if (!restaurant) return;
    setForm({
      name: restaurant.name,
      description: restaurant.description,
      city: restaurant.city,
      slug: restaurant.slug,
      logoUrl: restaurant.logoUrl,
      backgroundColor: restaurant.backgroundColor || "#454C92",
      backgroundImageUrl: restaurant.backgroundImageUrl,
      isActive: restaurant.isActive,
    });
    setSlugTouched(true); // Existing slug — treat as touched
  }, [restaurant]);

  // Auto-generate slug from name (only when user hasn't manually edited it)
  const handleNameChange = useCallback(
    (value: string) => {
      setForm((prev) => {
        const next = { ...prev, name: value };
        if (!slugTouched) {
          next.slug = slugify(value);
        }
        return next;
      });
    },
    [slugTouched],
  );

  const handleSlugChange = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setForm((prev) => ({ ...prev, slug: cleaned }));
    setSlugTouched(true);
    setSlugError(
      cleaned && !isValidSlug(cleaned)
        ? t("modules:restaurant.errors.slugInvalid")
        : null,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    if (form.slug && !isValidSlug(form.slug)) {
      setSlugError(t("modules:restaurant.errors.slugInvalid"));
      return;
    }

    const result = await saveRestaurant(
      restaurant
        ? {
            mode: "update",
            restaurantId: restaurant.restaurantId,
            input: {
              restaurantId: restaurant.restaurantId,
              name: form.name || undefined,
              description: form.description || undefined,
              city: form.city || undefined,
              slug: form.slug || undefined,
              logoUrl: form.logoUrl || undefined,
              backgroundColor: form.backgroundColor || undefined,
              backgroundImageUrl: form.backgroundImageUrl || undefined,
              isActive: form.isActive,
            },
          }
        : {
            mode: "create",
            input: {
              name: form.name,
              description: form.description,
              city: form.city,
              slug: form.slug,
              logoUrl: form.logoUrl || undefined,
              backgroundColor: form.backgroundColor || undefined,
              backgroundImageUrl: form.backgroundImageUrl || undefined,
              isActive: form.isActive,
            },
          },
    );

    if (result.success) {
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 3000);
      toast.success(t("modules:restaurant.saved"));
    } else if (result.error === "alreadyExists") {
      setSlugError(t("modules:restaurant.errors.slugTaken"));
    } else {
      toast.error(result.errorMessage ?? "Error al guardar. Intentá de nuevo.");
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto py-4" data-ocid="restaurant-page">
        {/* Header row */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/manager" })}
            aria-label={t("modules:restaurant.back")}
            data-ocid="restaurant-back-btn"
            className="shrink-0"
          >
            <ArrowLeft size={18} />
          </Button>

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="rounded-lg bg-primary/10 p-2 shrink-0">
              <Building2 size={18} className="text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-xl font-bold text-foreground leading-none truncate">
                {t("modules:restaurant.title")}
              </h1>
            </div>
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-5" data-ocid="restaurant-loading">
            {(["name", "description", "city", "slug", "logo"] as const).map(
              (field) => (
                <div key={field} className="space-y-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ),
            )}
          </div>
        )}

        {/* Form */}
        {!isLoading && (
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            data-ocid="restaurant-form"
          >
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="r-name">
                {t("modules:restaurant.fields.name")} *
              </Label>
              <Input
                id="r-name"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej: La Parrilla del Centro"
                required
                data-ocid="restaurant-name-input"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="r-description">
                {t("modules:restaurant.fields.description")}
              </Label>
              <Textarea
                id="r-description"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Contá un poco de tu restaurante..."
                rows={3}
                data-ocid="restaurant-description-input"
              />
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <Label htmlFor="r-city">
                {t("modules:restaurant.fields.city")}
              </Label>
              <Input
                id="r-city"
                value={form.city}
                onChange={(e) =>
                  setForm((p) => ({ ...p, city: e.target.value }))
                }
                placeholder="Ej: Buenos Aires"
                data-ocid="restaurant-city-input"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <Label htmlFor="r-slug">
                {t("modules:restaurant.fields.slug")}
              </Label>
              <Input
                id="r-slug"
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="mi-restaurante"
                className={
                  slugError
                    ? "border-destructive focus-visible:ring-destructive/40"
                    : ""
                }
                data-ocid="restaurant-slug-input"
              />
              {slugError && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="restaurant-slug-error"
                >
                  {slugError}
                </p>
              )}
              {/* Slug preview */}
              {form.slug && !slugError && (
                <div
                  className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 rounded-md px-3 py-2 border border-border"
                  data-ocid="restaurant-slug-preview"
                >
                  <span className="font-medium text-foreground">
                    {t("modules:restaurant.slugPreview")}:
                  </span>
                  <span className="truncate">
                    https://app.monedadigital.app/menu/
                    <span className="text-primary font-medium">
                      {form.slug}
                    </span>
                  </span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-border pt-2" />

            {/* Logo upload */}
            <ImageUploadField
              label={t("modules:restaurant.fields.logo")}
              currentUrl={form.logoUrl}
              onUpload={(url) => setForm((p) => ({ ...p, logoUrl: url }))}
              onClear={() => setForm((p) => ({ ...p, logoUrl: "" }))}
              dataOcid="restaurant-logo"
            />

            {/* Background color */}
            <div className="space-y-1.5">
              <Label htmlFor="r-bgcolor">
                {t("modules:restaurant.fields.backgroundColor")}
              </Label>
              <div className="flex items-center gap-3">
                <input
                  id="r-bgcolor"
                  type="color"
                  value={form.backgroundColor}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, backgroundColor: e.target.value }))
                  }
                  className="h-10 w-16 cursor-pointer rounded-md border border-input bg-background p-1"
                  data-ocid="restaurant-bgcolor-input"
                />
                <span className="text-sm text-muted-foreground font-mono">
                  {form.backgroundColor}
                </span>
              </div>
            </div>

            {/* Background image upload */}
            <ImageUploadField
              label={t("modules:restaurant.fields.backgroundImage")}
              currentUrl={form.backgroundImageUrl}
              onUpload={(url) =>
                setForm((p) => ({ ...p, backgroundImageUrl: url }))
              }
              onClear={() => setForm((p) => ({ ...p, backgroundImageUrl: "" }))}
              dataOcid="restaurant-bgimage"
            />

            {/* Divider */}
            <div className="border-t border-border pt-2" />

            {/* Active toggle */}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor="r-active" className="cursor-pointer">
                  {t("modules:restaurant.fields.isActive")}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {form.isActive
                    ? t("modules:restaurant.fields.activeDescription")
                    : t("modules:restaurant.fields.inactiveDescription")}
                </p>
              </div>
              <Switch
                id="r-active"
                checked={form.isActive}
                onCheckedChange={(checked) =>
                  setForm((p) => ({ ...p, isActive: checked }))
                }
                data-ocid="restaurant-active-toggle"
              />
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isSaving || !form.name.trim() || !!slugError}
                data-ocid="restaurant-save-btn"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    {t("modules:restaurant.saving")}
                  </>
                ) : savedOk ? (
                  <>
                    <CheckCircle2 size={15} />
                    {t("modules:restaurant.saved")}
                  </>
                ) : (
                  t("modules:restaurant.save")
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}
