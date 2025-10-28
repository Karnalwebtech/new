
"use client";
import { useMemo, useState } from "react";
import {
  useGetAllCountoriesQuery,
  useGetCountorieByStatesQuery,
  useGetStateByCitiesQuery,
} from "@/state/counrtries-states-cities-api";
import { CSCCode } from "@/components/fields/select-field";

export type Mode = "C" | "CS" | "CSC";

// interface UseCSCDataProps {
//   mode?: Mode; // 'C', 'CS', or 'CSC'
//   countryCode?: string; // ISO2
//   stateCode?: string;   // short code
// }

export function useCSCData() {
  const [cscCode, setCscCode] = useState<CSCCode>({});

  // Countries
  const { data: countriesRes, isLoading: loadingCountries } = useGetAllCountoriesQuery(
    { rowsPerPage: 500, page: 1 },
    { refetchOnMountOrArgChange: false }
  );
  // States (enabled only for CS/CSC and when a country is selected)
  const { data: statesRes, isLoading: loadingStates } = useGetCountorieByStatesQuery(
    { rowsPerPage: 500, page: 1, countryCode: cscCode?.countryCode as string },
    { skip: !cscCode?.countryCode  }
  );

  // Cities (sample wiring, keep commented until API is ready)
  const { data: citiesRes, isLoading: loadingCities } = useGetStateByCitiesQuery(
    { rowsPerPage: 500, page: 1,  stateCode: cscCode?.stateCode as string },
    { skip: !cscCode?.stateCode }
  );

  const countries = useMemo(
    () =>
      countriesRes?.result?.map(({_id,name,isoCode}) => ({
        key: _id! as string,
        value: `${name!} (${isoCode!})`,
        isoCode: isoCode!,
      })) ?? [],
    [countriesRes?.result]
  );

  const states = useMemo(
    () =>
      statesRes?.result?.map(({_id,name,isoCode}) => ({
        key: _id!,
        value: `${name!} (${isoCode!})`,
        stateCode: isoCode!,
      })) ?? [],
    [statesRes?.result]
  );

  const cities= useMemo(
    () =>
      citiesRes?.result?.map(({_id,name}) => ({
        key: _id!,
        value: name!,
      })) ?? [],
    [citiesRes?.result]
  );

  return {
    countries,
    states,
    cities,
    cscCode,
    setCscCode,
    loading: {
      countries: loadingCountries,
      states: loadingStates,
      cities: loadingCities,
    },
  } as const;
}
