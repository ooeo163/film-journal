import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-admin";
import { getCosClient, cosConfig, isCosEnabled } from "@/lib/cos-config";
import { generateCosKey } from "@/lib/cos-utils";

export async function POST(request: NextRequest) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!isCosEnabled()) {
    return NextResponse.json(
      { error: "COS is not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { fileName, targetFolder = "photos" } = body;

    if (!fileName) {
      return NextResponse.json(
        { error: "fileName is required" },
        { status: 400 }
      );
    }

    const client = getCosClient();
    const key = generateCosKey(targetFolder, fileName);
    const thumbKey = key.replace(/(\.[^/.]+)$/, "-thumb$1");

    const [originalUrl, thumbUrl] = await Promise.all([
      new Promise<string>((resolve, reject) => {
        client.getObjectUrl(
          {
            Bucket: cosConfig.bucket,
            Region: cosConfig.region,
            Key: key,
            Method: "PUT",
            Expires: 600,
          },
          (err, data) => {
            if (err) reject(err);
            else resolve(data.Url);
          }
        );
      }),
      new Promise<string>((resolve, reject) => {
        client.getObjectUrl(
          {
            Bucket: cosConfig.bucket,
            Region: cosConfig.region,
            Key: thumbKey,
            Method: "PUT",
            Expires: 600,
          },
          (err, data) => {
            if (err) reject(err);
            else resolve(data.Url);
          }
        );
      }),
    ]);

    return NextResponse.json({
      originalUrl,
      thumbUrl,
      key,
      thumbKey,
    });
  } catch (error) {
    console.error("Failed to generate presigned URLs:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URLs" },
      { status: 500 }
    );
  }
}
