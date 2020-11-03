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
              <div>
                <div className="font-semibold text-gray-800 capitalize">{name}</div>
                <div className="flex pt-2 text-xs font-medium text-gray-500 hover:text-blue-500">
                  <svg
                    className={`block w-4 h-4 mr-1 fill-current`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 20S3 10.87 3 7a7 7 0 1114 0c0 3.87-7 13-7 13zm0-11a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  <a
                    href={`https://www.google.com/maps/search/?q=${latitude},${longitude}&ll=${latitude},${longitude}&z=10`}
                  >
                    ({latitude.toFixed(5)}, {longitude.toFixed(5)})
                  </a>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">
                  ${Intl.NumberFormat().format(price)}
                </div>
                {leagueIdToDistanceMapping && (
                  <div className="float-right pt-2 text-xs font-medium tracking-wider text-gray-500">
                    {leagueIdToDistanceMapping[id].toFixed(2)}mi
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
