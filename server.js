const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Route to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Route to serve the notes.html file
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// Route to handle API requests for reading notes
app.get("/api/notes", (req, res) => {
  const notes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "db/db.json"), "utf-8")
  );
  res.json(notes);
});

// Route to handle API requests for saving notes
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  const notes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "db/db.json"), "utf-8")
  );

  // Generate a unique id for the new note
  newNote.id = Date.now().toString();

  // Add the new note to the array of notes
  notes.push(newNote);

  // Write the updated notes array back to the db.json file
  fs.writeFileSync(path.join(__dirname, "db/db.json"), JSON.stringify(notes));

  res.json(newNote);
});

// Route to handle API requests for deleting a note
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  const notes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "db/db.json"), "utf-8")
  );

  // Find the index of the note with the given id
  const noteIndex = notes.findIndex((note) => note.id === noteId);

  if (noteIndex !== -1) {
    // Remove the note from the array
    notes.splice(noteIndex, 1);

    // Write the updated notes array back to the db.json file
    fs.writeFileSync(path.join(__dirname, "db/db.json"), JSON.stringify(notes));

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
