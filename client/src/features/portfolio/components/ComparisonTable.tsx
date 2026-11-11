import React from 'react';
import type { ComparisonMetric } from '../types';

interface ComparisonTableProps {
  metrics: ComparisonMetric[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ metrics }) => {
  return (
    <section className="comparison-section">
      <h2 className="section-title">Head-to-Head Comparison</h2>
      <p className="section-subtitle">
        See how dogs and cats differ across day-to-day lifestyle dimensions.
      </p>

      <div className="table-responsive">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Aspect</th>
              <th>🐶 Dogs</th>
              <th>🐱 Cats</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((row) => (
              <tr key={row.attribute}>
                <td className="category-cell">
                  <strong>{row.attribute}</strong>
                </td>
                <td className="detail-cell dog-cell">{row.dogDetail}</td>
                <td className="detail-cell cat-cell">{row.catDetail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

