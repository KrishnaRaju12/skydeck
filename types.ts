
export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  airlineIata?: string;
  origin: Airport;
  destination: Airport;
  date: string;
  durationMinutes: number;
  distanceKm: number;
}

export interface UserSettings {
  birthday?: string;
  theme: 'dark' | 'light';
}

export interface AppStats {
  totalFlights: number;
  totalHours: number;
  totalDistance: number;
  countriesVisited: number;
  airportsVisited: number;
  percentWorldVisited: number;
  percentLifeFlown: number;
}
