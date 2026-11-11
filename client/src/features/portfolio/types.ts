export type PetType = 'dog' | 'cat';

export interface PetProfile {
  id: PetType;
  name: string;
  species: string;
  emoji: string;
  tagline: string;
  personality: string[];
  pros: string[];
  considerations: string[];
  dailyTimeCommitment: string;
  idealOwner: string;
}

export interface ComparisonMetric {
  attribute: string;
  dogDetail: string;
  catDetail: string;
}

export interface VoteState {
  dogs: number;
  cats: number;
}

