import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as SocketIOServer } from "socket.io";

export type NextApiResponseServerIo = {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

export const initSocketServer = (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server as NetServer, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("join-room", (userId: string) => {
        socket.join(`user:${userId}`);
        console.log(`User ${userId} joined room`);
      });

      socket.on("leave-room", (userId: string) => {
        socket.leave(`user:${userId}`);
        console.log(`User ${userId} left room`);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  }
  return res.socket.server.io;
};

export const notifyUser = (io: SocketIOServer, userId: string, notification: any) => {
  io.to(`user:${userId}`).emit("notification", notification);
};

export const notifyAdmins = (io: SocketIOServer, data: any) => {
  io.emit("admin-notification", data);
};
