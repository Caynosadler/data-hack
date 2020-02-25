import React, {PureComponent} from 'react';

export default class ControlPanel extends PureComponent {
  render() {
    return (
      <div className="control-panel">
        <h1>Health issues in nigeria</h1>
        <p>Functionalities of nigeria's healthcare facilities</p>
        <div className="source-link">
          <a
            href="https://github.com/uber/react-map-gl/tree/5.2-release/examples/clusters"
            target="_new"
          >
            View Code ↗
          </a>
        </div>
      </div>
    );
  }
}