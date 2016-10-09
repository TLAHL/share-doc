var filter = angular.module('PCApp.filter',[]);

filter.filter('trusturl', ['$sce',  function ($sce) {
    return function (url) {
        return $sce.trustAs($sce.RESOURCE_URL, url);
    };
}]);