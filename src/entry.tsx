import ReactDOM from 'react-dom';
import App from './app';
import info from './plugin-config/info.json';

const TaskList = {
  execute: () => {
    ReactDOM.render(<App showDialog={true} />, document.querySelector('#plugin-wrapper'));
  },
};

export default TaskList;

window.app.registerPluginItemCallback(info.name, TaskList.execute);
