import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { SUBSCRIPTION_KEY } from './constants';
import './style.css';
declare var AhoyMapView: any;
function App() {
  // Create a reference to the HTML element we want to put the map on
  const mapRef = React.useRef(null);
  const [map, setMap] = useState(null);

  async function initMap() {
    // `mapRef.current` will be `undefined` when this hook first runs; edge case that
    if (!mapRef.current) return;
    const platform = await AhoyMapView.service().Platform(SUBSCRIPTION_KEY);
    const defaultLayers = platform.createDefaultLayers();
    const map = AhoyMapView.Map(
      mapRef.current,
      defaultLayers.vector.normal.map,
      {
        zoom: 4,
        center: {
          lat: 34,
          lng: 41,
        },
      }
    );
    const mapEvents = AhoyMapView.mapevents().MapEvents(map);
    const behavior = AhoyMapView.mapevents().Behavior(mapEvents);
    const ui = AhoyMapView.ui().UI.createDefault(map, defaultLayers);
    setMap(map);
  }

  useEffectOnce(() => {
    initMap();
    return () => {
      map.dispose();
    };
  });

  return (
    <div>
      <div className="map" ref={mapRef} style={{ height: '90vh' }}></div>
    </div>
  );
}

export default App;

export const useEffectOnce = (effect) => {
  const destroyFunc = useRef();
  const calledOnce = useRef(false);
  const renderAfterCalled = useRef(false);

  if (calledOnce.current) {
    renderAfterCalled.current = true;
  }

  useEffect(() => {
    if (calledOnce.current) {
      return;
    }

    calledOnce.current = true;
    destroyFunc.current = effect();

    return () => {
      if (!renderAfterCalled.current) {
        return;
      }

      if (destroyFunc.current) {
        destroyFunc.current();
      }
    };
  }, []);
};
