import { NextRequest, NextResponse } from "next/server";
import { upsertClientCredential } from "@/auth";

/**
 * Admin endpoint to create a test client credential
 * Protected by SETUP_TOKEN environment variable
 * 
 * Usage (one-time):
 * curl -X POST http://localhost:3000/api/admin/setup-test-client \
 *   -H "Authorization: Bearer SETUP_TOKEN_VALUE"
 */

export async function POST(req: NextRequest) {
  // Check authorization
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const setupToken = process.env.SETUP_TOKEN;

  if (!setupToken || !token || token !== setupToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const credential = await upsertClientCredential({
      email: "dthreemack@gmail.com",
      username: "dthreemack",
      password: "DFCHANGEFirst",
      name: "Test Client",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Test client credential created successfully",
        credential: {
          email: credential.email,
          username: credential.username,
          name: credential.name,
          createdAt: credential.approvedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create test client:", error);
    return NextResponse.json(
      { error: "Failed to create credential" },
      { status: 500 }
    );
  }
}
