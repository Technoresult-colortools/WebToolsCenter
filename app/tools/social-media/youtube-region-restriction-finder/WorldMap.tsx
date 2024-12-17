import React from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

interface WorldMapProps {
  availability: {
    [key: string]: {
      available: boolean;
      lastChecked: string;
    }
  }
}

const WorldMap: React.FC<WorldMapProps> = ({ availability }) => {
  return (
    <ComposableMap width={800} height={400} projectionConfig={{ scale: 147 }}>
      <Geographies geography="https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json">
        {({ geographies }) =>
          geographies.map((geo) => {
            const isAvailable = availability[geo.properties.ISO_A2]?.available
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={isAvailable ? "#34D399" : "#EF4444"}
                stroke="#FFFFFF"
                strokeWidth={0.5}
              />
            )
          })
        }
      </Geographies>
    </ComposableMap>
  )
}

export default WorldMap

