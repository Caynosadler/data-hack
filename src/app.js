import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL, {Source, Layer} from 'react-map-gl';

import ControlPanel from './control-panel';
import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from './layers';
import Geocoder from 'react-map-gl-geocoder'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2F5bm9zYWRsZXIiLCJhIjoiY2ltNHF0ZWh3MDAxZHhta21zMHJnNzFnMiJ9.ARv_FkVLJGMnYHoLuY6Gjg';

export default class App extends Component {
  state = {
    viewport: {
      latitude: 6.625,
      longitude: 3.3198,
      zoom: 5,
      bearing: 0,
      pitch: 0
    }
  };

  mapRef = React.createRef()

  handleViewportChange = (viewport) => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    })
  }

  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  handleGeocoderViewportChange = (viewport) => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 }

    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    })
  }

  _sourceRef = React.createRef();

  _onViewportChange = viewport => this.setState({viewport});

  _onClick = event => {
    const feature = event.features[0];
    const clusterId = feature.properties.cluster_id;

    const mapboxSource = this._sourceRef.current.getSource();

    mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) {
        return;
      }

      this._onViewportChange({
        ...this.state.viewport,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        zoom,
        transitionDuration: 500
      });
    });
  };

  render() {
    const {viewport} = this.state;

    return (
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={this._onViewportChange}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={[clusterLayer.id]}
        onClick={this._onClick}
      >
        <Source
          type="geojson"
          data="./final.json"
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
          ref={this._sourceRef}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
        <ControlPanel containerComponent={this.props.containerComponent} />
      </MapGL>
    );
  }
}

export function renderToDom(container) {
  render(<App />, container);
}