import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * POST /api/interview-ready/transcribe
 * Body: multipart/form-data with an `audio` field (Blob / File)
 * Returns: { transcript: string }
 *
 * Uses the OpenAI Whisper API when OPENAI_API_KEY is set.
 * Falls back to a stub (empty string) so the UI degrades gracefully
 * without crashing if the key is absent.
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Graceful fallback — voice recording still works; transcript will be empty
    return NextResponse.json({ transcript: "" });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid form data" }, { status: 400 });
  }

  const audioFile = formData.get("audio");
  if (!audioFile || !(audioFile instanceof Blob)) {
    return NextResponse.json({ ok: false, message: "Missing audio field" }, { status: 400 });
  }

  // Whisper requires a filename with a recognised extension
  const extension = audioFile.type.includes("ogg")
    ? "ogg"
    : audioFile.type.includes("mp4") || audioFile.type.includes("m4a")
    ? "m4a"
    : "webm";

  const whisperForm = new FormData();
  whisperForm.append("file", audioFile, `recording.${extension}`);
  whisperForm.append("model", "whisper-1");
  whisperForm.append("language", "en");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: whisperForm,
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("[interview-ready/transcribe] Whisper error:", err);
    return NextResponse.json({ ok: false, message: "Transcription failed" }, { status: 502 });
  }

  const json = (await response.json()) as { text: string };
  return NextResponse.json({ transcript: json.text ?? "" });
}
