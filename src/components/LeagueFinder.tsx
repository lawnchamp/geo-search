import React, { useState, Fragment } from 'react';

import SearchForLeagues from './SearchForLeagues';
import LeagueList from './LeagueList';

import { League } from '../App';

export interface LeagueIdToDistanceMapping {
  [leagueId: string]: number;
}

interface Props {
  allLeagues: Array<League>;
}

export default function LeagueFinder({ allLeagues }: Props) {
  const [leagueIdToDistanceMapping, setLeagueIdToDistanceMapping] = useState<
    LeagueIdToDistanceMapping
  >({});
  const [maxPriceInput, setMaxPriceInput] = useState<number>(0);

  const [leaguesInPriceRange, totalCost] = findLeaguesInPriceRange();

  function findLeaguesInPriceRange(): [Array<League>, number] {
    if (allLeagues.length === 0) return [[], 0];

    let moneySpent = 0;
    let leaguesInPriceRange: Array<League> = [];

    const sortedLeaguesInSearchRadius: Array<League> = allLeagues
      .filter((league) => leagueIdToDistanceMapping[league.id])
      .sort((a, b) => a.price - b.price);

    for (const league of sortedLeaguesInSearchRadius) {
      if (moneySpent + league.price >= maxPriceInput) break;

      moneySpent += league.price;
      leaguesInPriceRange.push(league);
    }

    return [leaguesInPriceRange, moneySpent];
  }

  return (
    <Fragment>
      <SearchForLeagues
        setLeagueIdToDistanceMapping={setLeagueIdToDistanceMapping}
        maxPriceInput={maxPriceInput}
        setMaxPriceInput={setMaxPriceInput}
      />
      <LeagueList
        title="Search Results"
        leagues={leaguesInPriceRange}
        leagueIdToDistanceMapping={leagueIdToDistanceMapping}
      />
      {leaguesInPriceRange.length > 0 && (
        <div className="w-full p-6 text-sm font-bold tracking-wide text-right text-indigo-600 underline uppercase bg-green-100">
          Total cost:
          <span className="text-lg font-bold text-green-600">
            {' '}
            ${Intl.NumberFormat().format(totalCost)}
          </span>
        </div>
      )}
    </Fragment>
  );
}
