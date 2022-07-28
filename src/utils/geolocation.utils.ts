import NodeGeocoder from 'node-geocoder'
import { Location } from '../types/location.types'

const GeoCoder = NodeGeocoder({
  provider: 'openstreetmap',
  language: 'en'
})

export async function getFormattedAddress(location: Location) {
  const geolocation = await GeoCoder.reverse({ lat: location.lat, lon: location.lon })

  return geolocation[0].formattedAddress
}
