import { admin } from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

async function deleteOldUsers() {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000; // Timestamp 24 hours ago

    const usersToDelete = listUsersResult.users
      .filter(
        (user) =>
          user.metadata.creationTime && new Date(user.metadata.creationTime).getTime() < oneDayAgo
      )
      .map((user) => user.uid);

    if (usersToDelete.length > 0) {
      await admin.auth().deleteUsers(usersToDelete);
      console.log(`Deleted ${usersToDelete.length} old users at`, new Date());
    } else {
      console.log("No users older than 1 day to delete at", new Date());
    }
  } catch (error) {
    console.error("Error deleting old users:", error);
  }
}

export async function GET(req: NextRequest) {
  if (req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  await deleteOldUsers();
  return NextResponse.json("Delete unused users successfully");
}
