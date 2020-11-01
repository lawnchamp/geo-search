import React, { useState, useEffect, useMemo } from 'react';
import firebase from 'firebase/app';
import './App.css';
import { GeoFirestore, firestore } from './index';

// import computeDestinationPoint from 'geolib/es/computeDestinationPoint';

console.log('initializing app');

function milesToMeters(miles: number) {
  return miles * 1609.34;
}

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

function App() {
  const [leagues, setLeagues] = useState<Array<League>>([]);

  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<number | null>(null);
  const [latLongInput, setLatLongInput] = useState<string>('');

  const [searchLatLong, setSearchLatLong] = useState<string>('');
  const [searchRadius, setSearchRadius] = useState<number | null>(null);

  const geocollection = useMemo(() => GeoFirestore.collection('leagues'), []);
  console.log('Rendering app!');

  useEffect(() => {
    geocollection.get().then((querySnapshot) => {
      const fetchedLeagues: Array<League> = [];
      querySnapshot.forEach((doc) => {
        const { name, price, coordinates } = doc.data();
        fetchedLeagues.push({ id: doc.id, name, price, coordinates });
      });
      setLeagues(fetchedLeagues);
    });
  }, []);

  function submitCoordinates() {
    const [latitude, longitude] = latLongInput.split(',').map(parseFloat);
    geocollection.add({
      name,
      price,
      coordinates: new firebase.firestore.GeoPoint(latitude, longitude),
    });

    setName('');
    setPrice(null);
    setLatLongInput('');
  }

  function search() {
    if (!searchRadius || !searchLatLong) return;
    const [latitude, longitude] = searchLatLong.split(',').map(parseFloat);

    const query = geocollection.near({
      center: new firebase.firestore.GeoPoint(latitude, longitude),
      radius: searchRadius,
    });

    query.get().then((value) => {
      console.log(value.docs);
    });
    setSearchRadius(null);
  }

  return (
    <div className="p-6 bg-gray-100 App">
      <h1 className="pb-6 text-2xl font-bold text-indigo-500">League Manager</h1>
      <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />

      <div className="flex">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold pb-4">New league</h2>
          <div className="flex">
            <div className="pr-4">
              <label htmlFor="price" className="block text-sm font-medium leading-5 text-gray-700">
                Price
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  id="price"
                  className="block w-full pr-12 form-input pl-7 sm:text-sm sm:leading-5"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-5 text-gray-700">
                Name
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  id="name"
                  className="block w-full pr-12 form-input pl-7 sm:text-sm sm:leading-5"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            type="number"
            placeholder="price"
            value={price || ''}
            onChange={(event) => setPrice(parseFloat(event.target.value))}
          />
          <input
            type="text"
            placeholder="latitude,longitude"
            value={latLongInput}
            onChange={(event) => setLatLongInput(event.target.value)}
          />
          <button onClick={submitCoordinates}>submit</button>
        </div>
        <div>
          <h2>Search for leagues</h2>
          <input
            type="text"
            placeholder="latitude,longitude"
            value={searchLatLong}
            onChange={(event) => setSearchLatLong(event.target.value)}
          />
          <input
            type="number"
            placeholder="Search radius in miles"
            value={searchRadius || ''}
            onChange={(event) => setSearchRadius(parseFloat(event.target.value))}
          />
          <button onClick={search}>search</button>
        </div>
        {/* <pre style={{ textAlign: 'left' }}>{JSON.stringify(leagues, null, 2)}</pre> */}
      </div>
    </div>
  );
}

export default App;
