import React, { useState, useMemo } from 'react';
import { GeoFirestore } from '../index';
import firebase from 'firebase/app';

import Input from '../atomic_ui/Input';
import Button from '../atomic_ui/Button';

export default function NewLeagueCreator({ refreshLeagueList }) {
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
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
            id="new-league-name"
          />
          <Input
            type="number"
            value={price || ''}
            onChange={(event) => setPrice(Number(event.target.value))}
            label="Price"
            step="100"
            id="new-league-price"
          />
        </div>
        <Input
          type="text"
          value={latLongInput}
          onChange={(event) => setLatLongInput(event.target.value)}
          placeholder="39.15001, -77.18335"
          label="Latitude, Longitude"
          id="new-league-lat-long"
          className="pt-4"
        />
      </div>
      <div className="px-4 pb-4 text-right border-b-2">
        <span className="inline-flex rounded-md shadow-sm">
          <Button
            type="submit"
            onClick={submitCoordinates}
            className="px-4 py-2 text-sm font-medium leading-5 text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
            disabled={!name || !price || !validLatLongPair}
          >
            Add
          </Button>
        </span>
      </div>
    </div>
  );
}
