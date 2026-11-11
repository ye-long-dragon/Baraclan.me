import { useState } from 'react';
import type { PetType } from './types';
import { PET_PROFILES, COMPARISON_METRICS } from './data/petData';
import { usePetVote } from './hooks/usePetVote';
import { PetCard } from './components/PetCard';
import { ComparisonTable } from './components/ComparisonTable';
import { VoteSelector } from './components/VoteSelector';
import './portfolio.css';

export const Home = () => {
  const [favoritePet, setFavoritePet] = useState<PetType>('dog');
  const {
    votes,
    userVoted,
    castVote,
    totalVotes,
    dogPercentage,
    catPercentage,
  } = usePetVote();

  return (
    <div className="portfolio-container">
      {/* 1. Header / Hero Section */}
      <header className="portfolio-hero">
        <span className="badge-tag">Sample Feature Component</span>
        <h1>Dogs vs. Cats: The Ultimate Guide</h1>
        <p>
          A modular demonstration of how to structure a full web page with
          separated data models, interactive custom hooks, and reusable UI
          components.
        </p>
      </header>

      {/* 2. Interactive Profiles Grid */}
      <section className="pets-grid">
        <PetCard
          profile={PET_PROFILES.dog}
          isFavorite={favoritePet === 'dog'}
          onSelectFavorite={(id) => setFavoritePet(id)}
        />
        <PetCard
          profile={PET_PROFILES.cat}
          isFavorite={favoritePet === 'cat'}
          onSelectFavorite={(id) => setFavoritePet(id)}
        />
      </section>

      {/* 3. Side-by-Side Comparison Matrix */}
      <ComparisonTable metrics={COMPARISON_METRICS} />

      {/* 4. Interactive State Widget (Hook-driven) */}
      <VoteSelector
        userVoted={userVoted}
        onVote={castVote}
        dogVotes={votes.dogs}
        catVotes={votes.cats}
        dogPercentage={dogPercentage}
        catPercentage={catPercentage}
        totalVotes={totalVotes}
      />

      {/* 5. Architectural Guide Explaining the Structure */}
      <aside className="architecture-guide">
        <h4>📂 Why this structure scales:</h4>
        <ul>
          <li>
            <code>types.ts</code> establishes the TypeScript contract so data remains strictly typed.
          </li>
          <li>
            <code>data/petData.ts</code> separates copy and content from JSX markup.
          </li>
          <li>
            <code>hooks/usePetVote.ts</code> extracts state logic so UI components remain simple and testable.
          </li>
          <li>
            <code>components/</code> breaks down the page into focused, bite-sized visual pieces.
          </li>
          <li>
            <code>home.tsx</code> acts as the conductor orchestrating everything together into one view.
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Home;

