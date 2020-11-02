import React, { useState, useEffect, useMemo } from 'react';
import firebase from 'firebase/app';
import './App.css';
import { GeoFirestore } from './index';

interface League {
  id: string;
  name: string;
  price: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  g?: {
    geohash: string;
    geopoint: {
      latitude: number;
      longitude: number;
    };
  };
}

function Input({ value, onChange, label, className = '', ...rest }) {
  return (
    <div className={className}>
      <label htmlFor={label} className="block text-sm font-medium leading-5 text-gray-700">
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          {...rest}
          id={label}
          value={value}
          onChange={onChange}
          className="block w-full pr-12 form-input pl-7 sm:text-sm sm:leading-5"
        />
      </div>
    </div>
  );
}

function NewLeagueCreator({ refreshLeagueList }) {
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<number | null>(null);
  const [latLongInput, setLatLongInput] = useState<string>('');

  const validLatLongPair = useMemo(
    () =>
      latLongInput
        .split(',')
        .map(parseFloat)
        .every((coordinate) => coordinate <= 90 || coordinate <= -90),
    [latLongInput],
  );

  function submitCoordinates() {
    const [latitude, longitude] = latLongInput.split(',').map(parseFloat);
    GeoFirestore.collection('leagues')
      .add({
        name,
        price,
        coordinates: new firebase.firestore.GeoPoint(latitude, longitude),
      })
      .then(() => {
        setName('');
        setPrice(0);
        setLatLongInput('');

        refreshLeagueList();
      });
  }

  return (
    <div>
      <div className="p-6">
        <h2 className="pb-4 text-lg font-bold text-indigo-700">Add New League</h2>
        <div className="flex">
          <Input
            type="text"
            className="pr-4"
            value={name}
            onChange={(event) => setName(event.target.value)}
            label="Name"
          />
          <Input
            type="number"
            value={price || ''}
            onChange={(event) => setPrice(event.target.value)}
            label="Price"
            step="100"
          />
        </div>
        <Input
          type="text"
          value={latLongInput}
          onChange={(event) => setLatLongInput(event.target.value)}
          placeholder="latitude, longitude"
          label="Latitude, Longitude"
          className="pt-4"
        />
      </div>
      <div className="px-4 py-3 overflow-hidden text-right bg-indigo-100">
        <span className="inline-flex rounded-md shadow-sm">
          <button
            type="submit"
            onClick={submitCoordinates}
            className="px-4 py-2 text-sm font-medium leading-5 text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
            disabled={!name || !price || !validLatLongPair}
          >
            Add
          </button>
        </span>
      </div>
    </div>
  );
}

function SearchForLeagues({ setLeagueIdsInSearchRadius }) {
  const [price, setPrice] = useState<number | null>(null);
  const [latLongInput, setLatLongInput] = useState<string>('');
  const [searchRadius, setSearchRadius] = useState<number | null>(null);

  const validLatLongPair = useMemo(
    () =>
      latLongInput
        .split(',')
        .map(parseFloat)
        .every((coordinate) => coordinate <= 90 || coordinate <= -90),
    [latLongInput],
  );

  function parsedLatitudeLongitude() {
    return latLongInput.split(',').map(parseFloat);
  }

  function search() {
    if (!searchRadius || !latLongInput) return;
    const [latitude, longitude] = parsedLatitudeLongitude();

    const query = GeoFirestore.collection('leagues').near({
      center: new firebase.firestore.GeoPoint(latitude, longitude),
      radius: searchRadius,
    });

    query.get().then((value) => {
      setLeagueIdsInSearchRadius(value.docs.map(({ id }) => id));
    });
    setSearchRadius(null);
    setPrice(null);
  }

  return (
    <div>
      <div className="p-6">
        <h2 className="pb-4 text-lg font-bold text-indigo-700">Search for Leagues</h2>
        <div className="flex">
          <Input
            type="number"
            className="pr-4"
            value={searchRadius || ''}
            onChange={(event) => setSearchRadius(parseFloat(event.target.value))}
            label="Mile radius"
          />
          <Input
            type="number"
            value={price || ''}
            onChange={(event) => setPrice(parseFloat(event.target.value))}
            label="Max Price"
            step="100"
          />
        </div>
        <Input
          type="text"
          value={latLongInput}
          onChange={(event) => setLatLongInput(event.target.value)}
          placeholder="latitude, longitude"
          label="Latitude, Longitude"
          className="pt-4"
        />
      </div>
      <div className="px-4 py-3 overflow-hidden text-right bg-indigo-100">
        <span className="inline-flex rounded-md shadow-sm">
          <button
            type="submit"
            onClick={search}
            className="px-4 py-2 text-sm font-medium leading-5 text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
            disabled={!searchRadius || !price || !validLatLongPair}
          >
            Search
          </button>
        </span>
      </div>
    </div>
  );
}

function LeagueList({ leagues, title }: { leagues: Array<League>; title: string }) {
  if (leagues.length == 0) return <div></div>;

  return (
    <div>
      <h2 className="p-6 pb-4 text-lg font-bold text-indigo-700">{title}</h2>
      {leagues.map(({ id, name, price, coordinates: { latitude, longitude } }) => {
        return (
          <div className="px-6 py-3" key={id}>
            <div className="flex justify-between ">
              <div className="font-semibold text-gray-700 capitalize">{name}</div>
              <div className="text-sm text-gray-700">${Intl.NumberFormat().format(price)}</div>
            </div>
            <div className="text-xs text-gray-600">
              {latitude.toFixed(5)}, {longitude.toFixed(5)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function App() {
  const [refreshLeagueList, setRefreshLeagueList] = useState<boolean>(true);
  const [leagues, setLeagues] = useState<Array<League>>([]);
  const [leagueIdsInSearchRadius, setLeagueIdsInSearchRadius] = useState<Array<string>>([]);

  const [leaguesInPriceRange, totalCost]: [Array<League>, number] = useMemo(
    findLeaguesInPriceRange,
    [leagueIdsInSearchRadius],
  );

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
          setLeagues(fetchedLeagues);
          setRefreshLeagueList(false);
        });
    }
  }, [refreshLeagueList]);

  function findLeaguesInPriceRange(): [Array<League>, number] {
    if (leagues.length === 0) return [[], 0];

    const maxPrice = 4500;
    let moneySpent = 0;

    let leaguesInPriceRange: Array<League> = [];

    const sortedLeaguesInSearchRadius: Array<League> = leagues
      .filter((league) => leagueIdsInSearchRadius.includes(league.id))
      .sort((a, b) => a.price - b.price);

    for (const league of sortedLeaguesInSearchRadius) {
      if (moneySpent + league.price >= maxPrice) break;

      moneySpent += league.price;
      leaguesInPriceRange.push(league);
    }
    console.log(leaguesInPriceRange);
    return [leaguesInPriceRange, moneySpent];
  }

  return (
    <div className="App">
      <h1 className="px-8 py-4 text-3xl font-bold text-white bg-gray-800">League Manager</h1>
      <div className="max-w-6xl mx-auto">
        <div className="flex-wrap justify-center sm:flex">
          <div className="m-3 bg-white rounded-lg shadow-md">
            <NewLeagueCreator refreshLeagueList={() => setRefreshLeagueList(true)} />
            <LeagueList title="All Leagues" leagues={leagues} />
          </div>
          <div className="m-3 bg-white rounded-lg shadow-md">
            <SearchForLeagues setLeagueIdsInSearchRadius={setLeagueIdsInSearchRadius} />
            <LeagueList title="Search Results" leagues={leaguesInPriceRange} />
            {leaguesInPriceRange.length > 0 && (
              <div className="w-full underline p-6 bg-green-100 text-sm font-bold tracking-wide text-right text-indigo-600 uppercase">
                Total cost:
                <span className="text-lg font-bold text-green-600">
                  {' '}
                  ${Intl.NumberFormat().format(totalCost)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
