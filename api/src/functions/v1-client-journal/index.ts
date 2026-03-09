import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { fail, ok } from "../../shared/http";
import { query } from "../../shared/database";
import { requirePortalAuth } from "../../shared/auth";
import { ensureClientDataTables } from "../../shared/client-data";

interface JournalRow {
  id: string;
  date: string;
  type: "daily" | "weekly";
  emotionalState: number;
  trialsBarriers: string;
  progressFeeling: number;
  selfCare: string;
  selfLove: string;
  exercise: string;
  growthMoment: string;
  personalInsight: string;
  isPrivate: boolean;
  summary: string;
}

function toEntry(row: JournalRow) {
  let parsedSelfCare: string[] = [];
  try {
    parsedSelfCare = row.selfCare ? JSON.parse(row.selfCare) : [];
  } catch {
    parsedSelfCare = [];
  }

  return {
    id: row.id,
    date: row.date,
    type: row.type,
    emotionalState: row.emotionalState,
    trialsBarriers: row.trialsBarriers || "",
    progressFeeling: row.progressFeeling,
    selfCare: parsedSelfCare,
    selfLove: row.selfLove || "",
    exercise: row.exercise || "",
    growthMoment: row.growthMoment || "",
    personalInsight: row.personalInsight || "",
    isPrivate: Boolean(row.isPrivate),
    summary: row.summary || undefined,
  };
}

export async function clientJournal(req: HttpRequest): Promise<HttpResponseInit> {
  const auth = await requirePortalAuth(req, { allowedRoles: ["client"] });
  if (auth.response || !auth.user) {
    return auth.response!;
  }

  await ensureClientDataTables();

  const method = req.method?.toUpperCase();

  if (method === "GET") {
    const rows = await query<JournalRow>(
      `SELECT
        Id as id,
        CONVERT(VARCHAR(10), [Date], 23) as date,
        [Type] as type,
        EmotionalState as emotionalState,
        TrialsBarriers as trialsBarriers,
        ProgressFeeling as progressFeeling,
        SelfCare as selfCare,
        SelfLove as selfLove,
        Exercise as exercise,
        GrowthMoment as growthMoment,
        PersonalInsight as personalInsight,
        IsPrivate as isPrivate,
        Summary as summary
       FROM ClientJournalEntries
       WHERE UserId = @userId
       ORDER BY [Date] DESC, CreatedAt DESC`,
      { userId: auth.user.id }
    );

    return ok(rows.map(toEntry));
  }

  if (method === "POST") {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return fail("invalid_json", "Request body must be valid JSON", 400);
    }

    if (!body?.growthMoment || typeof body.growthMoment !== "string") {
      return fail("validation_error", "growthMoment is required", 422);
    }

    const inserted = await query<JournalRow>(
      `INSERT INTO ClientJournalEntries (
        UserId, [Date], [Type], EmotionalState, TrialsBarriers, ProgressFeeling,
        SelfCare, SelfLove, Exercise, GrowthMoment, PersonalInsight, IsPrivate, Summary
      )
      OUTPUT
        INSERTED.Id as id,
        CONVERT(VARCHAR(10), INSERTED.[Date], 23) as date,
        INSERTED.[Type] as type,
        INSERTED.EmotionalState as emotionalState,
        INSERTED.TrialsBarriers as trialsBarriers,
        INSERTED.ProgressFeeling as progressFeeling,
        INSERTED.SelfCare as selfCare,
        INSERTED.SelfLove as selfLove,
        INSERTED.Exercise as exercise,
        INSERTED.GrowthMoment as growthMoment,
        INSERTED.PersonalInsight as personalInsight,
        INSERTED.IsPrivate as isPrivate,
        INSERTED.Summary as summary
      VALUES (
        @userId,
        @date,
        @type,
        @emotionalState,
        @trialsBarriers,
        @progressFeeling,
        @selfCare,
        @selfLove,
        @exercise,
        @growthMoment,
        @personalInsight,
        @isPrivate,
        @summary
      )`,
      {
        userId: auth.user.id,
        date: body.date || new Date().toISOString().slice(0, 10),
        type: body.type === "weekly" ? "weekly" : "daily",
        emotionalState: Number(body.emotionalState) || 5,
        trialsBarriers: body.trialsBarriers || null,
        progressFeeling: Number(body.progressFeeling) || 5,
        selfCare: JSON.stringify(Array.isArray(body.selfCare) ? body.selfCare : []),
        selfLove: body.selfLove || null,
        exercise: body.exercise || null,
        growthMoment: body.growthMoment,
        personalInsight: body.personalInsight || null,
        isPrivate: body.isPrivate ? 1 : 0,
        summary: body.summary || null,
      }
    );

    return ok(toEntry(inserted[0]), 201);
  }

  return fail("method_not_allowed", "Unsupported method", 405);
}

app.http("v1-client-journal", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "v1/client/journal",
  handler: clientJournal,
});
