export type SourceStatus =
  | "complete"
  | "blocked"
  | "planned"
  | "needs_research"
  | "new";

export type DataType =
  | "legislation"
  | "case_law"
  | "doctrine"
  | "parliamentary_proceedings";

export type Domain =
  | "ai"
  | "data_protection"
  | "cyber"
  | "health"
  | "safety"
  | "labor"
  | "finance"
  | "environment"
  | "competition"
  | "tax"
  | "consumer"
  | "ip"
  | "telecom"
  | "generalist";

export interface Source {
  id: string;
  name: string;
  country: string;
  status: SourceStatus;
  data_types: DataType[];
  domains: Domain[];
  url: string;
  auth: string | null;
  priority: number | null;
  notes: string | null;
  blocked_reason: string | null;
  preferred_for: string[] | null;
  estimatedVolume: number | null;
}

export interface CountryStats {
  code: string;
  name: string;
  flag: string;
  lat: number | null;
  lng: number | null;
  total: number;
  byStatus: Record<SourceStatus, number>;
  byDataType: Record<DataType, number>;
  byDomain: Record<Domain, number>;
  estimatedVolume: number;
  sourcesWithVolume: number;
  sources: Source[];
  completion: number;
}

export interface GlobalStats {
  totalSources: number;
  totalCountries: number;
  byStatus: Record<SourceStatus, number>;
  byDataType: Record<DataType, number>;
  byDomain: Record<Domain, number>;
  estimatedTotalVolume: number;
  sourcesWithVolume: number;
  generatedAt: string;
}

export interface DashboardData {
  stats: GlobalStats;
  countries: CountryStats[];
}
