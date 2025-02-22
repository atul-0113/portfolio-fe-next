// components/DataTable.tsx
"use client";
import React, { useState, useMemo } from 'react';

interface DataTableProps<T extends Record<string, any>> {
  headers: string[];
  data: T[];
  filterOptions?: { [key: string]: string[] }; // Optional filter options
}

const DataTable = <T extends Record<string, any>>({ headers, data, filterOptions }: DataTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredData = useMemo(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filterOptions) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          filtered = filtered.filter((item) => String(item[key]) === filters[key]);
        }
      });
    }

    return filtered;
  }, [data, searchTerm, filters]);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4 bg-white p-2">
        <form action="https://formbold.com/s/unique_form_id" method="POST">
            <div className="relative">
              <button className="absolute left-0 top-1/2 -translate-y-1/2">
                <svg
                  className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                    fill=""
                  />
                </svg>
              </button>

              <input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
              />
            </div>
          </form>
        {filterOptions && (
          <button onClick={toggleFilter} className="p-2 rounded-md">
            Filters
          </button>
        )}
      </div>

      {filterOptions && isFilterOpen && (
        <div className="mb-4 p-4 border rounded-md">
          {Object.keys(filterOptions).map((key) => (
            <div key={key} className="mb-2">
              <label className="block text-sm font-medium text-gray-700">{key}</label>
              <select
                value={filters[key] || ''}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className="mt-1 p-2 border rounded-md w-full"
              >
                <option value="">All</option>
                {filterOptions[key].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-boxdark ">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-bodydark1 ">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredData.map((item, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={header} className="px-6 py-4 whitespace-nowrap">
                  {String(item[header.toLowerCase().replace(/ /g, '_')])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;