import DOMController from './DOMcontroller';
import logicController from './logicController';

logicController.addProject('daily living');
logicController.addTask(0, 'take a dump', 'I have to do this', false);
logicController.addTask(0, 'get out of bed', 'No choice', false);
logicController.addProject('life goals');
logicController.addTask(1, 'party a lot', 'drinking is good', false);
logicController.addProject('obligations');
logicController.addTask(2, 'go to school', 'learning is good', false);

DOMController.renderProjectTitles();