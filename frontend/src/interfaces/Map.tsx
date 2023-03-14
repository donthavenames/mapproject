interface LatLng {
  lat: number,
  lng: number
}

interface MapMouseEvent {
  latLng: {
    lat: () => number,
    lng: () => number
  }
}

export type {
  LatLng,
  MapMouseEvent
}
