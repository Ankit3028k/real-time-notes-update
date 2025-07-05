
const activeUsers = {}; // { noteId: Set of socket ids }

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    //  Join a note room
    socket.on("join_note", (noteId) => {
      socket.join(noteId);

      if (!activeUsers[noteId]) {
        activeUsers[noteId] = new Set();
      }
      activeUsers[noteId].add(socket.id);

      // Notify all users in the room
      io.to(noteId).emit("active_users", activeUsers[noteId].size);
    });

    //  Receive content update and broadcast
    socket.on("note_update", ({ noteId, content }) => {
      socket.to(noteId).emit("note_update", content);
    });

    //  Handle disconnecting users
    socket.on("disconnecting", () => {
      for (const room of socket.rooms) {
        if (activeUsers[room]) {
          activeUsers[room].delete(socket.id);
          io.to(room).emit("active_users", activeUsers[room].size);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
