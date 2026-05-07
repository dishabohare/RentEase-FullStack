import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { conversations } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Search } from "lucide-react";

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(conversations[0].id);
  const [newMsg, setNewMsg] = useState("");
  const [chatData, setChatData] = useState(conversations);

  const active = chatData.find((c) => c.id === activeChat)!;

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    setChatData((prev) =>
      prev.map((c) =>
        c.id === activeChat
          ? { ...c, messages: [...c.messages, { id: `m${Date.now()}`, text: newMsg, sent: true, timestamp: "Just now" }], lastMessage: newMsg }
          : c
      )
    );
    setNewMsg("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="container flex-1 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">Messages</h1>
        <div className="flex h-[600px] overflow-hidden rounded-xl border border-border bg-card shadow-card">
          {/* Sidebar */}
          <div className="w-80 shrink-0 border-r border-border flex flex-col">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-9 h-9 text-sm" />
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              {chatData.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveChat(c.id)}
                  className={`flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-secondary ${
                    activeChat === c.id ? "bg-primary/5 border-r-2 border-primary" : ""
                  }`}
                >
                  <img src={c.senderAvatar} alt={c.senderName} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground truncate">{c.senderName}</p>
                      <span className="text-xs text-muted-foreground shrink-0">{c.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{c.unread}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat window */}
          <div className="flex flex-1 flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border p-4">
              <img src={active.senderAvatar} alt={active.senderName} className="h-9 w-9 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold text-foreground">{active.senderName}</p>
                <p className="text-xs text-success">Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {active.messages.map((m) => (
                <div key={m.id} className={`flex ${m.sent ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                    m.sent ? "bg-gradient-hero text-primary-foreground rounded-br-md" : "bg-secondary text-foreground rounded-bl-md"
                  }`}>
                    <p className="text-sm">{m.text}</p>
                    <p className={`text-[10px] mt-1 ${m.sent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1"
                />
                <Button size="icon" className="bg-gradient-hero shrink-0" onClick={sendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
