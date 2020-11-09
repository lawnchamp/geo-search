import React, { useState, useMemo, useEffect } from 'react';
import { GeoFirestore } from '../index';
import firebase from 'firebase/app';

import Input from '../atomic_ui/Input';
import Button from '../atomic_ui/Button';
import LocationSearchInput from './LocationSearchInput';

interface Props {
  refreshLeagueList: () => void;
}

export default function NewLeagueCreator({ refreshLeagueList }: Props) {
  const [leagueName, setLeagueName] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [latLongInput, setLatLongInput] = useState<string>('');
  const [searchPlaceName, setSearchPlaceName] = useState<string>('');

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
        name: leagueName,
        price,
        coordinates: new firebase.firestore.GeoPoint(latitude, longitude),
      })
      .then(() => {
        setLeagueName('');
        setPrice(0);
        setLatLongInput('');
        setSearchPlaceName('');
        refreshLeagueList();
      });
  }

  function onSearchLocationLatLngSelected(
    selectedLocationName: string,
    locationCoordinatesLatLngString: string,
  ) {
    setLatLongInput(locationCoordinatesLatLngString);
    setSearchPlaceName(selectedLocationName);
  }

  function onSearchInputFieldChange(event: React.FormEvent<HTMLInputElement>) {
    setSearchPlaceName(event.currentTarget.value);
  }

  return (
    <div>
      <div className="p-6">
        <h2 className="pb-4 text-lg font-bold text-indigo-700">Add New League</h2>
        <div className="flex">
          <Input
            type="text"
            className="w-full pr-4"
            value={leagueName}
            onChange={(event) => setLeagueName(event.target.value)}
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
            className="w-full"
          />
        </div>
        <div className="w-full pt-6 text-xs font-bold tracking-wide text-center text-indigo-600 uppercase">
          find location
        </div>
        <div className="flex flex-col items-center pt-4">
          <Input
            type="text"
            value={latLongInput}
            onChange={(event) => {
              setLatLongInput(event.target.value);
              setSearchPlaceName('');
            }}
            placeholder="39.15001, -77.18335"
            label="Latitude, Longitude"
            id="new-league-lat-long"
            className="w-full"
          />
          <div className="inline-block px-4 pt-6 text-xs font-bold tracking-wide text-indigo-600 uppercase">
            or
          </div>
          <div className="w-full">
            <div className="mb-1 text-xs font-bold tracking-wide text-gray-600 uppercase">
              Search by name
            </div>
            <LocationSearchInput
              searchPlaceName={searchPlaceName}
              onSearchInputFieldChange={onSearchInputFieldChange}
              onSearchLocationLatLngSelected={onSearchLocationLatLngSelected}
            />
          </div>
        </div>
      </div>
      <div className="px-6 pb-4 text-right border-b-2">
        <span className="inline-flex rounded-md shadow-sm">
          <Button
            type="submit"
            onClick={submitCoordinates}
            className="px-4 py-2 text-sm font-medium leading-5 text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
            disabled={!leagueName || !price || !validLatLongPair}
          >
            Add
          </Button>
        </span>
      </div>
    </div>
  );
}
