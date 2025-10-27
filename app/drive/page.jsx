"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import DriveList from "@/components/DriveList";
import DriveUploader from "@/components/DriveUploader";

export default function DrivePage() {
  const { data: session, status } = useSession();
  const [folderId, setFolderId] = useState(null);

  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(false);

  const fetchFiles = () => {
    if (folderId) {
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
        });
    }
  };

  useEffect(() => {
    // IMPORTANT: Replace this with a real Google Drive folder URL.
    // 1. Create a folder in your Google Drive.
    // 2. Open the folder and copy the URL from your browser.
    // 3. Paste the URL here.
    const googleDriveUrl =
      "https://drive.google.com/drive/folders/YOUR_REAL_FOLDER_ID_HERE";
    const match = googleDriveUrl.match(/folders\/([\w-]+)/);
    if (match) {
      setFolderId(match[1]);
    }
  }, []);

  useEffect(() => {
    if (session) {
      // Only fetch files if session is available
      fetchFiles();
    }
  }, [folderId, session]);

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
        <h1 className="text-xl font-semibold text-gray-800">Google Drive</h1>
      </header>
      <main className="p-4 md:p-8">
        {folderId ? (
          <div className="mx-auto max-w-7xl">
            <DriveUploader folderId={folderId} onUploadSuccess={fetchFiles} />
            <DriveList
              files={files}
              handleDelete={handleDelete}
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
