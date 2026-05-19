import { createContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { assistantChatRequest, fetchAssistantContextRequest } from "../api/assistantApi";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";

export const AssistantContext = createContext(null);

function publicGuidance(pathname) {
  if (pathname.includes("/login")) {
    return "Welcome back. Enter your credentials to access your workspace.";
  }

  if (pathname.includes("/signup")) {
    return "Create your workspace account to start collaborating with your team.";
  }

  if (pathname.includes("/forgot-password")) {
    return "Forgot your password? Enter your registered email to reset access securely.";
  }

  if (pathname.includes("/reset-password")) {
    return "Set a new password to restore secure access to your workspace.";
  }

  return "I can help with tasks, projects, deadlines, and productivity workflows inside this workspace.";
}

export function AssistantProvider({ children }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { pushNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [contextData, setContextData] = useState(null);
  const [sending, setSending] = useState(false);
  const seenSystemKeys = useRef(new Set());
  const notifiedTaskIds = useRef(new Set());

  useEffect(() => {
    const syncContext = async () => {
      if (!isAuthenticated) {
        const text = publicGuidance(location.pathname);
        const key = `public-${location.pathname}-${text}`;

        if (!seenSystemKeys.current.has(key)) {
          seenSystemKeys.current.add(key);
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              text,
              createdAt: new Date().toISOString(),
            },
          ]);
        }

        return;
      }

      try {
        const data = await fetchAssistantContextRequest(location.pathname);
        setContextData(data);

        const key = `${location.pathname}-${data.guidance}`;
        if (!seenSystemKeys.current.has(key)) {
          seenSystemKeys.current.add(key);
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              text: data.guidance,
              createdAt: new Date().toISOString(),
            },
          ]);
        }

        data.snapshot?.overdueTasks?.slice(0, 2).forEach((task) => {
          if (notifiedTaskIds.current.has(task.id)) return;
          notifiedTaskIds.current.add(task.id);
          pushNotification({
            title: "Overdue task",
            message: `Reminder: ${task.title} is overdue.`,
            type: "warning",
          });
          toast(`Reminder: ${task.title} is overdue.`, {
            icon: "⚠️",
          });
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Assistant context is unavailable");
      }
    };

    syncContext();
  }, [isAuthenticated, location.pathname, pushNotification]);

  const sendMessage = async (message) => {
    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: message,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setSending(true);

    try {
      if (!isAuthenticated) {
        const reply = publicGuidance(location.pathname);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            text: reply,
            createdAt: new Date().toISOString(),
          },
        ]);
        return;
      }

      const response = await assistantChatRequest({
        route: location.pathname,
        message,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: response.answer,
          source: response.source,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Assistant request failed");
    } finally {
      setSending(false);
    }
  };

  const addAssistantEvent = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const value = {
    isOpen,
    setIsOpen,
    messages,
    sending,
    sendMessage,
    addAssistantEvent,
    contextData,
  };

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}
