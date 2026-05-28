import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import {
  getConversations,
  getMessagesWithUser,
  sendMessage,
  markMessagesRead,
} from "../lib/MessageApi";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Search, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function MessagesPage() {

  const { user } = useAuth();

  // DEMO DATA
  const [conversations, setConversations] = useState<any[]>([]);

  const [activeChatId, setActiveChatId] =
    useState<number | null>(null);

  const [messages, setMessages] =
    useState<any[]>([]);

  const [newMsg, setNewMsg] =
    useState("");

  const [typing, setTyping] =
    useState(false);

  const [onlineUsers] =
    useState<number[]>([1, 2, 3]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const fetchConversations = async (
    silent = false
  ) => {

    try {

      const data =
        await getConversations();

      if (data && data.length > 0) {
        setConversations(data);
      }

      if (!silent)
        setLoading(false);

    } catch (error) {

      console.error(
        "Error fetching conversations:",
        error
      );

      if (!silent)
        setLoading(false);
    }
  };

  const fetchMessages = async (
    otherUserId: number,
    silent = false
  ) => {

    try {

      const data =
        await getMessagesWithUser(
          otherUserId
        );

      setMessages(data || []);

    } catch (error) {

      console.error(
        "Error fetching messages:",
        error
      );
    }
  };

  // INITIAL LOAD
  useEffect(() => {

    document.title =
      "Messages | RentEase";

    fetchConversations();

  }, []);

  // SET DEFAULT CHAT
  useEffect(() => {

    if (
      conversations.length > 0 &&
      activeChatId === null
    ) {

      setActiveChatId(
        conversations[0].otherUserId
      );
    }

  }, [conversations, activeChatId]);

  // LOAD CHAT HISTORY
  useEffect(() => {

    if (
      activeChatId !== null
    ) {

      fetchMessages(
        activeChatId
      );

      markMessagesRead(
        activeChatId
      )
        .then(() => {
          fetchConversations(
            true
          );
        })
        .catch(console.error);
    }

  }, [activeChatId]);

  // POLLING
  useEffect(() => {

    if (
      activeChatId === null
    )
      return;

    const interval =
      setInterval(() => {

        fetchMessages(
          activeChatId,
          true
        );

        fetchConversations(
          true
        );

      }, 4000);

    return () =>
      clearInterval(interval);

  }, [activeChatId]);

  // AUTO SCROLL
  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [messages]);

  const handleTyping = (
    value: string
  ) => {

    setNewMsg(value);

    setTyping(true);

    setTimeout(() => {
      setTyping(false);
    }, 1500);
  };

  const handleSend =
    async () => {

      if (
        !newMsg.trim() ||
        activeChatId === null
      )
        return;

      try {

        const sent =
          await sendMessage(
            activeChatId,
            newMsg.trim()
          );

        setMessages((prev) => [
          ...prev,
          sent,
        ]);

        setNewMsg("");

        fetchConversations(
          true
        );

      } catch (error) {

        console.error(
          "Error sending message:",
          error
        );

        toast.error(
          "Failed to send message."
        );
      }
    };

  const active =
    conversations.find(
      (c) =>
        c.otherUserId ===
        activeChatId
    );

  const getInitials = (
    name: string
  ) => {

    if (!name) return "";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (
    timeStr: any
  ) => {

    if (!timeStr)
      return "";

    try {

      const date =
        new Date(timeStr);

      return date.toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );

    } catch {

      return String(timeStr);
    }
  };

  const filteredConversations =
    conversations.filter((c) =>
      (
        c.otherUserName || ""
      )
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <DashboardLayout>

      <div className="space-y-6">

        <div>

          <h1 className="text-2xl font-bold text-foreground">
            Inbox
          </h1>

          <p className="text-sm text-muted-foreground">
            Chat with property owners
            and tenants
          </p>

        </div>

        {loading ? (

          <div className="flex h-[calc(100vh-14rem)] items-center justify-center rounded-xl border border-border bg-card">

            <p className="animate-pulse text-muted-foreground">
              Loading conversations...
            </p>

          </div>

        ) : conversations.length === 0 ? (

          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-20">

            <MessageSquare className="mb-3 h-12 w-12 text-muted-foreground/35" />

            <h3 className="text-lg font-semibold text-foreground">
              No messages yet
            </h3>

            <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
              You can contact property
              owners directly from
              their property details
              page to start a chat.
            </p>

            <Button
              asChild
              className="bg-gradient-hero"
            >
              <Link to="/explore">
                Explore properties
              </Link>
            </Button>

          </div>

        ) : (

          <div className="flex h-[calc(100vh-14rem)] min-h-[500px] overflow-hidden rounded-xl border border-border bg-card shadow-card">

            {/* SIDEBAR */}
            <div className="flex w-80 shrink-0 flex-col border-r border-border">

              <div className="border-b border-border p-3">

                <div className="relative">

                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    placeholder="Search conversations..."
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    className="h-9 pl-9 text-sm"
                  />

                </div>

              </div>

              <div className="flex-1 overflow-auto">

                {filteredConversations.map(
                  (c) => (

                    <button
                      key={
                        c.otherUserId
                      }
                      onClick={() =>
                        setActiveChatId(
                          c.otherUserId
                        )
                      }
                      className={`flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-secondary ${
                        activeChatId ===
                        c.otherUserId
                          ? "border-r-2 border-primary bg-primary/5"
                          : ""
                      }`}
                    >

                      {c.otherUserAvatar ? (

                        <img
                          src={
                            c.otherUserAvatar
                          }
                          alt={
                            c.otherUserName
                          }
                          className="h-10 w-10 shrink-0 rounded-full object-cover"
                        />

                      ) : (

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">

                          {getInitials(
                            c.otherUserName
                          )}

                        </div>

                      )}

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center justify-between">

                          <p className="truncate text-sm font-semibold text-foreground">
                            {
                              c.otherUserName
                            }
                          </p>

                          <span className="shrink-0 text-[10px] text-muted-foreground">
                            {formatTime(
                              c.timestamp
                            )}
                          </span>

                        </div>

                        <p
                          className={`truncate text-xs ${
                            c.unreadCount >
                            0
                              ? "font-semibold text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {c.lastMessage}
                        </p>

                      </div>

                      {c.unreadCount >
                        0 && (

                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">

                          {
                            c.unreadCount
                          }

                        </span>

                      )}

                    </button>
                  )
                )}

              </div>

            </div>

            {/* CHAT WINDOW */}
            <div className="flex flex-1 flex-col bg-background">

              {active ? (

                <>

                  {/* HEADER */}
                  <div className="flex items-center gap-3 border-b border-border bg-card p-4">

                    {active.otherUserAvatar ? (

                      <img
                        src={
                          active.otherUserAvatar
                        }
                        alt={
                          active.otherUserName
                        }
                        className="h-9 w-9 rounded-full object-cover"
                      />

                    ) : (

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">

                        {getInitials(
                          active.otherUserName
                        )}

                      </div>

                    )}

                    <div>

                      <p className="text-sm font-semibold text-foreground">
                        {
                          active.otherUserName
                        }
                      </p>

                      <div className="flex items-center gap-2">

                        <p className="text-xs text-muted-foreground">
                          {
                            active.otherUserEmail
                          }
                        </p>

                        {onlineUsers.includes(
                          active.otherUserId
                        ) ? (

                          <span className="text-[10px] font-medium text-green-600">
                            ● Online
                          </span>

                        ) : (

                          <span className="text-[10px] text-muted-foreground">
                            Last seen recently
                          </span>

                        )}

                      </div>

                    </div>

                  </div>

                  {/* MESSAGES */}
                  <div className="flex-1 space-y-3 overflow-auto bg-secondary/10 p-4">

                    {messages.map(
                      (m) => {

                        const isSentByMe =
                          m.sender.id ===
                          user?.id;

                        return (

                          <div
                            key={m.id}
                            className={`flex ${
                              isSentByMe
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >

                            <div
                              className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                                isSentByMe
                                  ? "rounded-br-md bg-gradient-hero text-primary-foreground"
                                  : "rounded-bl-md border border-border bg-card text-foreground"
                              }`}
                            >

                              <p className="whitespace-pre-wrap text-sm">
                                {
                                  m.content
                                }
                              </p>

                              <div className="mt-1 flex items-center justify-end gap-1">

                                <p
                                  className={`text-[10px] ${
                                    isSentByMe
                                      ? "text-primary-foreground/75"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {formatTime(
                                    m.timestamp
                                  )}
                                </p>

                                {isSentByMe && (

                                  <span className="text-[10px]">
                                    ✔✔
                                  </span>

                                )}

                              </div>

                            </div>

                          </div>
                        );
                      }
                    )}

                    <div
                      ref={
                        messagesEndRef
                      }
                    />

                  </div>

                  {/* INPUT */}
                  <div className="border-t border-border bg-card p-3">

                    <div className="flex items-center gap-2">

                      <Input
                        placeholder="Type a message..."
                        value={newMsg}
                        onChange={(e) =>
                          handleTyping(
                            e.target.value
                          )
                        }
                        onKeyDown={(e) =>
                          e.key ===
                            "Enter" &&
                          handleSend()
                        }
                        className="flex-1"
                      />

                      <Button
                        size="icon"
                        className="shrink-0 bg-gradient-hero"
                        onClick={
                          handleSend
                        }
                      >

                        <Send className="h-4 w-4" />

                      </Button>

                    </div>

                    {typing && (

                      <p className="px-1 pt-2 text-xs text-muted-foreground">
                        typing...
                      </p>

                    )}

                  </div>

                </>

              ) : (

                <div className="flex flex-1 flex-col items-center justify-center bg-secondary/5 text-muted-foreground">

                  <MessageSquare className="mb-2 h-10 w-10 text-muted-foreground/30" />

                  <p className="text-sm">
                    Select a conversation
                    to start chatting
                  </p>

                </div>

              )}

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>
  );
}