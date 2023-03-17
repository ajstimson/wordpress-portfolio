import React from "react";
import { useState } from "react";
import { FormInputProps } from "../types";
import { FormInputSelect } from "./form-input-select";
import { getDaysInMonth } from "date-fns";
import { useEffect } from "react";
import { useRef } from "react";
import { FormFieldDate } from "../../../types/form.types";

const getYearOptions = (minYear: number, maxYear: number) => {
  return [...Array(Math.abs(minYear - maxYear) + 1)]
    .map((_, index) => minYear + index)
    .map((value) => ({
      checked: false,
      value: value.toString(),
      label: value.toString(),
    }))
    .reverse();
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getMonthOptions = () => {
  return MONTHS.map((value) => ({
    checked: false,
    value,
    label: value,
  }));
};

const getDayOptions = (year: number, month: number) => {
  const days = getDaysInMonth(new Date(year, month));
  return [...Array(days)].map((_, index) => {
    const day = (index + 1).toString();
    return {
      label: day,
      value: day,
      checked: false,
    };
  });
};

export const FormInputDate: React.FC<FormInputProps<FormFieldDate>> = ({
  field,
  register,
}) => {
  // useRef to only perform these operations once
  // and not on every re-render
  const { current: yearOptions } = useRef(
    getYearOptions(field.minYear, field.maxYear)
  );

  const { current: monthOptions } = useRef(getMonthOptions());

  const [year, setYear] = useState(Number(yearOptions[0].value));
  const [month, setMonth] = useState(0);

  const [dayOptions, setDayOptions] = useState(getDayOptions(year, month));

  // selection - default to current day
  const [day, setDay] = useState(1);

  const recalculateMonthsAndYears = () => {
    const newDayOptions = getDayOptions(year, month);
    const values = newDayOptions.map((x) => x.value);

    if (!values.includes(day.toString())) {
      setDay(1);
    }

    setDayOptions(newDayOptions);
  };

  useEffect(() => {
    recalculateMonthsAndYears();
  }, [month, year]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "15px",
      }}
    >
      <input
        name={field.name}
        type="hidden"
        {...register(field.name)}
        value={`${month + 1}/${day}/${year}`}
        required
      />
      <FormInputSelect
        field={field.month}
        options={monthOptions}
        value={MONTHS[month]}
        onChange={(value) => setMonth(MONTHS.findIndex((x) => x === value))}
      />
      <FormInputSelect
        field={field.day}
        options={dayOptions}
        value={day.toString()}
        onChange={(value) => setDay(Number(value))}
      />
      <FormInputSelect
        field={field.year}
        options={yearOptions}
        value={year.toString()}
        onChange={(value) => setYear(Number(value))}
      />
    </div>
  );
};
