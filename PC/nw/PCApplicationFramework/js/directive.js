var directive = angular.module('PCApp.directive',[]);

directive.directive('autoPlayCarousel', function(){   
  return {
    restrict: 'A',
    link : function(scope,elem,attr){
      $(elem).carousel();
    }
  }  
});

directive.directive('dragable', function(){   
  return {
    restrict: 'A',
    link : function(scope,elem,attr){
      var gui = require('nw.gui');
      var win = gui.Window.get();
      var height = win.height;
      var width = win.width;
      var h = attr.h;
      var w = attr.w;
      var element = elem[0].parentNode.parentNode;
      $(element).css('margin-top',(height-h-100)/2 +'px');
      $(element).css('margin-left', (width-w)/2 +'px');
    }
  }  
});

directive.directive('sortable', function(){   
  return {
    restrict: 'A',
    scope:{
    				savesort:'&'
    },
    link : function(scope,elem,attr){
    	function getMenuIds(){
    		var children = $(elem).find("li");
    		var data = [];
    		var i=0;
    		angular.forEach(children, function(item){
    			var menuid = $(item).attr("menuid");
    			if(menuid){
    			  	data.push({'id':menuid, 'order':i});
    			  	i++
    			 }
    		});
    		scope.savesort({data:data});
    	}
      $(elem).sortable({stop:getMenuIds});
      $(elem).disableSelection();
    }
  }  
});

directive.directive("myModal", function ($modal) {
    "use strict";
    return {
      link: function (scope, element, attrs) {
      	if(!attrs['url']) return;
        scope.clickMe = function () {
            var modalInstance = $modal.open({
            templateUrl: attrs['url'],
            backdrop:'static',
            keyboard:false,
            controller: function ($scope, $modalInstance) {
                $scope.ok = function () {
                    $modalInstance.close({ test: "test"});
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }
        });
        }
      }
    };
});