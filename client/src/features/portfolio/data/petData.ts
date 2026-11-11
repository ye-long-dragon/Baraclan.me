import type { PetProfile, ComparisonMetric } from '../types';

export const PET_PROFILES: Record<'dog' | 'cat', PetProfile> = {
  dog: {
    id: 'dog',
    name: 'Canines (Dogs)',
    species: 'Canis lupus familiaris',
    emoji: '🐶',
    tagline: 'Loyal, pack-oriented, and always eager to be your best friend.',
    personality: ['Social & Outgoing', 'Enthusiastic', 'Trainable', 'Affectionate'],
    pros: [
      'Encourages daily exercise & outdoor adventures',
      'Provides protective awareness & companionship',
      'Highly responsive to verbal commands & training',
    ],
    considerations: [
      'Requires daily outdoor walks & bathroom breaks',
      'Higher ongoing costs (food, grooming, vet visits)',
      'Can experience separation anxiety if left alone too long',
    ],
    dailyTimeCommitment: '2 - 3 hours (walking, feeding, active play)',
    idealOwner: 'Active individuals or families with regular schedules and outdoor space.',
  },
  cat: {
    id: 'cat',
    name: 'Felines (Cats)',
    species: 'Felis catus',
    emoji: '🐱',
    tagline: 'Independent, graceful, and affectionate on their own refined terms.',
    personality: ['Independent', 'Observant', 'Quiet & Calm', 'Playful in bursts'],
    pros: [
      'Indoor litter box trained from an early age',
      'Self-grooming and naturally low-maintenance',
      'Thrives in apartments and small living spaces',
    ],
    considerations: [
      'More subtle communication and boundaries',
      'Litter box must be cleaned daily',
      'Scratches furniture without proper scratching posts',
    ],
    dailyTimeCommitment: '30 - 60 minutes (feeding, litter scoop, gentle play)',
    idealOwner: 'Busy professionals, apartment dwellers, or anyone seeking a calm companion.',
  },
};

export const COMPARISON_METRICS: ComparisonMetric[] = [
  {
    attribute: 'Social Needs',
    dogDetail: 'Pack animal; craves constant human company and interactive play.',
    catDetail: 'Solitary hunter; content relaxing alone for moderate periods.',
  },
  {
    attribute: 'Training Style',
    dogDetail: 'Eager to please; learns cues, tricks, and commands quickly.',
    catDetail: 'Independent; responds best to positive reinforcement and food rewards.',
  },
  {
    attribute: 'Exercise Needs',
    dogDetail: '1 to 2 daily outdoor walks plus mental stimulation.',
    catDetail: 'Short bursts of indoor playtime (laser pointers, feather toys).',
  },
  {
    attribute: 'Bathroom Habits',
    dogDetail: 'Must be walked outside multiple times per day.',
    catDetail: 'Self-sufficiently uses an indoor litter box.',
  },
  {
    attribute: 'Affection Style',
    dogDetail: 'Unconditional, energetic, and overtly expressed with tail wags.',
    catDetail: 'Subtle, gentle purrs, slow blinks, and curling up beside you.',
  },
];

