import "dotenv/config";
import express from "express";
import { prisma } from "./prisma/prismaClient";

const app = express();
app.use(express.json());

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  const user = await prisma.user.create({
    data: { name, email },
  });

  res.json(user);
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
