import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { fail, ok } from "../../shared/http";
import { query } from "../../shared/database";
import { requirePortalAuth } from "../../shared/auth";
import { ensureClientDataTables } from "../../shared/client-data";

interface StatRow {
  checkIns: number;
  hoursLearned: number;
  certificates: number;
  coursesCompleted: number;
}

export async function clientDashboard(req: HttpRequest): Promise<HttpResponseInit> {
  if (req.method?.toUpperCase() !== "GET") {
    return fail("method_not_allowed", "Unsupported method", 405);
  }

  const auth = await requirePortalAuth(req, { allowedRoles: ["client"] });
  if (auth.response || !auth.user) {
    return auth.response!;
  }

  await ensureClientDataTables();

  const userId = auth.user.id;

  const statsRows = await query<StatRow>(
    `SELECT
      (SELECT COUNT(*) FROM ActivityLogs WHERE UserId = @userId) as checkIns,
      (SELECT ISNULL(COUNT(*), 0) FROM ProgressLogs WHERE UserId = @userId) as hoursLearned,
      (SELECT ISNULL(COUNT(*), 0) FROM ProgressLogs WHERE UserId = @userId AND Status = 'Completed' AND Category = 'Certificate') as certificates,
      (SELECT ISNULL(COUNT(*), 0) FROM ProgressLogs WHERE UserId = @userId AND Status = 'Completed') as coursesCompleted`,
    { userId }
  );

  const stats = statsRows[0] || {
    checkIns: 0,
    hoursLearned: 0,
    certificates: 0,
    coursesCompleted: 0,
  };

  const courseRows = await query<{ id: number; title: string; status: string }>(
    `SELECT TOP 5 Id as id, Title as title, Status as status
     FROM ProgressLogs
     WHERE UserId = @userId
     ORDER BY UpdatedAt DESC`,
    { userId }
  );

  const courses = courseRows.map((course) => ({
    id: String(course.id),
    title: course.title,
    progress: course.status === "Completed" ? 100 : 50,
    completed: course.status === "Completed",
  }));

  const activityRows = await query<{ id: number; title: string; type: string; scheduledAt: Date; durationMinutes: number }>(
    `SELECT TOP 5 Id as id, Title as title, Type as type, ScheduledAt as scheduledAt, DurationMinutes as durationMinutes
     FROM Appointments
     WHERE UserId = @userId
     ORDER BY ScheduledAt ASC`,
    { userId }
  );

  const activities = activityRows.map((activity) => ({
    id: String(activity.id),
    title: activity.title,
    type: activity.type?.toLowerCase() === "training" ? "event" : "meeting",
    date: new Date(activity.scheduledAt).toISOString().slice(0, 10),
    time: new Date(activity.scheduledAt).toISOString(),
    location: `Duration ${activity.durationMinutes || 60} mins`,
  }));

  const messageRows = await query<{
    id: string;
    senderId: string;
    senderName: string;
    subject: string;
    preview: string;
    timestamp: Date;
    isRead: boolean;
  }>(
    `SELECT TOP 5
        Id as id,
        SenderId as senderId,
        SenderName as senderName,
        Subject as subject,
        Preview as preview,
        [Timestamp] as timestamp,
        IsRead as isRead
     FROM ClientMessages
     WHERE UserId = @userId
     ORDER BY [Timestamp] DESC`,
    { userId }
  );

  const messages = messageRows.map((message) => ({
    id: message.id,
    senderId: message.senderId,
    senderName: message.senderName,
    subject: message.subject,
    preview: message.preview,
    timestamp: new Date(message.timestamp).toISOString(),
    read: Boolean(message.isRead),
  }));

  const payload = {
    stats,
    progress: {
      coursesCompleted: stats.coursesCompleted,
      totalCourses: Math.max(stats.coursesCompleted + 2, 3),
      milestones: [
        { id: "profile", title: "Profile Setup", completed: true },
        { id: "first-course", title: "Complete First Course", completed: stats.coursesCompleted > 0 },
        { id: "career", title: "Career Plan", completed: stats.coursesCompleted > 2 },
      ],
    },
    courses,
    activities,
    messages,
  };

  return ok(payload);
}

app.http("v1-client-dashboard", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "v1/client/dashboard",
  handler: clientDashboard,
});
