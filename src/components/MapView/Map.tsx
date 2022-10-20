import {
  useRef, useState, useEffect, forwardRef, useImperativeHandle
} from 'react'
import { LatLng } from '../../interfaces/Map'
import styles from './styles.module.css'

interface Marker extends LatLng {
  note: string
}

interface MainProps {
  triggerEdit: (key:string) => void
  markers:  Marker[]
}

const getLatLngKey = (latlng:LatLng) => latlng.lat.toString() + latlng.lng.toString()

const MainMap = forwardRef(
  ({triggerEdit, markers}: MainProps, ref) => {
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);
    const [listMarkers, setListMarkers] = useState([]);
    const [map, setMap] = useState<google.maps.Map>(null);

    useImperativeHandle(ref, () => {
      return {
        map: map,
        mapContainer: mapContainerRef.current
      }
    }, [map, mapRef])

    useEffect(() => {
      if(mapRef.current && !map) {
        const currMap = new window.google.maps.Map(mapRef.current, {
          center: { lat: -1, lng: 151 },
          zoom: 5,
          minZoom: 3,
          disableDefaultUI: true,
        })
        setMap(currMap)
      }
    }, [])

    useEffect(() => {
      let existingMarkers = {}
      if(listMarkers.length) {
        listMarkers.forEach(m => {
          existingMarkers[m.key] = m
        })
      }
      if(map && markers.length) {
        setListMarkers(
          markers.map((m) => {
            const key = getLatLngKey(m)
            let marker:google.maps.Marker;
            let infowindow:google.maps.InfoWindow;
            if(existingMarkers[key]) {
              marker = existingMarkers[key].marker
              infowindow = existingMarkers[key].infowindow
              infowindow.setContent(m.note ? `<p class="${styles.textNote}">${m.note} <a style="color: #1a73e8; text-decoration: underline;" id="${getLatLngKey(m)}edit"class="link-edit">edit</a></p>` : `<p class="${styles.textNote}"><a style="color: #1a73e8; text-decoration: underline;" id="${getLatLngKey(m)}edit"class="link-edit">add</a></p>`)
            } else {
              marker = new google.maps.Marker({
                position: m,
                map
              })
              infowindow = new google.maps.InfoWindow({
                content: m.note ? `<p class="${styles.textNote}">${m.note} <a style="color: #1a73e8; text-decoration: underline;" id="${getLatLngKey(m)}edit"class="link-edit">edit</a></p>` : `<p class="${styles.textNote}"><a style="color: #1a73e8; text-decoration: underline;" id="${getLatLngKey(m)}edit"class="link-edit">add</a></p>`,
              });
              marker.addListener("click", () => {
                infowindow.open({
                  anchor: marker,
                  map,
                  shouldFocus: false,
                });
              });
              google.maps.event.addListener(infowindow, 'domready', function() {
                document.getElementById(`${getLatLngKey(m)}edit`).addEventListener(
                  'click',
                  (e:MouseEvent) => {
                    e.preventDefault()
                    triggerEdit(getLatLngKey(m))
                  }
                );
              });
            }
            return {
              marker,
              infowindow,
              key
            }
          })
        )
      }
    }, [markers])

    return <div className={styles.MapWrap} ref={mapContainerRef}>
      <div className={styles.ItemMap} ref={mapRef}></div>
    </div>
  }
)

export default MainMap
