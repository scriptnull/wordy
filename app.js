var app = angular.module('wordy', ['angularFileUpload']);

app.factory('utils', function () {
	var isKeyValueObjInArr = function (arr, key, val) {
		var filteredArr = arr.filter(function (entry) {
			return entry[key] === val;
		});
		return filteredArr.length > 0;
	};
	var sortByDecendingOrder = function(a , b ){
		if(a < b )	return 1 ;
		else if (a > b ) return -1 ;
		else return 0;
	};
	return {
		isKeyValueObjInArr : isKeyValueObjInArr , 
		sortByDecendingOrder : sortByDecendingOrder
	}
});
app.factory('atJs' , function(){
	var create = function(jQueryIdentifier , dataArray , limit ){
		$(jQueryIdentifier).atwho({
				at: "",
				data: dataArray , 
				limit : limit ,
				displayTpl : '<li>${token}</span></li>' ,
				insertTpl : '${token}'
		});
	}
	return{ 
		create : create 
	};	
});
app.controller('TextController', ['$scope' , 'FileUploader' , 'utils', 'atJs' , function ($scope , FileUploader , utils , atJs) {
	
	var srcArr = [];
	var networkTokensCache = [];
	 $scope.predictionLimit = 3;
	
	var getCursorPosition = function (id) {
		return $('#' + id).caret('position');
	};
	
	 $scope.uploader = new FileUploader();
	 
	 $scope.$watch('contentText', function (content) {
		//if no content empty source and populate network cached tokens 
		if (!content){
			srcArr = networkTokensCache ;
			atJs.create('#inputor' , srcArr , $scope.predictionLimit);
			return;		
		}
		//if last char is space 
		if (content.toString().lastIndexOf(' ') == content.length - 1) {
			var dataArr = content.split(' ').filter(function(val){
				return val != '';
			});
			var key = dataArr.pop();
			for(var i = 0 ; i < dataArr.length -1 ; i++){
				//match the key 
				if(dataArr[i] === key){
					if( !utils.isKeyValueObjInArr(srcArr , 'token' , dataArr[i + 1]) ){
						srcArr.push({ key : dataArr[i] , token : dataArr[i+1] , count : 1 });
					}else{
						for(var j = 0  ; j < srcArr.length ; j++ ){
							if( srcArr[j].key === dataArr[i] && srcArr[j].token === dataArr[i+1] ){
								srcArr[j].count = srcArr[j].count + 1 ;
								break; 
							}
						}
					}
				}
			}
			srcArr = srcArr.filter(function(entry){
				return entry.key === key;
			}).sort(function(a , b ){
				return utils.sortByDecendingOrder(a.count , b.count);
			});
			atJs.create('#inputor' , srcArr , $scope.predictionLimit);
		}
	});
	
}]);