'use client'

export default function DrivePreview({ fileId }) {
  if (!fileId) {
    return null
  }

  return (
    <div>
      <h2>File Preview</h2>
      <iframe
        src={`https://drive.google.com/file/d/${fileId}/preview`}
        width="100%"
        height="600px"
        style={{ border: 'none' }}
      ></iframe>
    </div>
  )
}
