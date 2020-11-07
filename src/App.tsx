import React, { useState, useEffect } from 'react';
import { GeoFirestore } from './index';

import LeagueList from './components/LeagueList';
import LeagueFinder from './components/LeagueFinder';
import NewLeagueCreator from './components/NewLeagueCreator';

import './App.css';

function App() {
  const [refreshLeagueList, setRefreshLeagueList] = useState<boolean>(true);
  const [allLeagues, setAllLeagues] = useState<Array<League>>([]);

  useEffect(() => {
    if (refreshLeagueList) {
      GeoFirestore.collection('leagues')
        .get()
        .then((querySnapshot) => {
          const fetchedLeagues: Array<League> = [];
          querySnapshot.forEach((doc) => {
            const { name, price, coordinates } = doc.data();
            fetchedLeagues.push({ id: doc.id, name, price, coordinates });
          });
          setAllLeagues(fetchedLeagues);
          setRefreshLeagueList(false);
        });
    }
  }, [refreshLeagueList]);

  return (
    <div className="App">
      <h1 className="px-8 py-4 text-3xl font-bold text-gray-700 bg-white shadow-md">
        League Manager
      </h1>
      <div className="flex-wrap justify-center sm:flex">
        <div className="m-3 bg-white rounded-lg shadow-md">
          <NewLeagueCreator refreshLeagueList={() => setRefreshLeagueList(true)} />
          <LeagueList title="All Leagues" leagues={allLeagues} />
        </div>
        <div className="m-3 bg-white rounded-lg shadow-md">
          <LeagueFinder allLeagues={allLeagues} />
        </div>
      </div>
    </div>
  );
}

export interface League {
  id: string;
  name: string;
  price: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  g?: {
    // GeoFirestore library is creating this g property automatically
    geohash: string;
    geopoint: {
      latitude: number;
      longitude: number;
    };
  };
}

export default App;
