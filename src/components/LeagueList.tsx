import React from 'react';

import { League } from '../App';
import { LeagueIdToDistanceMapping } from './LeagueFinder';

interface Props {
  leagueIdToDistanceMapping?: LeagueIdToDistanceMapping;
  leagues: Array<League>;
  title: string;
}

export default function LeagueList({ leagues, title, leagueIdToDistanceMapping }: Props) {
  if (leagues.length === 0) return <div />;

  return (
    <div>
      <h2 className="p-6 pb-4 text-lg font-bold text-indigo-700">
        {title} <span className="text-sm font-bold text-gray-500">({leagues.length})</span>
      </h2>

      {leagues.map(({ id, name, price, coordinates: { latitude, longitude } }) => {
        return (
          <div className="px-6 py-3" key={id}>
            <div className="flex justify-between">
              <div className="font-semibold text-gray-800 capitalize">{name}</div>
              <div className="text-sm text-gray-700">${Intl.NumberFormat().format(price)}</div>
            </div>
            {leagueIdToDistanceMapping && (
              <span className="pr-2 text-sm font-medium tracking-wider text-gray-700">
                {leagueIdToDistanceMapping[id].toFixed(2)}mi
              </span>
            )}
            <span className="text-xs text-gray-600">
              ({latitude.toFixed(5)}, {longitude.toFixed(5)})
            </span>
          </div>
        );
      })}
    </div>
  );
}
