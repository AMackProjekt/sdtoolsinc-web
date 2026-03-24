"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Lock, WifiOff } from "lucide-react";
import { useSession } from "next-auth/react";

interface GoogleChatEmbedProps {
  spaceId: string;
  spaceName: string;
  themeColor?: "teal" | "slate" | "violet";
  portalType: "client" | "staff" | "admin";
}

export default function GoogleChatEmbed({
  spaceId,
  spaceName,
  themeColor = "teal",
  portalType
}: GoogleChatEmbedProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const themeColors = {
    teal: { border: "border-teal-200", bg: "bg-teal-50", badge: "bg-teal-100 text-teal-700" },
    slate: { border: "border-slate-200", bg: "bg-slate-50", badge: "bg-slate-100 text-slate-700" },
    violet: {
      border: "border-violet-200",
      bg: "bg-violet-50",
      badge: "bg-violet-100 text-violet-700"
    }
  };

  const colors = themeColors[themeColor];

  // Construct secure iframe URL
  const iframeUrl = `https://chat.google.com/u/1/app/chat/${spaceId}?embed=true`;

  if (!session) {
    return (
      <div className={`rounded-2xl border ${colors.border} ${colors.bg} p-12 text-center`}>
        <AlertCircle className={`w-12 h-12 mx-auto mb-4 text-opacity-40 ${colors.badge}`} />
        <p className={`font-bold ${colors.badge}`}>Sign in required</p>
        <p className="text-sm text-slate-600 mt-2">Please sign in to access the messaging channel.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Bar */}
      <div className={`rounded-xl p-4 border ${colors.border} ${colors.bg} flex items-center gap-3`}>
        <Lock className={`w-4 h-4 ${colors.badge}`} />
        <span className={`text-sm font-semibold ${colors.badge}`}>
          Secure Google Chat — {session.user?.email}
        </span>
        {!isOnline && (
          <span className="ml-auto flex items-center gap-2 text-amber-600 text-sm font-medium">
            <WifiOff className="w-4 h-4" /> Offline
          </span>
        )}
      </div>

      {/* Chat Container */}
      <div className="relative rounded-2xl border border-slate-200 overflow-hidden shadow-xl bg-white h-[calc(100vh-24rem)] min-h-[600px] flex">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
              <p className="text-sm font-medium text-slate-600">Loading {spaceName}...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && !isOnline && (
          <div className="absolute inset-0 bg-white/95 flex items-center justify-center z-10">
            <div className="text-center">
              <WifiOff className="w-12 h-12 mx-auto mb-3 text-amber-500" />
              <h3 className="font-bold text-slate-900 mb-1">Offline</h3>
              <p className="text-sm text-slate-600 mb-4">Check your internet connection to access chat.</p>
            </div>
          </div>
        )}

        {/* Iframe */}
        <iframe
          src={iframeUrl}
          title={`${spaceName} Google Chat`}
          className="w-full h-full border-none"
          allow="clipboard-read; clipboard-write"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation-by-user-activation"
        />
      </div>

      {/* Footer Info */}
      <div className="text-xs text-slate-500 flex items-center justify-between px-2">
        <span>
          💡 Tip: You can also{" "}
          <a
            href={`https://chat.google.com/u/1/app/chat/${spaceId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            open in Google Chat app
          </a>
        </span>
        <span className="text-slate-400">Portal: {portalType}</span>
      </div>
    </div>
  );
}
