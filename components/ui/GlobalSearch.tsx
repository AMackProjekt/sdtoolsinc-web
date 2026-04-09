"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;
  role: string;
}

interface GlobalSearchProps {
  role?: string;
}

export function GlobalSearch({ role = "any" }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [groups, setGroups] = useState<Record<string, SearchResult[]>>({});
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Auto-focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setGroups({});
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&role=${role}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setGroups(data.groups ?? {});
        setSelectedIndex(0);
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => clearTimeout(timer);
  }, [query, role]);

  const flatResults = results;

  function handleKeyNav(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && flatResults[selectedIndex]) {
      navigate(flatResults[selectedIndex].href);
    }
  }

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  const categoryOrder = Object.keys(groups);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-border bg-white/5 px-3 py-1.5 text-sm text-muted transition-colors hover:border-white/20 hover:text-text"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:flex items-center gap-0.5 rounded-md bg-white/10 px-1.5 py-0.5 text-xs">
          <span>⌘</span><span>K</span>
        </kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.97, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-1/2 top-[12vh] z-50 w-full max-w-xl -translate-x-1/2 rounded-2xl border border-border bg-panel shadow-2xl overflow-hidden"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted flex-shrink-0" />
                ) : (
                  <Search className="h-5 w-5 text-muted flex-shrink-0" />
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyNav}
                  placeholder="Search portal..."
                  className="flex-1 bg-transparent text-base text-text placeholder:text-muted focus:outline-none"
                />
                {query && (
                  <button onClick={() => setQuery("")} title="Clear search" className="text-muted hover:text-text transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto divide-y divide-border/50">
                {query.length >= 2 && results.length === 0 && !loading && (
                  <div className="px-5 py-10 text-center text-sm text-muted">
                    No results for <span className="font-semibold text-text">"{query}"</span>
                  </div>
                )}

                {categoryOrder.map((cat) => (
                  <div key={cat}>
                    <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-widest text-muted">
                      {cat}
                    </p>
                    {groups[cat].map((item) => {
                      const flatIdx = flatResults.indexOf(item);
                      const isSelected = flatIdx === selectedIndex;
                      return (
                        <button
                          key={item.id}
                          onClick={() => navigate(item.href)}
                          onMouseEnter={() => setSelectedIndex(flatIdx)}
                          className={cn(
                            "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                            isSelected ? "bg-white/8" : "hover:bg-white/5"
                          )}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text truncate">{item.title}</p>
                            <p className="text-xs text-muted truncate">{item.description}</p>
                          </div>
                          <ArrowRight className={cn("h-3.5 w-3.5 flex-shrink-0 transition-opacity text-muted", isSelected ? "opacity-100" : "opacity-0")} />
                        </button>
                      );
                    })}
                  </div>
                ))}

                {!query && (
                  <div className="px-5 py-8 text-center space-y-1">
                    <p className="text-sm text-muted">Start typing to search across the portal</p>
                    <p className="text-xs text-muted/60">Use ↑ ↓ to navigate, Enter to go, Esc to close</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
