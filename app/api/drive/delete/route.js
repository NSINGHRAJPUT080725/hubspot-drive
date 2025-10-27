import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { google } from "googleapis";

export async function DELETE(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("fileId");

  if (!fileId) {
    return new Response(JSON.stringify({ error: "fileId is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: session.accessToken });

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  try {
    await drive.files.delete({
      fileId: fileId,
      supportsAllDrives: true,
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting file from Google Drive:", error);
    if (error.code === 401) {
      return new Response(JSON.stringify({ error: "Authentication error" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: "Failed to delete file" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
