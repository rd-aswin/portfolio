import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const apiKey = process.env.CLOUDINARY_API_KEY || "";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "";

const isConfigured = 
  cloudName && 
  apiKey && 
  apiSecret && 
  cloudName !== "your_cloudinary_cloud_name" &&
  apiKey !== "your_cloudinary_api_key" &&
  apiSecret !== "your_cloudinary_api_secret";

// Configure Cloudinary server-side SDK if configured
if (isConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Graceful Demo Mode fallback
    if (!isConfigured) {
      console.warn(`[Cloudinary Server Demo Mode] Upload simulated for: ${file.name}`);
      await new Promise((resolve) => setTimeout(resolve, 800));
      return NextResponse.json({
        public_id: "cld-sample-5",
        secure_url: "https://res.cloudinary.com/demo/image/upload/cld-sample-5.jpg",
      });
    }

    // Convert file object to server buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload using node stream pipeline
    const result = await new Promise<{ public_id: string; secure_url: string } | null>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, uploadResult) => {
          if (error) {
            reject(error);
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            resolve(uploadResult as any);
          }
        }
      );
      uploadStream.end(buffer);
    });

    if (!result) {
      return NextResponse.json({ error: "Cloudinary upload stream failed" }, { status: 500 });
    }

    return NextResponse.json({
      public_id: result.public_id,
      secure_url: result.secure_url,
    });

  } catch (error) {
    console.error("[Server Upload Error]:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server upload failed";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
