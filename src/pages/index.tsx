import MapView from '../components/MapView'
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { apiKey } from "../configs/googlemap"


const render = (status: Status) => {
  return <h1>{status}</h1>;
};

function Main() {
  return <Wrapper
    apiKey={apiKey}
    render={render}
  >
    <MapView />
  </Wrapper>
  
}

export default Main
