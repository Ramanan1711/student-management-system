import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

import { useDataStore } from "../../../store/DataStore";

interface SearchResult {
  key: string;
  label: string;
  sublabel: string;
  path: string;
}

export default function GlobalSearch() {
  const { students, walkins } = useDataStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const studentHits = students
      .filter((s) =>
        [s.name, s.course, s.batch, s.mobile, s.email]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 5)
      .map<SearchResult>((s) => ({
        key: `s-${s.id}`,
        label: s.name,
        sublabel: `${s.course} · ${s.id}`,
        path: `/students/${s.id}`,
      }));
    const walkinHits = walkins
      .filter((w) =>
        [w.studentName, w.courseInterested, w.email]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 3)
      .map<SearchResult>((w) => ({
        key: `w-${w.id}`,
        label: w.studentName,
        sublabel: `Walk-in · ${w.courseInterested}`,
        path: "/walkins",
      }));
    return [...studentHits, ...walkinHits];
  }, [query, students, walkins]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="flex w-[260px] items-center gap-2 rounded-full bg-[#f8f7f3] px-3 py-2 text-sm text-slate-500 ring-1 ring-slate-200">
        <Search className="h-4 w-4" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          placeholder="Search students, walk-ins..."
          data-testid="global-search-input"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            data-testid="global-search-clear"
            className="rounded-full p-0.5 text-slate-400 hover:text-slate-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </label>

      {open && query && (
        <div
          data-testid="global-search-results"
          className="absolute right-0 mt-2 w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        >
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-500">No matches found</p>
          ) : (
            results.map((item) => (
              <button
                key={item.key}
                type="button"
                data-testid={`global-search-result-${item.key}`}
                onClick={() => {
                  setQuery("");
                  setOpen(false);
                  navigate(item.path);
                }}
                className="flex w-full flex-col items-start gap-0.5 border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50 last:border-b-0"
              >
                <span className="text-sm font-semibold text-slate-800">{item.label}</span>
                <span className="text-xs text-slate-500">{item.sublabel}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
