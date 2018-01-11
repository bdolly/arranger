import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

let API = 'http://localhost:5050';

class Aggs extends Component {
  state = { aggs: [], searchTerm: '' };
  async componentDidMount() {
    let { data } = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
        {
        	aggsState(indices:["${this.props.index}"]) {
            index
            states {
              timestamp
              state {
                field
                displayName
                active
                type
                allowedValues
                restricted
              }
            }
          }
        }

        `,
      }),
    }).then(r => r.json());

    this.setState({ aggs: data.aggsState[0].states[0].state });
  }
  render() {
    return (
      <Fragment>
        <div style={{ padding: 10 }}>
          <label>filter: </label>
          <input
            type="text"
            value={this.state.searchTerm}
            onChange={e => this.setState({ searchTerm: e.target.value })}
          />
        </div>
        {this.state.aggs
          .filter(x => x.field.includes(this.state.searchTerm))
          .map(x => (
            <div key={x.field} style={{ padding: 10 }}>
              <div>field: {x.field}</div>
              <div>
                displayName:
                <input
                  value={x.displayName}
                  onChange={e => this.setState({ test: e.target.value })}
                />
              </div>
              <div>
                active: <input type="checkbox" checked={x.active} />
              </div>
              <div>type: {x.type}</div>
              <div>allowedValues: {x.allowedValues}</div>
              <div>
                restricted: <input type="checkbox" checked={x.restricted} />
              </div>
            </div>
          ))}
      </Fragment>
    );
  }
}

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Fragment>
          <Route
            path="/admin/:index/:component"
            component={props => <Aggs index={props.match.params.index} />}
          />
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
