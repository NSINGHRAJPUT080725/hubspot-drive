"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import DriveList from "@/components/DriveList";
import DriveUploader from "@/components/DriveUploader";

export default function DrivePage() {
  const { data: session, status } = useSession();
  const [folderId, setFolderId] = useState("root");
  const [breadcrumbs, setBreadcrumbs] = useState([
    { id: "root", name: "My Drive" },
  ]);

  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(false);

  const fetchFiles = () => {
    if (folderId) {
      setIsLoading(true);
      setError(null);
      fetch(`/api/drive/list?folderId=${folderId}`)
        .then((res) => {
          if (res.status === 401) {
            setAuthError(true);
            return;
          }
          if (!res.ok) {
            throw new Error("Failed to fetch files");
          }
          return res.json();
        })
        .then((data) => {
          if (data) setFiles(data);
        })
        .catch((error) => {
          setError(error.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (session) {
      // Only fetch files if session is available
      fetchFiles();
    }
  }, [folderId, session]);

  const handleFolderChange = (newFolderId, newFolderName) => {
    setFolderId(newFolderId);
    // Check if the folder is already in the breadcrumbs to avoid duplicates
    if (!breadcrumbs.find((b) => b.id === newFolderId)) {
      setBreadcrumbs([
        ...breadcrumbs,
        { id: newFolderId, name: newFolderName },
      ]);
    }
  };

  const handleBreadcrumbClick = (targetFolderId) => {
    const breadcrumbIndex = breadcrumbs.findIndex(
      (b) => b.id === targetFolderId,
    );
    if (breadcrumbIndex !== -1) {
      setFolderId(targetFolderId);
      setBreadcrumbs(breadcrumbs.slice(0, breadcrumbIndex + 1));
    }
  };

  const handleDelete = async (fileId) => {
    try {
      const res = await fetch(`/api/drive/delete?fileId=${fileId}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        setAuthError(true);
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to delete file");
      }
      // Remove the file from the list in the state
      setFiles(files.filter((file) => file.id !== fileId));
    } catch (error) {
      setError(error.message);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session || authError) {
    return (
      <div className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-gray-800">
        <div className="rounded-lg bg-white p-8 text-center shadow-2xl">
          <h2 className="mb-4 text-xl font-bold">Session Expired</h2>
          <p className="mb-6 text-gray-600">
            Your session has expired. Please sign in again to continue.
          </p>
          <button
            onClick={() => signIn("google")}
            className="flex items-center justify-center rounded-lg bg-blue-500 px-4 py-2 font-bold text-white transition duration-300 hover:bg-blue-600"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center">
          {breadcrumbs.length > 1 && (
            <button
              onClick={() => {
                const parent = breadcrumbs[breadcrumbs.length - 2];
                handleBreadcrumbClick(parent.id);
              }}
              className="mr-4 flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 -ml-1 h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Back
            </button>
          )}
          <nav className="flex items-center text-sm font-medium text-gray-500">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.id} className="flex items-center">
                {index > 0 && (
                  <span className="mx-2 text-gray-400 select-none">/</span>
                )}
                <button
                  onClick={() => handleBreadcrumbClick(crumb.id)}
                  className={`rounded-md px-2 py-1 transition-colors hover:bg-gray-100 hover:text-gray-900 ${
                    index === breadcrumbs.length - 1
                      ? "cursor-default bg-gray-100 font-semibold text-gray-800"
                      : ""
                  }`}
                  disabled={index === breadcrumbs.length - 1}
                >
                  {crumb.name}
                </button>
              </div>
            ))}
          </nav>
        </div>
      </header>
      <main className="p-4 md:p-8">
        {folderId ? (
          <div className="mx-auto w-full">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex space-x-2">
                <DriveUploader
                  folderId={folderId}
                  onUploadSuccess={fetchFiles}
                />
                <button
                  onClick={() => createNewFolder(folderId)} // you’ll define this later
                  className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300"
                >
                  + New Folder
                </button>
              </div>
              <button
                onClick={fetchFiles}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-100"
              >
                Refresh
              </button>
            </div>
            <DriveList
              files={files}
              isLoading={isLoading}
              handleDelete={handleDelete}
              onFolderClick={handleFolderChange}
              error={error}
            />
          </div>
        ) : (
          <div className="rounded-lg bg-white p-8 text-center shadow-md">
            <p className="text-lg text-red-600">
              Could not determine Google Drive folder ID.
            </p>
            <p className="mt-2 text-gray-600">
              Please make sure the URL in `app/drive/page.jsx` is correct.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
