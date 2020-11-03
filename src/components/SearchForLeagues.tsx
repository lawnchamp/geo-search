import React, { useState } from 'react';
import firebase from 'firebase/app';
import { GeoFirestore } from '../index';

import Input from '../atomic_ui/Input';
import Button from '../atomic_ui/Button';

import { LeagueIdToDistanceMapping } from './LeagueFinder';

interface Props {
  maxPriceInput: number;
  setMaxPriceInput: (newPrice: number) => void;
  setLeagueIdToDistanceMapping: (mapping: LeagueIdToDistanceMapping) => void;
}

export default function SearchForLeagues({
  setLeagueIdToDistanceMapping,
  maxPriceInput,
  setMaxPriceInput,
}: Props) {
  const [searchCenterLatLong, setSearchCenterLatLong] = useState<string>('');
  const [searchRadius, setSearchRadius] = useState<number>(0);

  const validLatLongPair = searchCenterLatLong
    .split(',')
    .map(parseFloat)
    .every((coordinate) => coordinate <= 90 || coordinate <= -90);

  function parsedLatitudeLongitude() {
    return searchCenterLatLong.split(',').map(parseFloat);
  }

  function search() {
    if (!searchRadius || !searchCenterLatLong || !maxPriceInput) return;
    const [latitude, longitude] = parsedLatitudeLongitude();

    const query = GeoFirestore.collection('leagues').near({
      center: new firebase.firestore.GeoPoint(latitude, longitude),
      radius: searchRadius,
    });

    query.get().then((value) => {
      setLeagueIdToDistanceMapping(
        value.docs.reduce((idDistanceMapping, { id, distance }) => {
          idDistanceMapping[id] = distance;
          return idDistanceMapping;
        }, {}),
      );
    });
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
            onChange={(event) => setSearchRadius(Number(event.target.value))}
            label="Mile Radius"
            id="search-radius"
          />
          <Input
            type="number"
            value={maxPriceInput || ''}
            onChange={(event) => setMaxPriceInput(Number(event.target.value))}
            label="Max Price"
            step="100"
            id="search-max-price"
          />
        </div>
        <Input
          type="text"
          value={searchCenterLatLong}
          onChange={(event) => setSearchCenterLatLong(event.target.value)}
          placeholder="39.15001, -77.18335"
          label="Latitude, Longitude"
          id="search-lat-long"
          className="pt-4"
        />
      </div>
      <div className="px-4 pb-4 text-right border-b-2">
        <span className="inline-flex rounded-md shadow-sm">
          <Button
            type="submit"
            onClick={search}
            disabled={!searchRadius || !maxPriceInput || !validLatLongPair}
          >
            Search
          </Button>
        </span>
      </div>
    </div>
  );
}
