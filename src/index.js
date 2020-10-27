import DOMController from './DOMcontroller';
import logicController from './logicController';

logicController.addProject('daily living');
logicController.addTask(0, 'take a dump', 'I have to do this', 'it will take an hour', false);
logicController.addTask(0, 'get out of bed', 'No choice', 'no news readng in bed', false);
logicController.addProject('life goals');
logicController.addTask(1, 'party a lot', 'drinking is good', 'maybe beer', false);
logicController.addProject('obligations');
logicController.addTask(2, 'go to school', 'learning is good', 'need to get an A', false);

console.log(logicController.projects[0].title);
console.log(logicController.projects[1].tasks[0]);

DOMController.renderProjectTitles();