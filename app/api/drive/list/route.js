import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { google } from "googleapis";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { searchParams } = new URL(req.url);
  const folderId = searchParams.get("folderId") || "root";

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: session.accessToken });

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  try {
    let files = [];

    // Fetch My Drive or specific folder
    const myDrive = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields:
        "files(id, name, mimeType, modifiedTime, webViewLink, iconLink, thumbnailLink, parents)",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      corpora: "user",
      pageSize: 100,
    });

    files = [...(myDrive.data.files || [])];

    // If root → also fetch "Shared with me"
    if (folderId === "root") {
      const sharedWithMe = await drive.files.list({
        q: "sharedWithMe = true and trashed = false",
        fields:
          "files(id, name, mimeType, modifiedTime, webViewLink, iconLink, thumbnailLink, owners)",
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
        corpora: "user",
        pageSize: 100,
      });

      files = [...files, ...(sharedWithMe.data.files || [])];
    }

    return new Response(JSON.stringify(files), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching files from Google Drive:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch files" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
