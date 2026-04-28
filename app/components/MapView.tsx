"use client";

import { useEffect, useMemo, useRef } from "react";
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { CountryStats, DomainGroup } from "@/lib/types";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";

const STATUS_COLOR: Record<string, string> = {
  complete: "#1a8a4a",
  blocked: "#c4302b",
  planned: "#8e8e9c",
  needs_research: "#c47a00",
  new: "#2563eb",
};

function dominantStatus(c: CountryStats): keyof typeof STATUS_COLOR {
  let best = "planned" as keyof typeof STATUS_COLOR;
  let max = -1;
  for (const [s, n] of Object.entries(c.byStatus)) {
    if (n > max) {
      max = n;
      best = s as keyof typeof STATUS_COLOR;
    }
  }
  return best;
}

function radiusFor(total: number): number {
  // log scale so that countries with 1 source remain visible while US (124) stays bounded
  return 5 + Math.log2(total + 1) * 3.2;
}

function FlyTo({ target }: { target: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 4), { duration: 0.6 });
  }, [target, map]);
  return null;
}

interface Props {
  countries: CountryStats[];
  selected: string | null;
  onSelect: (code: string) => void;
  lang: Lang;
  groupFilter: DomainGroup | null;
}

export default function MapView({ countries, selected, onSelect, lang, groupFilter }: Props) {
  const visible = useMemo(() => countries.filter((c) => c.lat !== null && c.lng !== null), [countries]);
  const target = useMemo(() => {
    const c = countries.find((x) => x.code === selected);
    return c && c.lat !== null && c.lng !== null ? { lat: c.lat, lng: c.lng } : null;
  }, [countries, selected]);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden rounded-2xl border border-c-border bg-c-surface-2">
      <MapContainer
        center={[25, 10]}
        zoom={2}
        minZoom={2}
        maxZoom={7}
        worldCopyJump
        scrollWheelZoom
        className="h-full w-full"
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
        />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          opacity={0.7}
          zIndex={400}
        />
        {visible.map((c) => {
          const status = dominantStatus(c);
          const isSelected = selected === c.code;
          const groupCount = groupFilter ? c.byGroup[groupFilter] || 0 : c.total;
          const dimmed = groupFilter !== null && groupCount === 0;
          if (dimmed) return null;
          const radius = radiusFor(groupCount);
          const fillColor = groupFilter ? "#0008cf" : STATUS_COLOR[status];
          const baseOpacity = isSelected ? 0.9 : groupFilter ? 0.65 : 0.55;
          return (
            <CircleMarker
              key={c.code}
              center={[c.lat as number, c.lng as number]}
              radius={radius}
              pathOptions={{
                color: isSelected ? "#060686" : fillColor,
                weight: isSelected ? 3 : 1.5,
                fillColor,
                fillOpacity: baseOpacity,
              }}
              eventHandlers={{
                click: () => onSelect(c.code),
                mouseover: (e) => e.target.setStyle({ fillOpacity: 0.9 }),
                mouseout: (e) => e.target.setStyle({ fillOpacity: baseOpacity }),
              }}
            >
              <Tooltip className="country-tooltip" direction="top" offset={[0, -4]}>
                <span className="font-semibold">{c.flag} {c.name}</span>
                <span className="ml-2 opacity-80">
                  {groupFilter
                    ? `${groupCount} ${STRINGS.group[groupFilter][lang].toLowerCase()}`
                    : STRINGS.sourcesIn[lang](c.total)}
                </span>
              </Tooltip>
            </CircleMarker>
          );
        })}
        <FlyTo target={target} />
      </MapContainer>
      <Legend lang={lang} />
    </div>
  );
}

type StatusKey = "complete" | "blocked" | "planned" | "needs_research" | "new";

function Legend({ lang }: { lang: Lang }) {
  const items: { key: StatusKey; color: string }[] = [
    { key: "complete", color: STATUS_COLOR.complete },
    { key: "blocked", color: STATUS_COLOR.blocked },
    { key: "planned", color: STATUS_COLOR.planned },
    { key: "needs_research", color: STATUS_COLOR.needs_research },
    { key: "new", color: STATUS_COLOR.new },
  ];
  return (
    <div className="absolute bottom-3 left-3 z-[1000] rounded-xl border border-c-border bg-c-surface/95 px-3 py-2 text-xs shadow-sm backdrop-blur">
      <div className="mb-1 font-medium text-c-text-muted">{STRINGS.legend[lang]}</div>
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.key} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: it.color }} />
            <span>{STRINGS.status[it.key][lang]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
