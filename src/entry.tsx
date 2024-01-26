import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

const TaskList = {
  execute: () => {
    ReactDOM.render(<App showDialog={true} />, document.querySelector('#plugin-wrapper'));
  },
};

export default TaskList;

window.app.registerPluginItemCallback('plugin-template', TaskList.execute);
