"use client";

import { useEffect, useMemo } from "react";
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { ProductJurisdiction } from "@/lib/product-data";
import type { Lang } from "@/lib/i18n";

/* Country/bloc centroid coordinates for the map */
const CENTROIDS: Record<string, [number, number]> = {
  EU: [50.1, 9.7],
  FR: [46.6, 2.2],
  DE: [51.2, 10.4],
  IT: [42.5, 12.5],
  ES: [40.5, -3.7],
  NL: [52.1, 5.3],
  GB: [54.0, -2.5],
  CH: [46.8, 8.2],
  NO: [64.5, 17.1],
  RU: [61.5, 105.3],
  TR: [39.9, 32.9],
  UA: [48.4, 31.2],
  EAEU: [55.0, 73.0],
  US: [39.8, -98.6],
  "US-CA": [36.8, -119.4],
  "US-NY": [43.0, -75.5],
  CA: [56.1, -106.3],
  MX: [23.6, -102.6],
  BR: [-14.2, -51.9],
  AR: [-38.4, -63.6],
  CL: [-35.7, -71.5],
  CO: [4.6, -74.3],
  MERCOSUR: [-22.0, -55.0],
  CN: [35.9, 104.2],
  HK: [22.3, 114.2],
  TW: [23.7, 121.0],
  JP: [36.2, 138.3],
  KR: [35.9, 127.8],
  SG: [1.4, 103.8],
  MY: [4.2, 101.9],
  TH: [15.9, 100.9],
  VN: [14.1, 108.3],
  ID: [-0.8, 113.9],
  PH: [12.9, 121.8],
  IN: [20.6, 78.9],
  AU: [-25.3, 133.8],
  NZ: [-40.9, 174.9],
  ASEAN: [4.0, 108.0],
  GCC: [24.0, 45.0],
  IL: [31.0, 34.8],
  EG: [26.8, 30.8],
  MA: [31.8, -7.1],
  ZA: [-30.6, 22.9],
  NG: [9.1, 8.7],
  KE: [-0.0, 37.9],
  CODEX: [46.2, 6.2],
  ISO: [46.2, 6.2],
  UNECE: [46.2, 6.2],
  WADA: [45.5, -73.6],
  OECD: [48.9, 2.3],
};

function coverageColor(pct: number): string {
  if (pct >= 80) return "#1a8a4a";
  if (pct >= 50) return "#c47a00";
  return "#c4302b";
}

function radiusFor(total: number): number {
  return 5 + Math.log2(total + 1) * 3.2;
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
  jurisdictions: ProductJurisdiction[];
  selected: string | null;
  onSelect: (code: string) => void;
  lang: Lang;
}

export default function ProductMapView({ jurisdictions, selected, onSelect, lang }: Props) {
  const visible = useMemo(
    () => jurisdictions.filter((j) => CENTROIDS[j.code]),
    [jurisdictions]
  );

  const target = useMemo(() => {
    if (!selected) return null;
    return CENTROIDS[selected] ?? null;
  }, [selected]);

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
        {visible.map((j) => {
          const coords = CENTROIDS[j.code];
          const isSelected = selected === j.code;
          const radius = radiusFor(j.total);
          const fillColor = coverageColor(j.pct);
          const baseOpacity = isSelected ? 0.9 : 0.6;
          return (
            <CircleMarker
              key={j.code}
              center={coords}
              radius={radius}
              pathOptions={{
                color: isSelected ? "#060686" : fillColor,
                weight: isSelected ? 3 : 1.5,
                fillColor,
                fillOpacity: baseOpacity,
              }}
              eventHandlers={{
                click: () => onSelect(j.code),
                mouseover: (e) => e.target.setStyle({ fillOpacity: 0.9 }),
                mouseout: (e) => e.target.setStyle({ fillOpacity: baseOpacity }),
              }}
            >
              <Tooltip className="country-tooltip" direction="top" offset={[0, -4]}>
                <span className="font-semibold">{j.flag} {j.name}</span>
                <span className="ml-2 opacity-80">
                  {j.pct}% · {j.found}/{j.total} {lang === "fr" ? "régs" : "regs"}
                </span>
              </Tooltip>
            </CircleMarker>
          );
        })}
        <FlyTo target={target} />
      </MapContainer>
      <CoverageLegend lang={lang} />
    </div>
  );
}

function CoverageLegend({ lang }: { lang: Lang }) {
  const items = [
    { label: lang === "fr" ? "80%+" : "80%+", color: "#1a8a4a" },
    { label: lang === "fr" ? "50-79%" : "50-79%", color: "#c47a00" },
    { label: lang === "fr" ? "< 50%" : "< 50%", color: "#c4302b" },
  ];
  return (
    <div className="absolute bottom-3 left-3 z-[1000] rounded-xl border border-c-border bg-c-surface/95 px-3 py-2 text-xs shadow-sm backdrop-blur">
      <div className="mb-1 font-medium text-c-text-muted">
        {lang === "fr" ? "Couverture" : "Coverage"}
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
