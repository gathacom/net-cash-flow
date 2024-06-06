import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Home() {
  const [calculations, setCalculations] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get('/api/get-netflow');
      setCalculations(data);
    };
    fetchData();
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const calculateTotalNCF = (produksi) => {
    return produksi.reduce((total, prod) => total + prod.ncf, 0);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Perhitungan</h1>
      <Link className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mb-2' href="/create">New calculation</Link>
      <ul className="space-y-4 mt-2">
        {calculations.map((calc, index) => (
          <li key={calc.id} className="bg-white p-4 rounded-lg shadow">
            <button
              onClick={() => toggleExpand(index)}
              className="block w-full text-left"
            >
              Perhitungan {index + 1}
            </button>
            {expandedIndex === index && (
              <table className="w-full mt-4">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Tahun</th>
                    <th className="px-4 py-2">Produksi (Mbbl)</th>
                    <th className="px-4 py-2">Income ($M)</th>
                    <th className="px-4 py-2">Opex ($M)</th>
                    <th className="px-4 py-2">Di ($M)</th>
                    <th className="px-4 py-2">Taxable Income ($M)</th>
                    <th className="px-4 py-2">Tax ($M)</th>
                    <th className="px-4 py-2">NCF ($M)</th>
                  </tr>
                </thead>
                <tbody>
                  {calc.produksi.map((prod) => (
                    <tr key={prod.tahun} className="border-b border-gray-200">
                      <td className="px-4 py-2">{prod.tahun}</td>
                      <td className="px-4 py-2">{prod.produksi}</td>
                      <td className="px-4 py-2">{prod.income}</td>
                      <td className="px-4 py-2">{prod.opex}</td>
                      <td className="px-4 py-2">{prod.di}</td>
                      <td className="px-4 py-2">{prod.taxable_income}</td>
                      <td className="px-4 py-2">{prod.tax}</td>
                      <td className="px-4 py-2">{prod.ncf}</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td className="px-4 py-2" colSpan="7">Total NCF ($M)</td>
                    <td className="px-4 py-2">{calculateTotalNCF(calc.produksi)}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
