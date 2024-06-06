import React from "react";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
const index = () => {
  const [years, setYears] = useState([{ year: 1, opex: "", produksi: "" }]);
  const [capital, setCapital] = useState("");
  const [nonCapital, setNonCapital] = useState("");
  const [oilPrice, setOilPrice] = useState("");
  const [taxRate, setTaxRate] = useState("");

  const addYear = () => {
    setYears([...years, { year: years.length + 1, opex: "", produksi: "" }]);
  };

  const removeYear = (index) => {
    setYears(years.filter((_, i) => i !== index));
  };

  const handleYearChange = (index, field, value) => {
    const newYears = [...years];
    newYears[index][field] = value;
    setYears(newYears);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      capital,
      nonCapital,
      oilPrice,
      taxRate,
      years,
    };
    await axios.post("/api/netflow", data);
  };

  return (
    <div className="flex flex-col px-4 w-full p-4">
    <Link href="/" className="text-2xl font-bold">HomePage</Link>
      <h2 className="text-2xl font-bold p-4">Create New Calculation</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-28 py-10">
        <div className="flex flex-col gap-2">
          <label className="text-lg">Investasi Capital:</label>
          <input
            type="number"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            required
            className="border p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-lg">Investasi Non-Capital:</label>
          <input
            type="number"
            value={nonCapital}
            onChange={(e) => setNonCapital(e.target.value)}
            required
            className="border p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-lg">Harga Minyak per Barel:</label>
          <input
            type="number"
            value={oilPrice}
            onChange={(e) => setOilPrice(e.target.value)}
            required
            className="border p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-lg">Persentase Pajak:</label>
          <input
            type="number"
            step="0.01"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            required
            className="border p-2 rounded-md"
          />
        </div>
        {years.map((year, index) => (
          <div key={index} className="flex flex-col gap-2">
            <h3 className="text-lg">Tahun {year.year}</h3>
            <label className="text-lg">Opex:</label>
            <input
              type="number"
              value={year.opex}
              onChange={(e) => handleYearChange(index, "opex", e.target.value)}
              required
              className="border p-2 rounded-md"
            />
            <label className="text-lg">Produksi:</label>
            <input
              type="number"
              value={year.produksi}
              onChange={(e) =>
                handleYearChange(index, "produksi", e.target.value)
              }
              required
              className="border p-2 rounded-md"
            />
            <button
              type="button"
              onClick={() => removeYear(index)}
              className="bg-red-500 text-white px-4 py-2 rounded w-1/3"
            >
              Hapus Tahun
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addYear}
          className="bg-blue-500 text-white px-4 py-2 rounded w-1/3"
        >
          Tambah Tahun
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded mt-8"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default index;
