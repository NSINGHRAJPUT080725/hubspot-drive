"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function DriveUploader({ folderId, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setUploading(true);
      setUploadProgress(0); // Reset progress
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folderId", folderId);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/drive/upload", true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        setUploading(false);
        if (xhr.status === 200) {
          onUploadSuccess(); // Refresh the file list
        }
      };

      xhr.send(formData);
    },
    [folderId, onUploadSuccess],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`mb-8 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors duration-300 ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        <svg
          className="mb-4 h-12 w-12 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        {isDragActive ? (
          <p className="text-lg font-semibold text-blue-600">
            Drop the files here ...
          </p>
        ) : (
          <p className="text-gray-500">
            Drag 'n' drop some files here, or{" "}
            <span className="font-semibold text-blue-500">
              click to select files
            </span>
          </p>
        )}
      </div>
      {uploading && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-700">Uploading...</p>
          <div className="mt-2 h-2.5 w-full rounded-full bg-gray-200">
            <div
              className="h-2.5 rounded-full bg-blue-600"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
