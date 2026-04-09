import { createActor } from "@/backend";
import type { Restaurant } from "@/backend";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useQrCode } from "@/hooks/useQrCode";
import { loadConfig } from "@caffeineai/core-infrastructure";
import { useActor } from "@caffeineai/core-infrastructure";
import { StorageClient } from "@caffeineai/object-storage";
import { HttpAgent } from "@icp-sdk/core/agent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  QrCode,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// ─── PDF Upload Section ───────────────────────────────────────────────────────

interface PdfSectionProps {
  restaurant: Restaurant | null;
  onSaved: (url: string) => void;
}

function PdfSection({ restaurant, onSaved }: PdfSectionProps) {
  const { t } = useTranslation("modules");
  const { actor, isFetching: isActorLoading } = useActor(createActor);
  const queryClient = useQueryClient();

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!actor || !restaurant) throw new Error("Not ready");

      // Upload the file to object-storage and get a durable URL
      const config = await loadConfig();
      const agent = new HttpAgent({ host: config.backend_host });
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );

      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const { hash } = await storageClient.putFile(bytes, (pct: number) =>
        setUploadProgress(Math.round(pct * 100)),
      );
      const durableUrl = await storageClient.getDirectURL(hash);

      // Save the durable URL to the backend
      const result = await actor.updateRestaurant(restaurant.restaurantId, {
        restaurantId: restaurant.restaurantId,
        pdfMenuUrl: durableUrl,
      });

      if (result.__kind__ === "err") {
        throw new Error(result.err.__kind__);
      }

      return durableUrl;
    },
    onSuccess: (url) => {
      toast.success(t("menuQr.pdfSaved"));
      setUploadProgress(0);
      setSelectedFile(null);
      onSaved(url);
      queryClient.invalidateQueries({ queryKey: ["myRestaurant"] });
    },
    onError: () => {
      toast.error(t("menuQr.pdfError"));
      setUploadProgress(0);
    },
  });

  const handleFileSelect = useCallback((file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const isUploading = uploadMutation.isPending;
  const isDisabled = isUploading || isActorLoading || !actor || !restaurant;

  return (
    <div className="space-y-5">
      {/* Current PDF */}
      {restaurant?.pdfMenuUrl && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/10 border border-accent/30">
          <FileText size={20} className="text-accent flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {t("menuQr.currentPdf")}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {restaurant.pdfMenuUrl}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="flex-shrink-0"
            aria-label="View PDF"
          >
            <a
              href={restaurant.pdfMenuUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={14} />
            </a>
          </Button>
        </div>
      )}

      {/* Drop zone */}
      <button
        type="button"
        aria-label={t("menuQr.dragOrClick")}
        data-ocid="pdf-dropzone"
        onClick={() => !isDisabled && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        disabled={isDisabled}
        className={[
          "w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-smooth",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          isDisabled ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
      >
        <Upload
          size={32}
          className={`mx-auto mb-3 ${isDragging ? "text-primary" : "text-muted-foreground"}`}
        />
        {selectedFile ? (
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground flex items-center justify-center gap-2">
              <FileText size={14} />
              {selectedFile.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-foreground">
              {t("menuQr.dragOrClick")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("menuQr.pdfOnly")}
            </p>
          </>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={handleInputChange}
        tabIndex={-1}
      />

      {/* Upload progress */}
      {isUploading && uploadProgress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{t("menuQr.uploadProgress")}</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Save button */}
      <Button
        onClick={() => selectedFile && uploadMutation.mutate(selectedFile)}
        disabled={!selectedFile || isDisabled}
        className="w-full"
        data-ocid="save-pdf-btn"
      >
        {isUploading ? (
          <>
            <Upload size={14} className="mr-2 animate-bounce" />
            {t("menuQr.uploadingPdf")}
          </>
        ) : (
          <>
            <Upload size={14} className="mr-2" />
            {restaurant?.pdfMenuUrl
              ? t("menuQr.replacePdf")
              : t("menuQr.uploadPdf")}
          </>
        )}
      </Button>
    </div>
  );
}

// ─── QR Section ───────────────────────────────────────────────────────────────

interface QrSectionProps {
  restaurant: Restaurant | null;
}

function QrSection({ restaurant }: QrSectionProps) {
  const { t } = useTranslation(["modules", "common"]);
  const navigate = useNavigate();
  const { qrDataUrl, menuUrl, isGenerating, generateQr, downloadQr } =
    useQrCode();

  const slug = restaurant?.slug ?? "";

  // Auto-generate QR when slug is available
  useEffect(() => {
    if (slug) {
      generateQr(slug);
    }
  }, [slug, generateQr]);

  if (!slug) {
    return (
      <div
        className="flex flex-col items-center gap-4 py-8 text-center"
        data-ocid="no-slug-notice"
      >
        <div className="rounded-full bg-muted p-4">
          <AlertCircle size={28} className="text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {t("modules:menuQr.noSlug")}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: "/manager/restaurant" })}
          data-ocid="setup-profile-btn"
        >
          {t("modules:menuQr.setupProfile")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* QR Code display */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative rounded-xl border-2 border-border p-4 bg-card shadow-sm">
          {isGenerating ? (
            <Skeleton className="w-48 h-48 rounded-lg" />
          ) : qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR code for ${slug}`}
              className="w-48 h-48 rounded-lg"
              data-ocid="qr-image"
            />
          ) : null}

          {/* Success indicator */}
          {!isGenerating && qrDataUrl && (
            <div className="absolute -top-2 -right-2">
              <CheckCircle2 size={20} className="text-accent fill-accent/20" />
            </div>
          )}
        </div>

        {/* Encoded URL */}
        {menuUrl && (
          <div className="w-full space-y-1" data-ocid="qr-url-display">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("modules:menuQr.qrUrl")}
            </p>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
              <code className="text-xs text-foreground break-all flex-1 min-w-0">
                {menuUrl}
              </code>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="flex-shrink-0 h-6 w-6 p-0"
                aria-label="Open menu URL"
              >
                <a href={menuUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={12} />
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Download button */}
      <Button
        onClick={() => downloadQr(slug)}
        disabled={!qrDataUrl || isGenerating}
        className="w-full"
        data-ocid="download-qr-btn"
      >
        <Download size={14} className="mr-2" />
        {t("modules:menuQr.downloadQr")}
      </Button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MenuQrPage() {
  const { t } = useTranslation(["modules", "common"]);
  const navigate = useNavigate();
  const { actor, isFetching: isActorLoading } = useActor(createActor);
  const [localPdfUrl, setLocalPdfUrl] = useState<string | null>(null);

  const restaurantQuery = useQuery<Restaurant | null>({
    queryKey: ["myRestaurant"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyRestaurant();
    },
    enabled: !!actor && !isActorLoading,
    staleTime: 30_000,
  });

  const restaurant = restaurantQuery.data
    ? {
        ...restaurantQuery.data,
        pdfMenuUrl: localPdfUrl ?? restaurantQuery.data.pdfMenuUrl,
      }
    : null;

  const isLoading =
    restaurantQuery.isLoading || (isActorLoading && !restaurantQuery.data);

  return (
    <Layout>
      <div
        className="max-w-2xl mx-auto py-4 space-y-6"
        data-ocid="menu-qr-page"
      >
        {/* Page header */}
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/manager" })}
            className="mt-0.5 flex-shrink-0"
            aria-label={t("modules:menuQr.back")}
            data-ocid="back-btn"
          >
            <ArrowLeft size={16} className="mr-1.5" />
            {t("modules:menuQr.back")}
          </Button>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <QrCode size={22} className="text-primary" />
            <h1 className="font-display text-2xl font-bold text-foreground">
              {t("modules:menuQr.title")}
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            {t("modules:menuQr.description")}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* ── Section 1: PDF Menu ── */}
            <div
              className="card-elevated p-6 space-y-4"
              data-ocid="pdf-section"
            >
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                <h2 className="font-display font-semibold text-foreground text-base">
                  {t("modules:menuQr.pdfSection")}
                </h2>
                {restaurant?.pdfMenuUrl && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    <CheckCircle2 size={10} className="mr-1 text-accent" />
                    {t("modules:menuQr.pdfUploaded")}
                  </Badge>
                )}
              </div>
              <Separator />
              <PdfSection
                restaurant={restaurant ?? null}
                onSaved={(url) => setLocalPdfUrl(url)}
              />
            </div>

            {/* ── Section 2: QR Code ── */}
            <div className="card-elevated p-6 space-y-4" data-ocid="qr-section">
              <div className="flex items-center gap-2">
                <QrCode size={18} className="text-primary" />
                <h2 className="font-display font-semibold text-foreground text-base">
                  {t("modules:menuQr.qrSection")}
                </h2>
              </div>
              <Separator />
              <QrSection restaurant={restaurant ?? null} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
