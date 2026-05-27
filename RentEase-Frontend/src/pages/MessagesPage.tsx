import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { getConversations, getMessagesWithUser, sendMessage, markMessagesRead } from "../lib/MessageApi";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Search, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async (silent = false) => {
    try {
      const data = await getConversations();
      setConversations(data || []);
      if (!silent) setLoading(false);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      if (!silent) setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId: number, silent = false) => {
    try {
      const data = await getMessagesWithUser(otherUserId);
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Initial load
  useEffect(() => {
    document.title = "Messages | RentEase";
    fetchConversations();
  }, []);

  // Set default active chat if none selected
  useEffect(() => {
    if (conversations.length > 0 && activeChatId === null) {
      setActiveChatId(conversations[0].otherUserId);
    }
  }, [conversations, activeChatId]);

  // Load chat history when active chat changes
  useEffect(() => {
    if (activeChatId !== null) {
      fetchMessages(activeChatId);
      // Mark read
      markMessagesRead(activeChatId).then(() => {
        fetchConversations(true);
      }).catch(console.error);
    }
  }, [activeChatId]);

  // Polling for new messages every 4 seconds
  useEffect(() => {
    if (activeChatId === null) return;
    const interval = setInterval(() => {
      fetchMessages(activeChatId, true);
      fetchConversations(true);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeChatId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMsg.trim() || activeChatId === null) return;
    try {
      const sent = await sendMessage(activeChatId, newMsg.trim());
      setMessages((prev) => [...prev, sent]);
      setNewMsg("");
      fetchConversations(true);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message.");
    }
  };

  const active = conversations.find((c) => c.otherUserId === activeChatId);

  const getInitials = (name: string) => {
    if (!name) return "";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatTime = (timeStr: any) => {
    if (!timeStr) return "";
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return String(timeStr);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    (c.otherUserName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inbox</h1>
          <p className="text-sm text-muted-foreground">Chat with property owners and tenants</p>
        </div>

        {loading ? (
          <div className="flex h-[calc(100vh-14rem)] items-center justify-center rounded-xl border border-border bg-card">
            <p className="text-muted-foreground animate-pulse">Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-xl bg-card">
            <MessageSquare className="h-12 w-12 text-muted-foreground/35 mb-3" />
            <h3 className="text-lg font-semibold text-foreground">No messages yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm text-center mb-6">
              You can contact property owners directly from their property details page to start a chat.
            </p>
            <Button asChild className="bg-gradient-hero">
              <Link to="/explore">Explore properties</Link>
            </Button>
          </div>
        ) : (
          <div className="flex h-[calc(100vh-14rem)] min-h-[500px] overflow-hidden rounded-xl border border-border bg-card shadow-card">
            {/* Sidebar */}
            <div className="w-80 shrink-0 border-r border-border flex flex-col">
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                {filteredConversations.map((c) => (
                  <button
                    key={c.otherUserId}
                    onClick={() => setActiveChatId(c.otherUserId)}
                    className={`flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-secondary ${
                      activeChatId === c.otherUserId ? "bg-primary/5 border-r-2 border-primary" : ""
                    }`}
                  >
                    {c.otherUserAvatar ? (
                      <img
                        src={c.otherUserAvatar}
                        alt={c.otherUserName}
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {getInitials(c.otherUserName)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground truncate">{c.otherUserName}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0">{formatTime(c.timestamp)}</span>
                      </div>
                      <p className={`text-xs truncate ${c.unreadCount > 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                        {c.lastMessage}
                      </p>
                    </div>
                    {c.unreadCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {c.unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat window */}
            <div className="flex flex-1 flex-col bg-background">
              {active ? (
                <>
                  {/* Header */}
                  <div className="flex items-center gap-3 border-b border-border p-4 bg-card">
                    {active.otherUserAvatar ? (
                      <img
                        src={active.otherUserAvatar}
                        alt={active.otherUserName}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {getInitials(active.otherUserName)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-foreground">{active.otherUserName}</p>
                      <p className="text-xs text-muted-foreground">{active.otherUserEmail}</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-auto p-4 space-y-3 bg-secondary/10">
                    {messages.map((m) => {
                      const isSentByMe = m.sender.id === user?.id;
                      return (
                        <div key={m.id} className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                            isSentByMe
                              ? "bg-gradient-hero text-primary-foreground rounded-br-md"
                              : "bg-card text-foreground border border-border rounded-bl-md"
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                            <p className={`text-[10px] mt-1 text-right ${isSentByMe ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
                              {formatTime(m.timestamp)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="border-t border-border p-3 bg-card">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMsg}
                        onChange={(e) => setNewMsg(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        className="flex-1"
                      />
                      <Button size="icon" className="bg-gradient-hero shrink-0" onClick={handleSend}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-secondary/5">
                  <MessageSquare className="h-10 w-10 text-muted-foreground/30 mb-2" />
                  <p className="text-sm">Select a conversation to start chatting</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
