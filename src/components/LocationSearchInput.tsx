import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';
import '@reach/combobox/styles.css';
import './combobox.css';

interface Props {
  onSearchLocationLatLngSelected: (
    selectedLocationName: string,
    locationCoordinatesLatLngString: string,
  ) => void;
  searchPlaceName: string;
  onSearchInputFieldChange: (event: React.FormEvent<HTMLInputElement>) => void;
}

export default function LocationSearchInput({
  onSearchLocationLatLngSelected,
  searchPlaceName,
  onSearchInputFieldChange,
}: Props) {
  const loadingSingleton: LocationSearchResult = {
    formatted: 'Searching...',
    geometry: {
      lat: 0,
      lng: 0,
    },
  };

  const [searchPlaceResults, setSearchPlaceResults] = useState<Array<LocationSearchResult>>([
    loadingSingleton,
  ]);

  useEffect(() => {
    if (!searchPlaceName) return;

    const { token, cancel } = axios.CancelToken.source();

    axios
      .get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURI(
          searchPlaceName,
        )}&key=dd0f38b3569a4c6fa0109793ac6ccb8d&language=en&pretty=1`,
        { cancelToken: token },
      )
      .then(({ data }) => {
        setSearchPlaceResults(
          data.results.map(({ formatted, geometry }) => {
            return {
              formatted,
              geometry,
            };
          }),
        );
      });

    return cancel;
  }, [searchPlaceName]);

  function onSearchOptionSelected(selectedLocationName: FormattedSearchResultString) {
    const selectedOption = searchPlaceResults.find(
      ({ formatted }) => formatted === selectedLocationName,
    );
    if (!selectedOption) return;

    const selectedLatLongString = [selectedOption.geometry.lat, selectedOption.geometry.lng].join(
      ',',
    );
    onSearchLocationLatLngSelected(selectedLocationName, selectedLatLongString);
  }

  return (
    <Combobox aria-label="locations" onSelect={onSearchOptionSelected}>
      <ComboboxInput
        className="w-full pr-12 form-input pl-7 sm:text-sm sm:leading-5"
        onChange={onSearchInputFieldChange}
        placeholder="Baltimore, Maryland"
        value={searchPlaceName}
      />
      {searchPlaceResults && (
        <ComboboxPopover className="pt-2 border border-white">
          {searchPlaceResults.length > 0 ? (
            <ComboboxList className="overflow-hidden bg-white border border-gray-400 rounded-md shadow-lg">
              {searchPlaceResults.map(({ formatted, geometry }) => (
                <ComboboxOption
                  className="px-4 py-4"
                  key={geometry.lat + geometry.lng}
                  value={formatted}
                />
              ))}
            </ComboboxList>
          ) : (
            <span style={{ display: 'block', margin: 8 }}>No results found</span>
          )}
        </ComboboxPopover>
      )}
    </Combobox>
  );
}

type FormattedSearchResultString = string;

interface LocationSearchResult {
  formatted: FormattedSearchResultString;
  geometry: {
    lat: number;
    lng: number;
  };
}
