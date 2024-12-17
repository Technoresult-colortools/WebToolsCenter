import React from 'react'
import { Check, X } from 'lucide-react'

interface CountryListProps {
  availability: {
    [key: string]: {
      available: boolean;
      lastChecked: string;
    }
  }
  countries: {
    code: string;
    name: string;
    flag: string;
  }[]
}

const CountryList: React.FC<CountryListProps> = ({ availability, countries }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {countries.map((country) => (
        <div key={country.code} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 text-black dark:bg-gray-800">
          <span>{country.flag}</span>
          {availability[country.code]?.available ? (
            <Check className="text-green-500" size={20} />
          ) : (
            <X className="text-red-500" size={20} />
          )}
          <span>{country.name}</span>
        </div>
      ))}
    </div>
  )
}

export default CountryList
