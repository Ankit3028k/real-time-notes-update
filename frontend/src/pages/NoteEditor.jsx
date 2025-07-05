import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import socket from "../socket";

function NoteEditor() {
  const { id: noteId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [collaborators, setCollaborators] = useState(1);
  const saveTimeout = useRef(null);

  // Load note from API and join socket room
  useEffect(() => {
    axios.get(`http://localhost:3000/api/notes/${noteId}`).then((res) => {
      setTitle(res.data.title);
      setContent(res.data.content);
      setLastUpdated(res.data.updatedAt);
    });

    socket.emit("join_note", noteId);

    socket.on("note_update", (newContent) => {
      setContent(newContent);
    });

    socket.on("active_users", (count) => {
      setCollaborators(count);
    });

    return () => {
      socket.emit("leave_note", noteId);
      socket.off("note_update");
      socket.off("active_users");
    };
  }, [noteId]);

  const handleChange = (e) => {
    const updatedContent = e.target.value;
    setContent(updatedContent);
    socket.emit("note_update", { noteId, content: updatedContent });

    // Auto save after 3s
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      axios
        .put(`http://localhost:3000/api/notes/${noteId}`, {
          content: updatedContent,
        })
        .then((res) => setLastUpdated(res.data.updatedAt));
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-md rounded-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="text-sm text-gray-600">
          <p>Collaborators: {collaborators}</p>
          <p>Last updated: {new Date(lastUpdated).toLocaleTimeString()}</p>
        </div>
      </div>

      <textarea
        rows={20}
        value={content}
        onChange={handleChange}
        className="w-full border border-gray-300 p-4 rounded-md text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        placeholder="Start typing..."
      />
    </div>
  );
}

export default NoteEditor;
