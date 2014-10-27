/**
 * Created with IntelliJ IDEA.
 * User: Ganaraj.Pr
 * Date: 15/10/13
 * Time: 14:48
 * To change this template use File | Settings | File Templates.
 */

angular.module('app', [
    'hljs',
    'ang-drag-drop'
])

.controller('MainCtrl', function($scope) {
  $scope.men = [
      'John',
      'Jack',
      'Mark',
      'Ernie'
      ];
      
      
      $scope.women = [
      'Jane',
      'Jill',
      'Betty',
      'Mary'
      ];
      
      
      $scope.addText = "";
      
      
      $scope.dropSuccessHandler = function($event,index,array){
          array.splice(index,1);
      };
      
      $scope.onDrop = function($event,$data,array){
          array.push($data);
      };
  
});
