import React from 'react';
import FacetViewNode from './FacetViewNode';
import $ from 'jquery';
import { debounce } from 'lodash';

const serializeToDomId = path => path.split('.').join('__');
const serializeDomIdToPath = path => path.split('.').join('__');

export default class FacetView extends React.Component {
  render() {
    const {
      aggregations,
      displayTreeData,
      onValueChange,
      sqon = {},
    } = this.props;
    return (
      <div className="facetView" ref={el => (this.root = el)}>
        {displayTreeData.map(node => {
          return (
            <FacetViewNode
              depth={0}
              sqon={sqon}
              key={node.path}
              aggregations={aggregations}
              onValueChange={({ value, path, esType, aggType }) =>
                onValueChange({ value, path, esType, aggType })
              }
              {...node}
            />
          );
        })}
      </div>
    );
  }
}