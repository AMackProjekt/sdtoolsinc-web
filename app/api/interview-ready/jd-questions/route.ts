import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * POST /api/interview-ready/jd-questions
 * Body: { jobDescription: string }
 * Returns: { questions: string[] }
 *
 * When OPENAI_API_KEY is set, uses GPT-4o-mini to extract role details
 * and generate 8 targeted interview questions.
 * Falls back to a heuristic extractor so the feature works without a key.
 */

const SYSTEM = `You are a compassionate Employment Coach helping people with employment barriers practice for job interviews.
Given a job description, extract the role title, top 3 required skills, and top 2 responsibilities.
Then generate 8 empowering yet realistic interview questions that reflect the specific language of that job posting.
Return ONLY a JSON object with this exact shape:
{ "role": "...", "questions": ["...", "...", ... ] }
No markdown, no explanation—pure JSON.`;

/** Heuristic fallback when no API key is configured */
function heuristicQuestions(jd: string): string[] {
  const lower = jd.toLowerCase();

  const questions: string[] = [
    "Tell me about yourself and why you're interested in this role.",
    "What skills or experience do you have that relate to this position?",
  ];

  if (/(customer|client|guest|patient)/i.test(lower))
    questions.push("Describe a time you helped someone who was frustrated or upset.");
  if (/(team|collaborat|partner|coworker)/i.test(lower))
    questions.push("How do you communicate effectively with teammates?");
  if (/(data|report|spreadsheet|excel|record)/i.test(lower))
    questions.push("How do you stay organized when tracking information or completing detailed tasks?");
  if (/(lift|physical|warehouse|labor|stand)/i.test(lower))
    questions.push("How do you stay focused and safe when doing physically demanding work?");
  if (/(deadline|fast.paced|multitask|prioritiz)/i.test(lower))
    questions.push("Tell me about a time you managed multiple tasks at once. How did you stay on track?");
  if (/(communication|verbal|written|report|document)/i.test(lower))
    questions.push("Give an example of a time you had to explain something clearly to someone.");
  if (/(lead|supervis|manag|mentor|train)/i.test(lower))
    questions.push("Describe a time you guided or supported a coworker or team member.");
  if (/(problem.solv|troubleshoot|resolv|conflict)/i.test(lower))
    questions.push("Tell me about a problem you solved at work or in a past role.");

  // Always cap at 8 and pad with universals if short
  const universals = [
    "What does reliable attendance mean to you?",
    "Why should we hire you for this position?",
    "How do you handle constructive feedback from a supervisor?",
    "What are you most proud of accomplishing in a work or volunteer setting?",
    "Where do you see yourself growing in this type of role?",
    "Do you have reliable transportation or a plan to get to work on time?",
  ];

  let i = 0;
  while (questions.length < 8 && i < universals.length) {
    questions.push(universals[i++]);
  }

  return questions.slice(0, 8);
}

export async function POST(request: NextRequest) {
  let body: { jobDescription?: string };
  try {
    body = (await request.json()) as { jobDescription?: string };
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const jd = (body.jobDescription ?? "").trim();
  if (!jd) {
    return NextResponse.json({ ok: false, message: "jobDescription is required" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ questions: heuristicQuestions(jd), role: "This Role" });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        max_tokens: 600,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `JOB DESCRIPTION:\n${jd.slice(0, 4000)}` },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[interview-ready/jd-questions] OpenAI error:", err);
      return NextResponse.json({ questions: heuristicQuestions(jd), role: "This Role" });
    }

    const json = (await res.json()) as { choices: Array<{ message: { content: string } }> };
    const raw = json.choices?.[0]?.message?.content ?? "{}";

    let parsed: { role?: string; questions?: string[] } = {};
    try {
      parsed = JSON.parse(raw) as typeof parsed;
    } catch {
      // GPT returned non-JSON — fall back
      return NextResponse.json({ questions: heuristicQuestions(jd), role: "This Role" });
    }

    const questions = Array.isArray(parsed.questions) && parsed.questions.length >= 4
      ? parsed.questions.slice(0, 8)
      : heuristicQuestions(jd);

    return NextResponse.json({ questions, role: parsed.role ?? "This Role" });
  } catch (err) {
    console.error("[interview-ready/jd-questions] Fetch error:", err);
    return NextResponse.json({ questions: heuristicQuestions(jd), role: "This Role" });
  }
}
