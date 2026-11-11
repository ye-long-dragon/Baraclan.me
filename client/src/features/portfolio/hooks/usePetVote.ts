import { useState } from 'react';
import type { PetType, VoteState } from '../types';

export function usePetVote() {
  const [votes, setVotes] = useState<VoteState>({ dogs: 14, cats: 18 });
  const [userVoted, setUserVoted] = useState<PetType | null>(null);

  const castVote = (pet: PetType) => {
    if (userVoted === pet) return;

    setVotes((prev) => {
      const next = { ...prev };
      if (userVoted) {
        // Switch vote
        if (userVoted === 'dog') next.dogs -= 1;
        if (userVoted === 'cat') next.cats -= 1;
      }
      if (pet === 'dog') next.dogs += 1;
      if (pet === 'cat') next.cats += 1;
      return next;
    });

    setUserVoted(pet);
  };

  const totalVotes = votes.dogs + votes.cats;
  const dogPercentage = totalVotes ? Math.round((votes.dogs / totalVotes) * 100) : 50;
  const catPercentage = totalVotes ? 100 - dogPercentage : 50;

  return {
    votes,
    userVoted,
    castVote,
    totalVotes,
    dogPercentage,
    catPercentage,
  };
}

