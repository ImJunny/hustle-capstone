import express, { type Request, type Response } from "express";
import cors from "cors";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/user/updateProfile", async (req, res) => {
  const { uuid, username, first_name, last_name, bio } = req.body;
  try {
    await db
      .update(users)
      .set({
        username,
        first_name,
        last_name,
        bio,
      })
      .where(eq(users.uuid, uuid));
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating profile" });
  }
});

app.post("/user/createUser", async (req, res) => {
  const { uuid, username, first_name, last_name, email } = req.body;
  console.log(req.body);
  // try {
  //   await db.insert(users).values({
  //     uuid,
  //     email,
  //     username: username.toLowerCase(),
  //     first_name,
  //     last_name,
  //   });
  //   res.status(200).json({ message: "Profile updated successfully" });
  // } catch (error) {
  //   res.status(500).json({ error: "Error updating profile" });
  // }
});

app.get("/user/getUserData", async (req: Request, res: Response) => {
  const { uuid } = req.query;

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.uuid, uuid as string))
      .limit(1);

    if (!result.length)
      return res.status(404).json({ error: "User not found." });

    return res.json(result[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error getting user data." });
  }
});

app.get("/test", (req, res) => {
  const a = req.query;
  console.log(a);
  res.json("test");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
