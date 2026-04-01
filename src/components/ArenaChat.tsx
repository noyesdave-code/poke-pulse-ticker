import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageCircle, Users, Swords, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AgeVerificationGate from "./AgeVerificationGate";

interface ChatMessage {
  id: string;
  sender_id: string;
  channel: string;
  message: string;
  created_at: string;
  sender_name?: string;
}

interface Props {
  channel?: string;
  title?: string;
}

export default function ArenaChat({ channel = "lobby", title }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Check age verification
  useEffect(() => {
    if (!user) return;
    const check = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("chat_age_verified")
        .eq("id", user.id)
        .single();
      setVerified(!!(data as any)?.chat_age_verified);
    };
    check();
  }, [user]);

  // Fetch messages + subscribe to realtime
  useEffect(() => {
    if (!verified) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("arena_chat_messages" as any)
        .select("*")
        .eq("channel", channel)
        .order("created_at", { ascending: true })
        .limit(100);
      if (data) {
        setMessages(data as unknown as ChatMessage[]);
        // Fetch display names for senders
        const senderIds = [...new Set((data as any[]).map((m: any) => m.sender_id))];
        if (senderIds.length > 0) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("id, display_name")
            .in("id", senderIds);
          if (profileData) {
            const map: Record<string, string> = {};
            profileData.forEach((p) => { map[p.id] = p.display_name || "Trainer"; });
            setProfiles((prev) => ({ ...prev, ...map }));
          }
        }
      }
    };

    fetchMessages();

    const sub = supabase
      .channel(`chat-${channel}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "arena_chat_messages",
        filter: `channel=eq.${channel}`,
      }, async (payload) => {
        const msg = payload.new as unknown as ChatMessage;
        setMessages((prev) => [...prev, msg]);
        // Fetch sender name if missing
        if (!profiles[msg.sender_id]) {
          const { data } = await supabase
            .from("profiles")
            .select("id, display_name")
            .eq("id", msg.sender_id)
            .single();
          if (data) {
            setProfiles((prev) => ({ ...prev, [data.id]: data.display_name || "Trainer" }));
          }
        }
      })
      .on("postgres_changes", {
        event: "DELETE",
        schema: "public",
        table: "arena_chat_messages",
        filter: `channel=eq.${channel}`,
      }, (payload) => {
        setMessages((prev) => prev.filter((m) => m.id !== (payload.old as any).id));
      })
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, [verified, channel]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!user || !newMessage.trim() || sending) return;
    const text = newMessage.trim().slice(0, 500); // Max 500 chars
    setSending(true);
    setNewMessage("");
    try {
      const { error } = await supabase.from("arena_chat_messages" as any).insert({
        sender_id: user.id,
        channel,
        message: text,
      } as any);
      if (error) throw error;
    } catch (err: any) {
      toast({ title: "Error sending message", description: err.message, variant: "destructive" });
      setNewMessage(text);
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (id: string) => {
    await supabase.from("arena_chat_messages" as any).delete().eq("id", id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user) return null;
  if (verified === null) return <div className="text-xs text-muted-foreground text-center py-8">Loading...</div>;
  if (!verified) return <AgeVerificationGate onVerified={() => setVerified(true)} />;

  const isLobby = channel === "lobby";
  const chatTitle = title || (isLobby ? "Arena Lobby Chat" : "Duel Chat");
  const chatIcon = isLobby ? <Users className="w-4 h-4 text-primary" /> : <Swords className="w-4 h-4 text-primary" />;

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          {chatIcon}
          {chatTitle}
          <Badge variant="outline" className="text-[10px] ml-auto">
            <MessageCircle className="w-3 h-3 mr-1" />
            18+ ONLY
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <ScrollArea className="h-64 rounded-lg bg-muted/20 border border-border p-2" ref={scrollRef}>
          <div className="space-y-2">
            {messages.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">
                {isLobby ? "No messages yet. Say hello!" : "Chat with your opponent!"}
              </p>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_id === user.id;
                const name = profiles[msg.sender_id] || "Trainer";
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-lg px-3 py-2 ${isMe ? "bg-primary/20 border border-primary/30" : "bg-muted/50 border border-border"}`}>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-bold ${isMe ? "text-primary" : "text-foreground"}`}>
                          {isMe ? "You" : name}
                        </span>
                        <span className="text-[9px] text-muted-foreground">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {isMe && (
                          <button onClick={() => deleteMessage(msg.id)} className="text-muted-foreground hover:text-destructive transition-colors ml-auto">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-foreground break-words">{msg.message}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            maxLength={500}
            className="text-xs bg-muted/30"
          />
          <Button size="sm" onClick={sendMessage} disabled={!newMessage.trim() || sending} className="gap-1">
            <Send className="w-3 h-3" />
          </Button>
        </div>

        <p className="text-[9px] text-muted-foreground text-center">
          Be respectful. Harassment or inappropriate content = permanent ban. Max 500 chars.
        </p>
      </CardContent>
    </Card>
  );
}
