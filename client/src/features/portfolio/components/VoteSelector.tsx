import React from 'react';
import type { PetType } from '../types';

interface VoteSelectorProps {
  userVoted: PetType | null;
  onVote: (pet: PetType) => void;
  dogVotes: number;
  catVotes: number;
  dogPercentage: number;
  catPercentage: number;
  totalVotes: number;
}

export const VoteSelector: React.FC<VoteSelectorProps> = ({
  userVoted,
  onVote,
  dogVotes,
  catVotes,
  dogPercentage,
  catPercentage,
  totalVotes,
}) => {
  return (
    <section className="vote-widget">
      <h3>Community Poll: Are you a Dog Person or a Cat Person?</h3>
      <p className="poll-subtext">
        Cast your vote below to update the live community barometer.
      </p>

      <div className="vote-actions">
        <button
          type="button"
          className={`vote-btn dog-vote-btn ${userVoted === 'dog' ? 'voted' : ''}`}
          onClick={() => onVote('dog')}
        >
          🐶 Team Dog ({dogVotes})
        </button>
        <span className="vs-badge">VS</span>
        <button
          type="button"
          className={`vote-btn cat-vote-btn ${userVoted === 'cat' ? 'voted' : ''}`}
          onClick={() => onVote('cat')}
        >
          🐱 Team Cat ({catVotes})
        </button>
      </div>

      <div className="poll-bar-container">
        <div
          className="poll-bar-segment dog-bar"
          style={{ width: `${dogPercentage}%` }}
        >
          {dogPercentage > 15 ? `🐶 ${dogPercentage}%` : ''}
        </div>
        <div
          className="poll-bar-segment cat-bar"
          style={{ width: `${catPercentage}%` }}
        >
          {catPercentage > 15 ? `🐱 ${catPercentage}%` : ''}
        </div>
      </div>

      <p className="poll-footer">
        Total votes cast: <strong>{totalVotes}</strong>{' '}
        {userVoted && <span>• You voted for <strong>{userVoted === 'dog' ? '🐶 Dogs' : '🐱 Cats'}</strong></span>}
      </p>
    </section>
  );
};

