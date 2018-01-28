import React from 'react';
import { storiesOf } from '@storybook/react';
import uuid from 'uuid';
import { orderBy, get } from 'lodash';
import { Table } from '../src/DataTable';

const dummyData = Array(1000)
  .fill()
  .map(() => {
    const cases = Array(Math.floor(Math.random() * 10))
      .fill()
      .map(() => ({
        node: {
          primary_site: uuid(),
        },
      }));
    return {
      access: Math.random() > 0.5 ? 'controlled' : 'open',
      file_id: uuid(),
      file_name: uuid(),
      data_type: uuid(),
      file_size: Math.floor(Math.random() * 10000000),
      cases: {
        hits: {
          total: cases.length,
          edges: cases,
        },
      },
    };
  });

const dummyTableConfig = {
  timestamp: '2018-01-12T16:42:07.495Z',
  type: 'files',
  keyField: 'file_id',
  defaultSorted: [{ id: 'access', desc: false }],
  columns: [
    {
      show: true,
      Header: 'Access',
      type: 'string',
      sortable: true,
      canChangeShow: true,
      accessor: 'access',
    },
    {
      show: true,
      Header: 'File Id',
      type: 'string',
      sortable: true,
      canChangeShow: true,
      accessor: 'file_id',
    },
    {
      show: true,
      Header: 'File Name',
      type: 'string',
      sortable: true,
      canChangeShow: true,
      accessor: 'file_name',
    },
    {
      show: true,
      Header: 'Data Type',
      type: 'string',
      sortable: true,
      canChangeShow: true,
      accessor: 'data_type',
    },
    {
      show: true,
      Header: 'File Size',
      type: 'bits',
      sortable: true,
      canChangeShow: true,
      accessor: 'file_size',
    },
    {
      show: true,
      Header: 'Cases Primary Site',
      type: 'list',
      sortable: false,
      canChangeShow: false,
      query:
        'cases { hits(first: 5) { total, edges { node { primary_site } } } }',
      listAccessor: 'cases.hits.edges',
      totalAccessor: 'cases.hits.total',
      id: 'cases.primary_site',
    },
  ],
};

function fetchDummyData({ config, sort, offset, first }) {
  return Promise.resolve({
    total: dummyData.length,
    data: orderBy(
      dummyData,
      sort.map(s => s.field),
      sort.map(s => s.order),
    ).slice(offset, offset + first),
  });
}

export const AVAILABLE_THEMES = [
  {
    id: 'beagle',
    title: 'Beagle',
    stylePath: './themeStyles/beagle.css.template',
    props: [
      {
        key: 'primaryColor',
        title: 'Primary Color',
        value: '#404c9a',
        type: 'color',
      },
    ],
  },
  {
    id: 'default',
    title: 'Default',
    stylePath: './themeStyles/default.css',
    props: [],
  },
];

const ThemeEditor = ({ themeData, onValueChange }) => (
  <div>
    <div>Theme: {themeData.title}</div>
    {themeData.props.map(themeProp => (
      <span>
        {`${themeProp.title}: `}
        <input
          value={themeProp.value}
          type={themeProp.type}
          onChange={e =>
            onValueChange({
              key: themeProp.key,
              value: e.target.value,
            })
          }
        />
      </span>
    ))}
  </div>
);

const ThemeSelector = ({ availableThemes, selectedThemeId, onThemeChange }) => (
  <select value={selectedThemeId} onChange={e => onThemeChange(e.target.value)}>
    {availableThemes.map(theme => (
      <option value={theme.id}>{theme.title}</option>
    ))}
  </select>
);

class ThemeProvider extends React.Component {
  state = {
    appliedStyle: '',
  };
  componentDidMount = () => {
    this.renderStyle(this.props.currentTheme);
  };
  componentWillReceiveProps = nextProps => {
    this.renderStyle(nextProps.currentTheme);
  };
  renderStyle = async currentTheme => {
    const getConfiguredStyle = themeTemplate =>
      currentTheme.props.reduce(
        (computedStyle, themeProp) =>
          computedStyle.split(`[_[${themeProp.key}]_]`).join(themeProp.value),
        themeTemplate,
      );
    const themeResponse = await fetch(currentTheme.stylePath);
    const themeTemplate = await themeResponse.text();
    this.setState({
      appliedStyle: getConfiguredStyle(themeTemplate),
    });
  };
  render() {
    return <style>{this.state.appliedStyle}</style>;
  }
}

class ThemeState extends React.Component {
  state = {
    currentTheme: AVAILABLE_THEMES[0],
  };
  render() {
    return (
      <>
        <ThemeSelector
          availableThemes={AVAILABLE_THEMES}
          selectedThemeId={this.state.selectedThemeId}
          onThemeChange={themeId =>
            this.setState({
              currentTheme: AVAILABLE_THEMES.find(
                theme => theme.id === this.state.selectedThemeId,
              ),
            })
          }
        />
        <ThemeEditor
          themeData={this.state.currentTheme}
          onValueChange={({ key, value }) => {
            console.log(key, value);
            this.setState({
              currentTheme: {
                ...this.state.currentTheme,
                props: this.state.currentTheme.props.map(themeProp => ({
                  ...themeProp,
                  value: themeProp.key === key ? value : themeProp.value,
                })),
              },
            });
          }}
        />
        <ThemeProvider currentTheme={this.state.currentTheme} />
        <div
          style={{
            position: 'absolute',
            left: '200px',
            right: '0px',
            top: '0px',
            bottom: '0px',
          }}
        >
          <Table
            config={dummyTableConfig}
            fetchData={fetchDummyData}
            onSelectionChange={() => {}}
          />
        </div>
      </>
    );
  }
}

storiesOf('ThemeEditor', module).add('ThemeEditor', () => <ThemeState />);
