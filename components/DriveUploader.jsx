'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function DriveUploader({ folderId }) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles) => {
    setUploading(true)
    const file = acceptedFiles[0]
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folderId", folderId)

    const xhr = new XMLHttpRequest()
    xhr.open("POST", "/api/drive/upload", true)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100
        setUploadProgress(percentComplete)
      }
    }

    xhr.onload = () => {
      setUploading(false)
      // TODO: Refresh the file list
    }

    xhr.send(formData)
  }, [folderId])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
      {uploading && (
        <div>
          <p>Uploading...</p>
          <progress value={uploadProgress} max="100" />
        </div>
      )}
    </div>
  )
}
