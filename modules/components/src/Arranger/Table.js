import React from 'react';

import DataTable, { ColumnsState } from '../DataTable';

const Table = ({
  projectId,
  graphqlField,
  fetchData,
  setSQON,
  sqon,
  fieldTypesForFilter = ['text', 'keyword'],
  api,
  tableDidMount = () => {},
  ...props
}) => {
  return (
    <ColumnsState
      projectId={projectId}
      graphqlField={graphqlField}
      api={api}
      render={columnState => {
        console.log('columnState');
        console.log(columnState);
        return (
          <DataTable
            {...{ ...props, api }}
            projectId={projectId}
            sqon={sqon}
            config={{
              ...columnState.state,
              type: graphqlField,
            }}
            didMount={props => {
              console.log('yeahhhhh???');
              console.log(props.config.defaultSorted);
            }}
            fetchData={fetchData(projectId)}
            onColumnsChange={columnState.toggle}
            onFilterChange={({ generateNextSQON }) => {
              setSQON(
                generateNextSQON({
                  sqon,
                  fields: columnState.state.columns
                    .filter(
                      x =>
                        fieldTypesForFilter.includes(x.extendedType) && x.show,
                    )
                    .map(x => x.field),
                }),
              );
            }}
          />
        );
      }}
    />
  );
};

export default Table;
