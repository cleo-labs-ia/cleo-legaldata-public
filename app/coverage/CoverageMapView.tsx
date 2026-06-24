"use client";

import { useEffect, useMemo } from "react";
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import type { CovMarket, CovGeo } from "@/lib/coverage-data";
import { captureColor } from "@/lib/coverage-data";
import type { Lang } from "@/lib/i18n";

function radiusFor(regs: number): number {
  return 5 + Math.log2(regs + 1) * 2.6;
}

function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyTo(target, Math.max(map.getZoom(), 4), { duration: 0.6 });
  }, [target, map]);
  return null;
}

interface Props {
  markets: CovMarket[];
  geo: CovGeo;
  selected: string | null;
  onSelect: (code: string) => void;
  lang: Lang;
}

export default function CoverageMapView({
  markets,
  geo,
  selected,
  onSelect,
  lang,
}: Props) {
  const visible = useMemo(
    () => markets.filter((m) => geo[m.c]),
    [markets, geo],
  );

  const target = useMemo(() => {
    if (!selected || !geo[selected]) return null;
    return [geo[selected].lat, geo[selected].lng] as [number, number];
  }, [selected, geo]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-c-border bg-c-surface-2">
      <MapContainer
        center={[25, 10]}
        zoom={2}
        minZoom={2}
        maxZoom={7}
        worldCopyJump
        scrollWheelZoom
        className="h-full w-full"
        attributionControl
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
        {visible.map((m) => {
          const g = geo[m.c];
          const isSelected = selected === m.c;
          const fillColor = captureColor(m.p);
          const baseOpacity = isSelected ? 0.92 : 0.6;
          return (
            <CircleMarker
              key={`${m.c}-${m.p}`}
              center={[g.lat, g.lng]}
              radius={radiusFor(m.g)}
              pathOptions={{
                color: isSelected ? "#060686" : fillColor,
                weight: isSelected ? 3 : 1.5,
                fillColor,
                fillOpacity: baseOpacity,
              }}
              eventHandlers={{
                click: () => onSelect(m.c),
                mouseover: (e) => e.target.setStyle({ fillOpacity: 0.92 }),
                mouseout: (e) => e.target.setStyle({ fillOpacity: baseOpacity }),
              }}
            >
              <Tooltip className="country-tooltip" direction="top" offset={[0, -4]}>
                <span className="font-semibold">
                  {g.flag} {g.name}
                </span>
                <span className="ml-2 opacity-80">
                  {m.p}% {lang === "fr" ? "veille live" : "live-monitored"}
                </span>
                <span className="ml-1 opacity-60 text-[10px]">
                  · {m.g.toLocaleString()} {lang === "fr" ? "régs" : "regs"} · {m.a}{" "}
                  {lang === "fr" ? "autorités" : "authorities"}
                </span>
              </Tooltip>
            </CircleMarker>
          );
        })}
        <FlyTo target={target} />
      </MapContainer>
      <MapLegend lang={lang} />
    </div>
  );
}

function MapLegend({ lang }: { lang: Lang }) {
  const items = [
    { label: lang === "fr" ? "≥ 50 % capté" : "≥ 50% captured", color: "#1a8a4a" },
    { label: "5–50%", color: "#e8820e" },
    { label: lang === "fr" ? "< 5 %" : "< 5%", color: "#c4302b" },
  ];
  return (
    <div className="absolute bottom-3 left-3 z-[1000] rounded-xl border border-c-border bg-c-surface/95 px-3 py-2 text-xs shadow-sm backdrop-blur">
      <div className="mb-1 font-medium text-c-text-muted">
        {lang === "fr" ? "Veille live (flux RSS)" : "Live monitoring (RSS feed)"}
      </div>
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: it.color }} />
            <span>{it.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
