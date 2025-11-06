"use client";

import { useState } from "react";
import ficon from "../assets/ficon.svg";
import Image from "next/image";

export default function DriveList({
  files,
  handleDelete,
  onFolderClick,
  error,
  isLoading,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-white p-8 text-center text-gray-500 shadow-md">
        <p>Loading files...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-100 p-4 font-semibold text-red-500">
        Error: {error}
      </div>
    );
  }

  const toggleMenu = (fileId) => {
    setOpenMenuId(openMenuId === fileId ? null : fileId);
  };

  const sortedFiles = [...files].sort((a, b) => {
    const isFolderA = a.mimeType === "application/vnd.google-apps.folder";
    const isFolderB = b.mimeType === "application/vnd.google-apps.folder";
    if (isFolderA && !isFolderB) return -1;
    if (!isFolderA && isFolderB) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between pb-3">
        <h2 className="text-lg font-semibold text-gray-800">My Drive</h2>
      </div>

      {/* ✅ Fixed GRID layout */}
      <div className="flex flex-row flex-wrap items-center justify-center gap-6">
        {sortedFiles.map((file) => {
          const isFolder =
            file.mimeType === "application/vnd.google-apps.folder";
          return (
            <div
              key={file.id}
              onDoubleClick={() =>
                isFolder && onFolderClick(file.id, file.name)
              }
              className="relative flex w-[350px] cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 transition-all duration-200 hover:bg-gray-100 hover:shadow-md"
            >
              {/* Thumbnail Section */}
              <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded-t-xl bg-white text-center">
                <Image
                  src={isFolder ? ficon : file.iconLink}
                  alt={file.name}
                  width={320}
                  height={120}
                  className="h-full w-[60px] object-contain"
                />
              </div>

              {/* File Info */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-2 overflow-hidden">
                  <p
                    className="truncate text-sm font-medium text-gray-800"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                </div>

                {/* Three-dot menu button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu(file.id);
                  }}
                  className="rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-200"
                >
                  <svg
                    className="h-5 w-5 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01"
                    />
                  </svg>
                </button>
              </div>

              {/* Context Menu */}
              {openMenuId === file.id && (
                <div
                  className="absolute top-10 right-3 z-20 w-40 rounded-lg border border-gray-200 bg-white shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ul className="divide-y divide-gray-100 text-sm">
                    <li>
                      <a
                        href={
                          isFolder
                            ? `https://drive.google.com/drive/folders/${file.id}`
                            : `https://drive.google.com/file/d/${file.id}/preview`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        {isFolder ? "Open in Drive" : "Preview"}
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleDelete(file.id);
                          setOpenMenuId(null);
                        }}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {files.length === 0 && !error && (
        <div className="p-8 text-center text-gray-500">
          <p>This folder is empty.</p>
        </div>
      )}
    </div>
  );
}
