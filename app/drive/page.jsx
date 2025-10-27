'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import DriveList from '@/components/DriveList'
import DriveUploader from '@/components/DriveUploader'

export default function DrivePage() {
  const { data: session, status } = useSession()
  const [folderId, setFolderId] = useState(null)

  useEffect(() => {
    // IMPORTANT: Replace this with a real Google Drive folder URL.
    // 1. Create a folder in your Google Drive.
    // 2. Open the folder and copy the URL from your browser.
    // 3. Paste the URL here.
    const googleDriveUrl = "https://drive.google.com/drive/folders/YOUR_REAL_FOLDER_ID_HERE";
    const match = googleDriveUrl.match(/folders\/([\w-]+)/);
    if (match) {
      setFolderId(match[1]);
    }
  }, [])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return (
      <div>
        <p>You are not signed in.</p>
        <button onClick={() => signIn('google')}>Sign in with Google</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Google Drive</h1>
      {folderId ? (
        <>
          <DriveUploader folderId={folderId} />
          <DriveList folderId={folderId} />
        </>
      ) : (
        <p>Could not determine Google Drive folder ID.</p>
      )}
    </div>
  )
}
