"use client";

import { useState } from "react";

export default function DriveList({ files, handleDelete, error }) {
  const [openMenuId, setOpenMenuId] = useState(null);

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

  return (
    <div className="rounded-lg bg-white shadow-md">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-700">Files</h2>
      </div>
      <div className="flex flex-wrap gap-4 p-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="relative flex w-full max-w-[350px] flex-col rounded-lg border border-gray-200 transition-colors duration-200 hover:bg-gray-50"
          >
            <div className="flex h-48 items-center justify-center rounded-t-lg bg-gray-100">
              <img
                src={file.thumbnailLink || file.iconLink}
                alt={`Icon for ${file.name}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex items-center p-3">
              <img
                src={file.iconLink}
                alt="file icon"
                className="mr-2 h-5 w-5 flex-shrink-0"
              />
              <p
                className="truncate text-sm font-medium text-gray-800"
                title={file.name}
              >
                {file.name}
              </p>
            </div>

            <button
              onClick={() => toggleMenu(file.id)}
              className="absolute top-2 right-2 rounded-full p-1 hover:bg-gray-200"
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

            {openMenuId === file.id && (
              <div className="absolute top-10 right-2 z-10 w-40 rounded-md border border-gray-200 bg-white shadow-lg">
                <ul className="divide-y divide-gray-100">
                  <li>
                    <a
                      href={`https://drive.google.com/file/d/${file.id}/preview`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Preview
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleDelete(file.id);
                        setOpenMenuId(null);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      {files.length === 0 && !error && (
        <div className="p-8 text-center text-gray-500">
          <p>This folder is empty.</p>
        </div>
      )}
    </div>
  );
}
