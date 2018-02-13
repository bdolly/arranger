import React from 'react';
import { storiesOf } from '@storybook/react';
import { injectGlobal } from 'emotion';

import Arranger, {
  GetProjects,
  Aggregations,
  CurrentSQON,
  Table,
} from '../src/Arranger';
import State from '../src/State';
import LiveAdvancedFacetView from '../src/AdvancedFacetView/LiveAdvancedFacetView';
import { StyleProvider, AVAILABLE_THEMES } from '../src/ThemeSwitcher';
import {
  PORTAL_NAME,
  ACTIVE_INDEX,
  ACTIVE_PROJECT,
  deleteValue,
  setValue,
  API,
  ES_HOST,
} from '../src/utils/config';

injectGlobal`
  html,
  body,
  #root {
    height: 100vh;
    margin: 0;
  }
`;

const DemoHeader = ({ update, onAllFiltersClick }) => {
  return (
    <div
      css={`
        z-index: 1;
        flex: none;
        display: flex;
        line-height: 40px;
        padding: 0 20px;
        font-size: 20px;
        font-weight: bold;
        box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
          0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
      `}
    >
      {process.env.STORYBOOK_PORTAL_NAME ||
        process.env.STORYBOOK_PORTAL_NAME ||
        'Data Portal'}{' '}
      Search Page
      <button style={{ marginLeft: 10 }} onClick={onAllFiltersClick}>
        All Filters
      </button>
      <div
        css={`
          margin-left: auto;
          cursor: pointer;
        `}
        onClick={() => {
          deleteValue('ACTIVE_PROJECT');
          deleteValue('ACTIVE_INDEX');
          update({ index: '', projectId: '' });
        }}
      >
        Logout
      </div>
    </div>
  );
};

const ChooseProject = ({ index, projectId, update, projects }) => {
  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        justify-content: center;
      `}
    >
      <h2
        css={`
          margin-top: 0;
        `}
      >
        {PORTAL_NAME}
      </h2>
      <select
        value={projectId}
        onChange={e => {
          setValue('ACTIVE_PROJECT', e.target.value);
          update({
            projectId: e.target.value,
          });
        }}
      >
        <option id="version">Select a version</option>
        {projects.map(x => (
          <option key={x.id} value={x.id}>
            {x.id}
          </option>
        ))}
      </select>
      <select
        value={index}
        onChange={e => {
          setValue('ACTIVE_INDEX', e.target.value);
          update({
            index: e.target.value,
          });
        }}
      >
        <option id="version">Select an index</option>
        {projects.find(x => x.id === projectId)?.types?.types?.map(x => (
          <option key={x.index} value={x.index}>
            {x.index}
          </option>
        ))}
      </select>
    </div>
  );
};

const Portal = ({ style, ...props }) => {
  return (
    <div style={{ display: 'flex', ...style }}>
      <Aggregations {...props} />
      <div
        css={`
          position: relative;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        `}
      >
        <CurrentSQON {...props} />
        <Table {...props} />
      </div>
    </div>
  );
};

const STYLE = {
  ADVANCED_FACET_OVERLAY: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  ADVANCED_FACET_CONTAINER: {
    width: 1000,
    height: 800,
    position: 'relative',
    background: 'white',
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'column',
  },
  ADVANCED_FACET_TITLE: {
    marginLeft: 20,
    marginTop: 20,
    borderBottom: 'solid 1px #d4d6dd',
    paddingBottom: 10,
    marginRight: 20,
  },
};

const AdvancedFacetViewModal = ({ update, showAdvancedFacets, sqon }) => (
  <div style={STYLE.ADVANCED_FACET_OVERLAY}>
    <div style={STYLE.ADVANCED_FACET_CONTAINER}>
      <div style={STYLE.ADVANCED_FACET_TITLE}>
        All filters
        <button
          style={{ marginLeft: 10 }}
          onClick={() => update({ showAdvancedFacets: false })}
        >
          Close
        </button>
      </div>
      <div style={{ position: 'relative', flex: 1 }}>
        <LiveAdvancedFacetView
          {...{
            PROJECT_ID: ACTIVE_PROJECT,
            ES_INDEX: ACTIVE_INDEX,
            API_HOST: API,
            ES_HOST: ES_HOST,
            sqon: sqon,
            onSqonChange: ({ sqon }) => console.log(sqon),
          }}
        />
      </div>
    </div>
  </div>
);

storiesOf('Portal', module).add('Portal', () => (
  <>
    <StyleProvider selected="beagle" availableThemes={AVAILABLE_THEMES} />
    <State
      initial={{
        index: ACTIVE_INDEX,
        projectId: ACTIVE_PROJECT,
        showAdvancedFacets: false,
      }}
      render={({ index, projectId, update, showAdvancedFacets }) => {
        return index && projectId ? (
          <>
            <Arranger
              index={index}
              projectId={projectId}
              render={props => {
                return (
                  <>
                    <DemoHeader
                      update={update}
                      onAllFiltersClick={() =>
                        update({ showAdvancedFacets: true })
                      }
                    />
                    <Portal {...props} />
                    {showAdvancedFacets && (
                      <AdvancedFacetViewModal
                        {...{ update, showAdvancedFacets, sqon: null }}
                      />
                    )}
                  </>
                );
              }}
            />
          </>
        ) : (
          <GetProjects
            render={props => (
              <ChooseProject
                {...props}
                index={index}
                projectId={projectId}
                update={update}
              />
            )}
          />
        );
      }}
    />
  </>
));
