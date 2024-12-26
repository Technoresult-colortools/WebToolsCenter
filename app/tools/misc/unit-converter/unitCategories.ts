type UnitCategory = {
    name: string
    units: string[]
    convert: (value: number, from: string, to: string) => number
  }
  
  export const categories: UnitCategory[] = [
    {
      name: 'Length',
      units: ['Meters', 'Kilometers', 'Centimeters', 'Millimeters', 'Micrometers', 'Nanometers', 'Miles', 'Yards', 'Feet', 'Inches', 'Nautical Miles'],
      convert: (value, from, to) => {
        const meterValues: { [key: string]: number } = {
          Meters: 1,
          Kilometers: 1000,
          Centimeters: 0.01,
          Millimeters: 0.001,
          Micrometers: 1e-6,
          Nanometers: 1e-9,
          Miles: 1609.34,
          Yards: 0.9144,
          Feet: 0.3048,
          Inches: 0.0254,
          'Nautical Miles': 1852,
        }
        const meters = value * meterValues[from]
        return meters / meterValues[to]
      },
    },
    {
      name: 'Weight',
      units: ['Kilograms', 'Grams', 'Milligrams', 'Metric Tons', 'Pounds', 'Ounces', 'Stone', 'US Tons', 'Imperial Tons'],
      convert: (value, from, to) => {
        const gramValues: { [key: string]: number } = {
          Kilograms: 1000,
          Grams: 1,
          Milligrams: 0.001,
          'Metric Tons': 1e6,
          Pounds: 453.592,
          Ounces: 28.3495,
          Stone: 6350.29,
          'US Tons': 907185,
          'Imperial Tons': 1016000,
        }
        const grams = value * gramValues[from]
        return grams / gramValues[to]
      },
    },
    {
      name: 'Temperature',
      units: ['Celsius', 'Fahrenheit', 'Kelvin'],
      convert: (value, from, to) => {
        if (from === 'Celsius' && to === 'Fahrenheit') {
          return (value * 9) / 5 + 32
        } else if (from === 'Fahrenheit' && to === 'Celsius') {
          return ((value - 32) * 5) / 9
        } else if (from === 'Celsius' && to === 'Kelvin') {
          return value + 273.15
        } else if (from === 'Kelvin' && to === 'Celsius') {
          return value - 273.15
        } else if (from === 'Fahrenheit' && to === 'Kelvin') {
          return ((value - 32) * 5) / 9 + 273.15
        } else if (from === 'Kelvin' && to === 'Fahrenheit') {
          return ((value - 273.15) * 9) / 5 + 32
        }
        return value
      },
    },
    {
      name: 'Volume',
      units: ['Liters', 'Milliliters', 'Cubic Meters', 'Cubic Centimeters', 'Gallons (US)', 'Quarts (US)', 'Pints (US)', 'Cups', 'Fluid Ounces (US)', 'Tablespoons', 'Teaspoons', 'Cubic Inches', 'Cubic Feet'],
      convert: (value, from, to) => {
        const literValues: { [key: string]: number } = {
          Liters: 1,
          Milliliters: 0.001,
          'Cubic Meters': 1000,
          'Cubic Centimeters': 0.001,
          'Gallons (US)': 3.78541,
          'Quarts (US)': 0.946353,
          'Pints (US)': 0.473176,
          Cups: 0.236588,
          'Fluid Ounces (US)': 0.0295735,
          Tablespoons: 0.0147868,
          Teaspoons: 0.00492892,
          'Cubic Inches': 0.0163871,
          'Cubic Feet': 28.3168,
        }
        const liters = value * literValues[from]
        return liters / literValues[to]
      },
    },
    {
      name: 'Area',
      units: ['Square Meters', 'Square Kilometers', 'Square Feet', 'Square Yards', 'Square Miles', 'Acres', 'Hectares', 'Square Inches'],
      convert: (value, from, to) => {
        const squareMeterValues: { [key: string]: number } = {
          'Square Meters': 1,
          'Square Kilometers': 1e6,
          'Square Feet': 0.092903,
          'Square Yards': 0.836127,
          'Square Miles': 2.59e6,
          Acres: 4046.86,
          Hectares: 10000,
          'Square Inches': 0.00064516,
        }
        const squareMeters = value * squareMeterValues[from]
        return squareMeters / squareMeterValues[to]
      },
    },
    {
      name: 'Time',
      units: ['Seconds', 'Minutes', 'Hours', 'Days', 'Weeks', 'Months', 'Years', 'Decades', 'Centuries', 'Milliseconds', 'Microseconds', 'Nanoseconds'],
      convert: (value, from, to) => {
        const secondValues: { [key: string]: number } = {
          Seconds: 1,
          Minutes: 60,
          Hours: 3600,
          Days: 86400,
          Weeks: 604800,
          Months: 2629746,
          Years: 31556952,
          Decades: 315569520,
          Centuries: 3155695200,
          Milliseconds: 0.001,
          Microseconds: 1e-6,
          Nanoseconds: 1e-9,
        }
        const seconds = value * secondValues[from]
        return seconds / secondValues[to]
      },
    },
    {
      name: 'Speed',
      units: ['Meters per Second', 'Kilometers per Hour', 'Miles per Hour', 'Knots', 'Feet per Second', 'Mach'],
      convert: (value, from, to) => {
        const mpsValues: { [key: string]: number } = {
          'Meters per Second': 1,
          'Kilometers per Hour': 0.277778,
          'Miles per Hour': 0.44704,
          'Knots': 0.514444,
          'Feet per Second': 0.3048,
          'Mach': 340.3,
        }
        const mps = value * mpsValues[from]
        return mps / mpsValues[to]
      },
    },
    {
      name: 'Data',
      units: ['Bits', 'Bytes', 'Kilobits', 'Kilobytes', 'Megabits', 'Megabytes', 'Gigabits', 'Gigabytes', 'Terabits','Terabytes', 'Petabits', 'Petabytes'],
      convert: (value, from, to) => {
        const bitValues: { [key: string]: number } = {
          Bits: 1,
          Bytes: 8,
          Kilobits: 1e3,
          Kilobytes: 8e3,
          Megabits: 1e6,
          Megabytes: 8e6,
          Gigabits: 1e9,
          Gigabytes: 8e9,
          Terabits: 1e12,
          Terabytes: 8e12,
          Petabits: 1e15,
          Petabytes: 8e15,
        }
        const bits = value * bitValues[from]
        return bits / bitValues[to]
      },
    },
    {
      name: 'Energy',
      units: ['Joules', 'Kilojoules', 'Calories', 'Kilocalories', 'Watt-hours', 'Kilowatt-hours', 'Electron volts', 'British Thermal Units', 'US Therms', 'Foot-pounds'],
      convert: (value, from, to) => {
        const jouleValues: { [key: string]: number } = {
          Joules: 1,
          Kilojoules: 1e3,
          Calories: 4.184,
          Kilocalories: 4184,
          'Watt-hours': 3600,
          'Kilowatt-hours': 3.6e6,
          'Electron volts': 1.602176634e-19,
          'British Thermal Units': 1055.06,
          'US Therms': 1.05506e8,
          'Foot-pounds': 1.355818,
        }
        const joules = value * jouleValues[from]
        return joules / jouleValues[to]
      },
    },
    {
      name: 'Pressure',
      units: ['Pascal', 'Kilopascal', 'Megapascal', 'Bar', 'Atmosphere', 'Torr', 'Pound per Square Inch', 'Millimeter of Mercury'],
      convert: (value, from, to) => {
        const pascalValues: { [key: string]: number } = {
          Pascal: 1,
          Kilopascal: 1e3,
          Megapascal: 1e6,
          Bar: 1e5,
          Atmosphere: 101325,
          Torr: 133.322,
          'Pound per Square Inch': 6894.76,
          'Millimeter of Mercury': 133.322,
        }
        const pascals = value * pascalValues[from]
        return pascals / pascalValues[to]
      },
    },
  ]
  
  