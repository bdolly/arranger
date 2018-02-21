import { omit } from 'lodash';
import React from 'react';
import { injectGlobal } from 'emotion';
import State from '../State';

injectGlobal`
  .inputWrapper {
    border: solid 2px lightgrey;
    padding: 5px;
  }

  .inputWrapper.focused {
    box-shadow: 0px 0px 10px skyblue;
  }

  .inputWrapper input:focus {
    outline: none;
  } 

  .inputWrapper .inputIcon {
    color: lightgrey;
  }
`;

export default props => (
  <State
    initial={{ isFocused: false }}
    render={({ update, isFocused }) => (
      <div
        style={{
          ...props.style,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
        className={`inputWrapper ${isFocused ? 'focused' : ''}`}
      >
        <span className="inputIcon">{props.icon}</span>
        <input
          onFocus={() => update({ isFocused: true })}
          onBlur={() => update({ isFocused: false })}
          style={{ border: 'none', flex: 1 }}
          {...omit(props, 'style')}
        />
      </div>
    )}
  />
);
