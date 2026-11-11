import React from 'react';
import type { PetProfile } from '../types';

interface PetCardProps {
  profile: PetProfile;
  isFavorite: boolean;
  onSelectFavorite: (id: PetProfile['id']) => void;
}

export const PetCard: React.FC<PetCardProps> = ({
  profile,
  isFavorite,
  onSelectFavorite,
}) => {
  return (
    <article className={`pet-card ${isFavorite ? 'pet-card-favorite' : ''}`}>
      <div className="pet-card-header">
        <span className="pet-emoji" role="img" aria-label={profile.name}>
          {profile.emoji}
        </span>
        <div>
          <h3 className="pet-title">{profile.name}</h3>
          <p className="pet-species">{profile.species}</p>
        </div>
      </div>

      <p className="pet-tagline">{profile.tagline}</p>

      <div className="pet-traits">
        {profile.personality.map((trait) => (
          <span key={trait} className="trait-chip">
            {trait}
          </span>
        ))}
      </div>

      <div className="pet-details-section">
        <h4>Key Benefits</h4>
        <ul>
          {profile.pros.map((pro, index) => (
            <li key={index}>{pro}</li>
          ))}
        </ul>

        <h4>Commitment Factors</h4>
        <ul>
          {profile.considerations.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="pet-footer">
        <p className="pet-meta">
          <strong>Daily commitment:</strong> {profile.dailyTimeCommitment}
        </p>
        <button
          type="button"
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={() => onSelectFavorite(profile.id)}
        >
          {isFavorite ? `★ Your Choice: ${profile.emoji}` : `Choose as Favorite`}
        </button>
      </div>
    </article>
  );
};

