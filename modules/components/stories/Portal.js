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
import { Bubble } from '../src/SQONView';

injectGlobal`
  html,
  body,
  #root {
    height: 100vh;
    margin: 0;
  }
`;

const DemoHeader = ({ update }) => {
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
    <State
      initial={{ advancedFacetShown: true }}
      render={({ update, advancedFacetShown }) => (
        <div
          className="portal"
          style={{ position: 'relative', display: 'flex', ...style }}
        >
          <div className="leftPanel">
            <div className="titleWrapper">
              Filters
              <button onClick={() => update({ advancedFacetShown: true })}>
                ALL FILTERS
              </button>
            </div>
            <Aggregations {...props} />
          </div>
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
          {advancedFacetShown && (
            <AdvancedFacetViewModal
              {...{
                sqon: props.sqon,
                closeModal: () => update({ advancedFacetShown: false }),
                onSqonSubmit: sqon => props.setSQON(sqon),
                // onSqonChange: sqon => props.setSQON(sqon),
              }}
            />
          )}
        </div>
      )}
    />
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
    height: 720,
    position: 'relative',
    background: 'white',
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  ADVANCED_FACET_WRAPPER: {
    padding: 20,
    paddingBottom: 0,
  },
  ADVANCED_FACET_TITLE: {
    marginLeft: 20,
    marginTop: 20,
    borderBottom: 'solid 1px #d4d6dd',
    paddingBottom: 10,
    marginRight: 20,
    fontFamily: 'Montserrat',
    textAlign: 'left',
    color: '#2b388f',
  },
  ADVANCED_FACET_FOOTER: {
    height: 67,
    backgroundColor: '#edeef1',
    boxShadow: '0 0 2.9px 0.1px #a0a0a3',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
    padding: 20,
  },
};

const AdvancedFacetViewModal = ({
  closeModal,
  showAdvancedFacets,
  sqon,
  onSqonSubmit = () => {},
  onSqonChange = () => {},
}) => (
  <State
    initial={{ localSqon: sqon }}
    render={({ update, localSqon }) => (
      <div style={STYLE.ADVANCED_FACET_OVERLAY} onClick={() => closeModal()}>
        <div
          style={STYLE.ADVANCED_FACET_CONTAINER}
          onClick={e => e.stopPropagation()}
        >
          <div style={STYLE.ADVANCED_FACET_TITLE}>All filters</div>
          <div
            style={{
              ...STYLE.ADVANCED_FACET_WRAPPER,
              flex: 1,
              display: 'flex',
            }}
          >
            <div style={{ position: 'relative', flex: 1 }}>
              <LiveAdvancedFacetView
                {...{
                  PROJECT_ID: ACTIVE_PROJECT,
                  ES_INDEX: ACTIVE_INDEX,
                  API_HOST: API,
                  ES_HOST: ES_HOST,
                  sqon: localSqon,
                  onSqonChange: ({ sqon }) => {
                    update({ localSqon: sqon });
                    onSqonChange(sqon);
                  },
                }}
              />
            </div>
          </div>
          <div style={STYLE.ADVANCED_FACET_FOOTER}>
            <div className="cancel" onClick={e => closeModal()}>
              Cancel
            </div>
            {/* <div>Fancy Stats</div> */}
            <div>
              <div
                onClick={e => {
                  onSqonSubmit(localSqon);
                  closeModal();
                }}
                className="submitButton"
              >
                View Results
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  />
);

storiesOf('Portal', module).add('Portal', () => (
  <>
    <StyleProvider selected="beagle" availableThemes={AVAILABLE_THEMES} />
    <State
      initial={{
        index: ACTIVE_INDEX,
        projectId: ACTIVE_PROJECT,
      }}
      render={({ index, projectId, update }) => {
        return index && projectId ? (
          <>
            <Arranger
              index={index}
              projectId={projectId}
              render={props => {
                return (
                  <>
                    <DemoHeader update={update} />
                    <Portal {...props} />
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
