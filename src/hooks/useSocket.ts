"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface NotificationData {
  type: string;
  title: string;
  content: string;
  [key: string]: any;
}

type NotificationCallback = (data: NotificationData) => void;

export function useSocket(userId?: string) {
  const socketRef = useRef<Socket | null>(null);
  const callbacksRef = useRef<Map<string, NotificationCallback[]>>(new Map());

  useEffect(() => {
    if (!userId) return;

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
      path: "/api/socket/io",
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("join-room", userId);
    });

    socket.on("notification", (data: NotificationData) => {
      const callbacks = callbacksRef.current.get("notification") || [];
      callbacks.forEach((cb) => cb(data));
    });

    socket.on("admin-notification", (data: NotificationData) => {
      const callbacks = callbacksRef.current.get("admin-notification") || [];
      callbacks.forEach((cb) => cb(data));
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.emit("leave-room", userId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  const onNotification = useCallback((callback: NotificationCallback) => {
    const callbacks = callbacksRef.current.get("notification") || [];
    callbacksRef.current.set("notification", [...callbacks, callback]);

    return () => {
      const current = callbacksRef.current.get("notification") || [];
      callbacksRef.current.set(
        "notification",
        current.filter((cb) => cb !== callback)
      );
    };
  }, []);

  const onAdminNotification = useCallback((callback: NotificationCallback) => {
    const callbacks = callbacksRef.current.get("admin-notification") || [];
    callbacksRef.current.set("admin-notification", [...callbacks, callback]);

    return () => {
      const current = callbacksRef.current.get("admin-notification") || [];
      callbacksRef.current.set(
        "admin-notification",
        current.filter((cb) => cb !== callback)
      );
    };
  }, []);

  const emit = useCallback((event: string, data: any) => {
    socketRef.current?.emit(event, data);
  }, []);

  return {
    socket: socketRef.current,
    onNotification,
    onAdminNotification,
    emit,
    isConnected: !!socketRef.current?.connected,
  };
}
