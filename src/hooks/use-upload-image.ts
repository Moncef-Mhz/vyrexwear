/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useRef } from "react";
import { useEdgeStore } from "../lib/edgestore";

type UploadResult = {
  url: string;
  size: number;
  uploadedAt: Date;
  metadata: Record<string, unknown>;
  path: Record<string, unknown>;
  pathOrder: string[];
};

export function useFileUpload() {
  const { edgestore } = useEdgeStore();

  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const [uploading, setUploading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const uploadFile = useCallback(
    async (
      file: File,
      options?: {
        replaceTargetUrl?: string;
        temporary?: boolean;
      }
    ): Promise<UploadResult | null> => {
      setError(null);
      setProgress(0);
      setUploading(true);
      abortControllerRef.current = new AbortController();

      try {
        const res = await edgestore.publicFiles.upload({
          file,
          options,
          signal: abortControllerRef.current.signal,
          onProgressChange: (p) => setProgress(p),
        });

        setUploading(false);
        return res;
      } catch (err: any) {
        if (err.name === "UploadAbortedError") {
          console.log("Upload cancelled");
        } else {
          setError(err);
        }
        setUploading(false);
        return null;
      }
    },
    [edgestore]
  );

  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const deleteFile = async (url: string) => {
    try {
      console.log("Deleting file:", url);
      if (!url) {
        throw new Error("File URL is required for deletion");
      }
      await edgestore.publicFiles.delete({ url });
      return true;
    } catch (err) {
      console.error("Error deleting file", err);
      throw err;
    }
  };

  const confirmUpload = useCallback(
    async (url: string) => {
      try {
        await edgestore.publicFiles.confirmUpload({ url });
      } catch (err) {
        console.error("Error confirming upload", err);
        throw err;
      }
    },
    [edgestore]
  );

  return {
    uploadFile,
    cancelUpload,
    deleteFile,
    confirmUpload,
    progress,
    uploading,
    error,
  };
}
