import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import App from './app';

const TaskList = {
  execute: (props = {}) => {
    const [showDialog, setShowDialog] = useState(true);

    const onClosePlugin = () => {
      setShowDialog(false);
    };

    ReactDOM.render(
      <App showDialog={showDialog} onClosePlugin={onClosePlugin} {...props} />,
      document.querySelector('#plugin-wrapper')
    );
  },
};

export default TaskList;

window.app.registerPluginItemCallback('test', TaskList.execute);
