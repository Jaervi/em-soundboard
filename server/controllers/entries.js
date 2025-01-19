const jwt = require("jsonwebtoken");
const router = require("express").Router();

const Entry = require("../models/entry");

router.get("/", async (request, response) => {
  const entries = await Entry.find({});
  response.json(entries);
});

router.post("/", async (request, response) => {
  const entry = new Entry(request.body);

  if (!entry.author || !entry.description || !entry.audio) {
    return response.status(400).json({ error: "missing attributes" });
  }

  const savedEntry = await entry.save();

  response.status(201).json(savedEntry);
});

router.delete("/:id", async (request, response) => {
  console.log(`Removing with id ${request.params.id}`);
  const entry = await Entry.findById(request.params.id);
  if (!entry) {
    return response.status(204).end();
  }

  await entry.deleteOne();
  response.status(204).end();
});

router.put("/:id", async (request, response) => {
  const body = request.body;

  const entry = {
    author: body.author,
    description: body.description,
    audio: body.audio,
  };

  const updatedEntry = await updatedEntry.findByIdAndUpdate(
    request.params.id,
    entry,
    { new: true }
  );
  response.json(updatedEntry);
});

module.exports = router;
