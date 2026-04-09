import QRCode from "qrcode";
import { useCallback, useRef, useState } from "react";

/** Base URL for the public menu — custom domain, not the canister URL */
const MENU_BASE_URL = "https://app.monedadigital.app/menu";

interface UseQrCodeResult {
  /** Generated QR code as a data URL (base64 PNG) or null if not yet generated */
  qrDataUrl: string | null;
  /** The full public URL encoded in the QR code */
  menuUrl: string | null;
  /** Whether QR generation is in progress */
  isGenerating: boolean;
  /** Generates the QR code for the given slug */
  generateQr: (slug: string) => Promise<void>;
  /** Downloads the QR code as a PNG file named "qr-{slug}.png" */
  downloadQr: (slug: string) => void;
  /** Ref to attach to an <img> element for the QR preview */
  qrImgRef: React.RefObject<HTMLImageElement | null>;
}

/**
 * useQrCode — generates and downloads a QR code for the restaurant's public menu URL.
 * Uses the qrcode library to produce a base64 PNG data URL client-side.
 */
export function useQrCode(): UseQrCodeResult {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [menuUrl, setMenuUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const qrImgRef = useRef<HTMLImageElement | null>(null);

  const generateQr = useCallback(async (slug: string) => {
    if (!slug) return;

    const url = `${MENU_BASE_URL}/${slug}`;
    setMenuUrl(url);
    setIsGenerating(true);

    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: "#454C92",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "H",
      });
      setQrDataUrl(dataUrl);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const downloadQr = useCallback(
    (slug: string) => {
      if (!qrDataUrl) return;

      const link = document.createElement("a");
      link.href = qrDataUrl;
      link.download = `qr-${slug}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [qrDataUrl],
  );

  return {
    qrDataUrl,
    menuUrl,
    isGenerating,
    generateQr,
    downloadQr,
    qrImgRef,
  };
}
