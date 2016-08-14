import angular from 'angular';
import { isDnDsSupported } from './utils';

const moduleName = 'ang-drag-drop';
export default moduleName;

const dndModule = angular.module(moduleName, []);

if (isDnDsSupported()) {

}

