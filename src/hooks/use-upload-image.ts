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
      {
        replaceTargetUrl,
        temporary,
        signal,
        onProgressChange,
      }: {
        replaceTargetUrl?: string;
        temporary?: boolean;
        signal?: AbortSignal;
        onProgressChange?: (p: number) => void;
      } = {}
    ): Promise<UploadResult | null> => {
      setError(null);
      setProgress(0);
      setUploading(true);
      abortControllerRef.current = new AbortController();

      try {
        const res = await edgestore.publicFiles.upload({
          file,
          options: {
            replaceTargetUrl,
            temporary,
          },
          signal: signal ?? abortControllerRef.current.signal,
          onProgressChange: (p) => {
            setProgress(p);
            onProgressChange?.(p); // forward to consumer (UploaderProvider)
          },
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

  const uploadFiles = useCallback(
    async (
      files: File[],
      options?: {
        replaceTargetUrl?: string;
        temporary?: boolean;
      }
    ): Promise<UploadResult[]> => {
      setError(null);
      setProgress(0);
      setUploading(true);

      const results: UploadResult[] = [];

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const res = await uploadFile(file, options);
          if (res) results.push(res);

          // update overall progress (rough average)
          setProgress(Math.round(((i + 1) / files.length) * 100));
        }
        setUploading(false);
        return results;
      } catch (err: any) {
        setError(err);
        setUploading(false);
        return results;
      }
    },
    [uploadFile]
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
    uploadFiles,
    progress,
    uploading,
    error,
  };
}
