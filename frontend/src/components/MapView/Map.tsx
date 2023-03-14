import {
  useRef, useState, useEffect, forwardRef, useImperativeHandle
} from 'react'
import { LatLng } from '../../interfaces/Map'
import styles from './styles.module.css'

//interface describes something and the things inside are basically descriptors
interface Marker extends LatLng {
  note: string
}

//interface but with an interface of marker (the thing above this)
interface MainProps {
  triggerEdit: (key:string) => void
  markers:  Marker[]
}

//creates a field that is a function that takes in lat and lng values and returns the latitude plus the longitude
const getLatLngKey = (latlng:LatLng) => latlng.lat.toString() + latlng.lng.toString()

//forwarding ref from somewhere else. triggerEdit and markers are both types of MainProps.
//For useState, <google.maps.Map> is describing the type of state being saved
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
    //this bottom bit is basically specifying when you want this to render. In this case, it is saying that you want to rerender everytime map or mapRef changes

    //useEffect runs a function every time the state changes/on every render
    //remember that changing state also rerenders the component
    //remember that when you are accessing object properties, you need to specify which property you are accessing. For example, fortnite.current.
    //useRef/Ref is basically state except it does not cause the function/component to rerender. You can either apply this to just something that you don't want to rerender until a specific case
    //or you can also use refs when you are dealing with html elements. there is a ref attribute specified in html code that you can modify by specifying a ref & then altering that ref.
    //overall, refs are good for being able to persist values through renders (ref value stays the same through renders)
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
      //google.maps.Marker & google.maps.InfoWindow are both part of the javascript google maps API. Marker basically just places a marker and infowindow spawns a infowindow
      if(map && markers.length) {
        setListMarkers(
          markers.map((m) => {
            const key = getLatLngKey(m)
            let marker:google.maps.Marker;
            let infowindow:google.maps.InfoWindow;
            //this is basically saying that if there is an existing marker, display an info window
            if(existingMarkers[key]) {
              marker = existingMarkers[key].marker
              infowindow = existingMarkers[key].infowindow
              infowindow.setContent(m.note ? `<p class="${styles.textNote}">${m.note} <a style="color: #1a73e8; text-decoration: underline;" id="${getLatLngKey(m)}edit"class="link-edit">edit</a></p>` : `<p class="${styles.textNote}"><a style="color: #1a73e8; text-decoration: underline;" id="${getLatLngKey(m)}edit"class="link-edit">add</a></p>`)
            } 
            //otherwise, make a new marker
            else {
              marker = new google.maps.Marker({
                position: m,
                map
              })
              infowindow = new google.maps.InfoWindow({
                content: m.note ? `<p class="${styles.textNote}">${m.note} <a style="color: #1a73e8; text-decoration: underline;" id="${getLatLngKey(m)}edit"class="link-edit">edit</a></p>` : `<p class="${styles.textNote}"><a style="color: #1a73e8; text-decoration: underline;" id="${getLatLngKey(m)}edit"class="link-edit">add</a></p>`,
              });
              //addListener literally just adds something that can listen for inputs (i.e clicks)
              //in this case, it adds an infoWindow
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
