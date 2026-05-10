import { NextRequest, NextResponse } from "next/server";
import { saveUploadedLocalMedia } from "@/lib/local-media-server";
import { requireAuth } from "@/lib/require-admin";

export async function POST(request: NextRequest) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const targetFolder = String(formData.get("targetFolder") || "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  try {
    const result = await saveUploadedLocalMedia(file, targetFolder);

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Upload failed unexpectedly",
      },
      { status: 400 },
    );
  }
}
