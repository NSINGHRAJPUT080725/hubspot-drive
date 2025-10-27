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

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: session.accessToken });

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  try {
    const res = await drive.files.list({
      q: "trashed = false",
      fields:
        "files(id, name, mimeType, modifiedTime, webViewLink, iconLink, thumbnailLink, parents)",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      pageSize: 100, // limit results for performance
    });

    console.log("Fetched files:", res.data.files?.length);

    return new Response(JSON.stringify(res.data.files || []), {
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
