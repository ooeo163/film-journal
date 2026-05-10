import COS from "cos-nodejs-sdk-v5";

export const cosConfig = {
  secretId: process.env.COS_SECRET_ID || "",
  secretKey: process.env.COS_SECRET_KEY || "",
  bucket: process.env.COS_BUCKET || "",
  region: process.env.COS_REGION || "ap-guangzhou",
  appId: process.env.COS_APP_ID || "",
};

export function isCosEnabled(): boolean {
  return Boolean(
    cosConfig.secretId &&
      cosConfig.secretKey &&
      cosConfig.bucket &&
      cosConfig.region
  );
}

let cosClient: COS | null = null;

export function getCosClient(): COS {
  if (!cosClient) {
    cosClient = new COS({
      SecretId: cosConfig.secretId,
      SecretKey: cosConfig.secretKey,
    });
  }
  return cosClient;
}

export function getCosResourcePath(): string {
  return `qcs::cos:${cosConfig.region}:uid/${cosConfig.appId}:bucket/${cosConfig.bucket}`;
}
