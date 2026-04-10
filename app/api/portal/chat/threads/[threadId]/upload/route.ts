import { NextRequest, NextResponse } from "next/server";
import { encryptBuffer, decryptBuffer } from "@/lib/chat-crypto";

interface StoredFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string;
  dataEncrypted: string; // encrypted base64
}

const fileStore: Record<string, StoredFile> = {};
let fileCounter = 1;

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/png",
  "image/jpeg",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
]);

const ALLOWED_EXTENSIONS = /\.(pdf|doc|docx|txt|png|jpg|jpeg|xlsx|csv)$/i;
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * POST /api/portal/chat/threads/[threadId]/upload
 * FormData: { file: File, uploadedBy: string }
 * Encrypts file bytes at rest. Returns file metadata.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { threadId: string } }
) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  const uploadedBy = formData.get("uploadedBy");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!uploadedBy || typeof uploadedBy !== "string") {
    return NextResponse.json({ error: "uploadedBy is required" }, { status: 400 });
  }

  // Validate extension
  if (!ALLOWED_EXTENSIONS.test(file.name)) {
    return NextResponse.json(
      { error: "File type not allowed. Accepted: pdf, doc, docx, txt, png, jpg, jpeg, xlsx, csv" },
      { status: 415 }
    );
  }

  // Validate MIME type when provided
  if (file.type && !ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "File MIME type not allowed." },
      { status: 415 }
    );
  }

  // Validate size
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File exceeds 10 MB size limit" },
      { status: 413 }
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const dataEncrypted = encryptBuffer(buf);

  const id = `file-${fileCounter++}`;
  const stored: StoredFile = {
    id,
    name: file.name,
    size: file.size,
    mimeType: file.type || "application/octet-stream",
    uploadedAt: new Date().toISOString(),
    uploadedBy: uploadedBy.substring(0, 100),
    dataEncrypted,
  };

  fileStore[id] = stored;

  return NextResponse.json(
    {
      file: {
        id: stored.id,
        name: stored.name,
        size: stored.size,
        mimeType: stored.mimeType,
        uploadedAt: stored.uploadedAt,
        uploadedBy: stored.uploadedBy,
      },
    },
    { status: 201 }
  );
}

/**
 * GET /api/portal/chat/threads/[threadId]/upload?fileId=file-1
 * Decrypts and streams the file for download.
 */
export async function GET(
  req: NextRequest,
  { params: _params }: { params: { threadId: string } }
) {
  const fileId = req.nextUrl.searchParams.get("fileId");
  if (!fileId) {
    return NextResponse.json({ error: "fileId query param required" }, { status: 400 });
  }

  const stored = fileStore[fileId];
  if (!stored) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const decrypted = decryptBuffer(stored.dataEncrypted);

  return new NextResponse(decrypted, {
    status: 200,
    headers: {
      "Content-Type": stored.mimeType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(stored.name)}"`,
      "Content-Length": String(decrypted.byteLength),
      "Cache-Control": "no-store",
    },
  });
}
