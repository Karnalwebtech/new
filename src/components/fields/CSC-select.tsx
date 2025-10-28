"use client";
import {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  useController,
  useWatch,
} from "react-hook-form";
import { useEffect, useMemo } from "react";
import SelectFields from "./select-field"; // Assumes it can take options as {value, label, key}
import {
  useGetAllCountoriesQuery,
  useGetCountorieByStatesQuery,
  // 👇 ensure you have a city hook; rename to your real one
  //   useGetCitiesByStateQuery,
} from "@/state/counrtries-states-cities-api";

type Mode = "C" | "CS" | "CSC";

interface CSCProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  /** Field names inside your form */
  countryName: Path<T>;
  stateName?: Path<T>;
  cityName?: Path<T>;
  /** C = Country only, CS = Country+State, CSC = Country+State+City */
  mode?: Mode;
  /** UI text */
  countryPlaceholder?: string;
  statePlaceholder?: string;
  cityPlaceholder?: string;
  /** Disable all */
  disabled?: boolean;
  /** Optional className passthrough */
  className?: string;
}

/** Small helper for safe RHF field reset */
function useResetOnParentChange<T extends FieldValues>(
  control: Control<T>,
  child?: Path<T>,
  parentValue?: string | null | undefined
) {
  useEffect(() => {
    if (!child) return;
    // when parent changes, clear child field
    control.unregister(child);
    // alternatively, you can setValue(child, undefined)
  }, [parentValue, child, control]);
}

const CSCSelect = <T extends FieldValues>({
  control,
  errors,
  countryName,
  stateName,
  cityName,
  mode = "C",
  disabled = false,
  className,
  countryPlaceholder = "Select country",
  statePlaceholder = "Select state",
  cityPlaceholder = "Select city",
}: CSCProps<T>) => {
  // watch the current selection to drive dependent queries
  const countryCode = useWatch({
    control,
    name: countryName,
  }) as string | undefined;

  // Always call useWatch — if stateName is undefined, pass an empty string
  const stateCode = useWatch({
    control,
    name: stateName || ("" as Path<T>), // dummy name just to keep call order stable
  }) as string | undefined;

  // fetch countries
  const { data: countriesRes, isLoading: loadingCountries } =
    useGetAllCountoriesQuery({
      rowsPerPage: 500,
      page: 1,
    });

  // fetch states (skip until country selected)
  const { data: statesRes, isLoading: loadingStates } =
    useGetCountorieByStatesQuery(
      { rowsPerPage: 500, page: 1, countryCode: countryCode as string },
      { skip: !countryCode || mode === "C" }
    );

  //   // fetch cities (skip until state selected & only on CSC)
  //   const { data: citiesRes, isLoading: loadingCities } = useGetCitiesByStateQuery(
  //     {
  //       rowsPerPage: 500,
  //       page: 1,
  //       countryCode: countryCode as string,
  //       stateCode: stateCode as string,
  //     },
  //     { skip: !(mode === "CSC") || !countryCode || !stateCode }
  //   );

  // reset child fields when parent changes
  useResetOnParentChange(control, stateName, countryCode); // change country → reset state
  useResetOnParentChange(control, cityName, stateCode); // change state → reset city

  // map API → options
  const countryOptions = useMemo(
    () =>
      countriesRes?.result?.map(({ _id, isoCode }) => ({
        key: _id!,
        value: isoCode!, // store isoCode in the form
        //   label: `${c.name} (${c.isoCode})`, // show nice label
      })) ?? [],
    [countriesRes?.result]
  );
  console.log(countryOptions);

  const stateOptions = useMemo(
    () =>
      statesRes?.result?.map(({_id,isoCode}) => ({
        key: _id!,
        value:isoCode!, // store stateCode
        // label: `${s.name} (${s.isoCode})`,
      })) ?? [],
    [statesRes?.result]
  );

  //   const cityOptions =
  //     useMemo(
  //       () =>
  //         citiesRes?.result?.map((ct: any) => ({
  //           key: ct._id ?? `${ct.name}-${ct.latitude ?? ""}`,
  //           value: ct.name,            // usually cities are looked up by name
  //           label: ct.name,
  //         })) ?? [],
  //       [citiesRes?.result]
  //     );

  // Controllers for validation messages (optional)
  const { field: countryField } = useController({ control, name: countryName });
  //   const stateField = stateName ? useController({ control, name: stateName }).field : undefined;
  //   const cityField = cityName ? useController({ control, name: cityName }).field : undefined;

  return (
    <div className={className ?? "grid gap-3"}>
      {/* Country */}
      <SelectFields
        name={countryName as Path<T>}
        control={control}
        errors={errors}
        is_loading={loadingCountries}
        is_disabled={disabled || loadingCountries}
        placeholder={countryPlaceholder}
        drop_down_selector={countryOptions} // expects [{key, value, label}]
        // If your SelectFields doesn't support `label`, add a prop like `labelKey="label" valueKey="value"`
        // labelKey="label"
        // valueKey="value"
      />

      {/* State (CS or CSC) */}
      {(mode === "CS" || mode === "CSC") && stateName && (
        <SelectFields
          name={stateName as Path<T>}
          control={control}
          errors={errors}
          is_loading={loadingStates}
          is_disabled={disabled || !countryCode || loadingStates}
          placeholder={statePlaceholder}
          drop_down_selector={stateOptions}
        />
      )}

      {/* City (CSC) */}
      {/* {mode === "CSC" && cityName && (
        <SelectFields
          name={cityName as Path<T>}
          control={control}
          errors={errors}
          is_loading={loadingCities}
          is_disabled={disabled || !countryCode || !stateCode || loadingCities}
          placeholder={cityPlaceholder}
          drop_down_selector={cityOptions}
        />
      )} */}
    </div>
  );
};

export default CSCSelect;
