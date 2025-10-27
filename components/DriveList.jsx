'use client'

import { useState, useEffect } from 'react'

export default function DriveList({ folderId }) {
  const [files, setFiles] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (folderId) {
      fetch(`/api/drive/list?folderId=${folderId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch files')
          }
          return res.json()
        })
        .then((data) => {
          setFiles(data)
        })
        .catch((error) => {
          setError(error.message)
        })
    }
  }, [folderId])

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h2>Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            <a href={file.webViewLink} target="_blank" rel="noopener noreferrer">
              <img src={file.iconLink} alt="file icon" />
              {file.name}
            </a>
            <span> - {new Date(file.modifiedTime).toLocaleDateString()}</span>
            <a href={`https://drive.google.com/file/d/${file.id}/preview`} target="_blank" rel="noopener noreferrer"> (Preview)</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
