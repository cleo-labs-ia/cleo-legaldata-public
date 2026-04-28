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

export interface Source {
  id: string;
  name: string;
  country: string;
  status: SourceStatus;
  data_types: DataType[];
  url: string;
  auth: string | null;
  priority: number | null;
  notes: string | null;
  blocked_reason: string | null;
  preferred_for: string[] | null;
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
  sources: Source[];
  completion: number;
}

export interface GlobalStats {
  totalSources: number;
  totalCountries: number;
  byStatus: Record<SourceStatus, number>;
  byDataType: Record<DataType, number>;
  generatedAt: string;
}

export interface DashboardData {
  stats: GlobalStats;
  countries: CountryStats[];
}
