import React from 'react';
import ThemeEditor from '../src/ThemeSwitcher/ThemeEditor.js';

export const AVAILABLE_THEMES = () => [
  {
    id: 'default',
    title: 'Default',
    stylePath: './themeStyles/default.css',
  },
  {
    id: 'beagle',
    title: 'Beagle',
    stylePath: './themeStyles/beagle.css.template',
    props: [
      {
        key: 'primaryColor',
        title: 'Primary Color',
        value: '#cacbcf',
        type: 'color',
      },
    ],
  },
];

const ThemeEditor = ({ themeData, onValueChange }) => (
  <div>
    <div>Theme: {themeData.title}</div>
    {themeData.props.map(themeProp => (
      <span>
        {themeProp.title}
        <input
          type={themeProp.type}
          onChange={() =>
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

const ThemeSelector = ({ availableTheme, selectedThemeId, onThemeChange }) => (
  <select value={selectedThemeId} onChange={e => onThemeChange(e.target.value)}>
    {availableTheme.map(theme => (
      <option value={theme.id}>{theme.title}</option>
    ))}
  </select>
);

class ThemeProvider extends React.Component {
  componentDidMount = () => (
    this.renderStyle(this.props.currentTheme)
  }
  componentWillReceiveProps = (nextProps) => {
    this.renderStyle(nextProps.currentTheme)
  }
  renderStyle = (currentTheme) => {
    const getConfiguredStyle = (themeTemplate) => (
      currentTheme.props.props.reduce((computedStyle, themeProp) => (
        computedStyle.split(`[_[${themeProp.key}]_]`).join(themeProp.value)
      ), themeTemplate)
    )
    async const themeResponse = await fetch(currentTheme.stylePath)
    async const themeTemplate = await themeResponse.text()
    setState({
      appliedStyle: getConfiguredStyle(themeTemplate)
    })
  }
  render() {
    return <style>{this.state.appliedStyle}</style>
  }
}
