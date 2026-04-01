import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, VideoOff, Mic, MicOff, PhoneOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  duelId: string;
  onClose: () => void;
}

export default function DuelVideoChat({ duelId, onClose }: Props) {
  const { toast } = useToast();
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [room, setRoom] = useState<any>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const localTracksRef = useRef<any[]>([]);

  const cleanup = useCallback(() => {
    localTracksRef.current.forEach((track: any) => {
      track.stop();
      track.detach().forEach((el: HTMLElement) => el.remove());
    });
    localTracksRef.current = [];
    if (room) {
      room.disconnect();
      setRoom(null);
    }
    setConnected(false);
  }, [room]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const joinRoom = async () => {
    setConnecting(true);
    try {
      // Get Twilio token from edge function
      const { data, error } = await supabase.functions.invoke("twilio-video-token", {
        body: { duelId },
      });
      if (error) throw new Error(error.message || "Failed to get video token");
      if (!data?.token) throw new Error("No token received");

      // Dynamically import Twilio Video SDK
      const TwilioVideo = await import("twilio-video");

      // Create local tracks
      const localTracks = await TwilioVideo.createLocalTracks({
        audio: true,
        video: { width: 320, height: 240 },
      });
      localTracksRef.current = localTracks;

      // Attach local video
      const localVideoTrack = localTracks.find((t) => t.kind === "video") as TwilioVideo.LocalVideoTrack | undefined;
      if (localVideoTrack && localVideoRef.current) {
        localVideoRef.current.innerHTML = "";
        const el = localVideoTrack.attach();
        el.style.width = "100%";
        el.style.height = "100%";
        el.style.objectFit = "cover";
        el.style.borderRadius = "8px";
        localVideoRef.current.appendChild(el);
      }

      // Connect to room
      const connectedRoom = await TwilioVideo.connect(data.token, {
        name: data.roomName,
        tracks: localTracks,
      });
      setRoom(connectedRoom);
      setConnected(true);

      // Handle remote participant
      const handleParticipant = (participant: any) => {
        participant.tracks.forEach((publication: any) => {
          if (publication.isSubscribed && publication.track) {
            attachRemoteTrack(publication.track);
          }
        });
        participant.on("trackSubscribed", (track: any) => attachRemoteTrack(track));
        participant.on("trackUnsubscribed", (track: any) => {
          track.detach().forEach((el: HTMLElement) => el.remove());
        });
      };

      connectedRoom.participants.forEach(handleParticipant);
      connectedRoom.on("participantConnected", handleParticipant);
      connectedRoom.on("participantDisconnected", () => {
        if (remoteVideoRef.current) remoteVideoRef.current.innerHTML = "";
        toast({ title: "Opponent left the video chat" });
      });
      connectedRoom.on("disconnected", () => {
        cleanup();
      });

      toast({ title: "📹 Connected to video chat!" });
    } catch (err: any) {
      console.error("Video chat error:", err);
      toast({
        title: "Video chat error",
        description: err.message || "Could not connect",
        variant: "destructive",
      });
      cleanup();
    } finally {
      setConnecting(false);
    }
  };

  const attachRemoteTrack = (track: any) => {
    if (remoteVideoRef.current && (track.kind === "video" || track.kind === "audio")) {
      const el = track.attach();
      if (track.kind === "video") {
        el.style.width = "100%";
        el.style.height = "100%";
        el.style.objectFit = "cover";
        el.style.borderRadius = "8px";
      }
      remoteVideoRef.current.appendChild(el);
    }
  };

  const toggleVideo = () => {
    const videoTrack = localTracksRef.current.find((t: any) => t.kind === "video");
    if (videoTrack) {
      if (videoEnabled) videoTrack.disable();
      else videoTrack.enable();
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleAudio = () => {
    const audioTrack = localTracksRef.current.find((t: any) => t.kind === "audio");
    if (audioTrack) {
      if (audioEnabled) audioTrack.disable();
      else audioTrack.enable();
      setAudioEnabled(!audioEnabled);
    }
  };

  const hangUp = () => {
    cleanup();
    onClose();
  };

  if (!connected && !connecting) {
    return (
      <Card className="border-primary/20 bg-muted/30">
        <CardContent className="p-4 text-center space-y-3">
          <p className="text-xs text-muted-foreground">
            Start a face-to-face video call with your duel opponent (18+ verified only)
          </p>
          <Button onClick={joinRoom} className="gap-2">
            <Video className="w-4 h-4" /> Join Video Chat
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (connecting) {
    return (
      <Card className="border-primary/20 bg-muted/30">
        <CardContent className="p-4 text-center">
          <p className="text-xs text-muted-foreground animate-pulse">Connecting to video chat...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardContent className="p-2 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <div
              ref={localVideoRef}
              className="w-full aspect-video bg-muted rounded-lg overflow-hidden"
            />
            <span className="absolute bottom-1 left-1 text-[10px] bg-background/70 px-1 rounded text-foreground">
              You
            </span>
          </div>
          <div className="relative">
            <div
              ref={remoteVideoRef}
              className="w-full aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center"
            >
              <p className="text-[10px] text-muted-foreground">Waiting for opponent...</p>
            </div>
            <span className="absolute bottom-1 left-1 text-[10px] bg-background/70 px-1 rounded text-foreground">
              Opponent
            </span>
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            variant={videoEnabled ? "outline" : "destructive"}
            onClick={toggleVideo}
            className="h-8 w-8 p-0"
          >
            {videoEnabled ? <Video className="w-3 h-3" /> : <VideoOff className="w-3 h-3" />}
          </Button>
          <Button
            size="sm"
            variant={audioEnabled ? "outline" : "destructive"}
            onClick={toggleAudio}
            className="h-8 w-8 p-0"
          >
            {audioEnabled ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
          </Button>
          <Button size="sm" variant="destructive" onClick={hangUp} className="h-8 gap-1 text-xs">
            <PhoneOff className="w-3 h-3" /> End
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
