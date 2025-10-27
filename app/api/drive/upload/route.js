import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { google } from "googleapis";
import { Readable } from "stream";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: session.accessToken });

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const data = await req.formData();
  const file = data.get("file");
  const folderId = "1ry7mhpcN25TeZuReUFZqS86wgjtXHGcM"; // Hardcoded folder ID

  if (!file) {
    return new Response(JSON.stringify({ error: "File is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const fileMetadata = {
    name: file.name, // file name in Drive
    parents: [folderId], // Specify the folder
  };

  const media = {
    mimeType: file.type,
    body: Readable.from(file.stream()),
  };

  try {
    const uploadedFile = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id, name, webViewLink",
      supportsAllDrives: true,
    });

    return new Response(JSON.stringify(uploadedFile.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    return new Response(JSON.stringify({ error: "Failed to upload file" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
