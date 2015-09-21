var app = angular.module('wordy', ['angularFileUpload']);

//Utility Factory
app.factory('utils', function () {
	var getKeyValueObjArrInArr = function(arr , key , val){
		var filteredArr = arr.filter(function (entry) {
			return entry[key] === val;
		});
		return filteredArr;
	};
	var isKeyValueObjInArr = function (arr, key, val) {
		return getKeyValueObjArrInArr(arr , key , val ).length > 0;
	};
	var sortByDecendingOrder = function(a , b ){
		if(a < b )	return 1 ;
		else if (a > b ) return -1 ;
		else return 0;
	};
	var cloneArray = function(arr){
		return arr.slice(0);
	}
	return {
		getKeyValueObjArrInArr : getKeyValueObjArrInArr,
		isKeyValueObjInArr : isKeyValueObjInArr , 
		sortByDecendingOrder : sortByDecendingOrder ,
		cloneArray : cloneArray
	}
});

//at.js Factory for creating at.js instance 
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

//Text Controller for performing text editor related operations 
app.controller('TextController', ['$scope' , 'FileUploader' , 'utils', 'atJs' , function ($scope , FileUploader , utils , atJs) {
	
	var srcArr = [];
	var networkTokensCache = [];
	 $scope.predictionLimit = 3;
	
	var getCursorPosition = function (id) {
		return $('#' + id).caret('position');
	};
	
	 $scope.uploader = new FileUploader({
		 url : 'http://localhost:1337/parse'
	 });
	 
	 $scope.$watch('contentText', function (content) {
		//if no content empty source and populate network cached tokens 
		if (!content){
			srcArr = utils.cloneArray(networkTokensCache);
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
					if(!utils.isKeyValueObjInArr(utils.getKeyValueObjArrInArr(srcArr , 'key' , key ), 'token' , dataArr[i + 1])){
					    console.log('added key ' + key + ' value ' + dataArr[i+1]);
						srcArr.push({ key : dataArr[i] , token : dataArr[i+1] , count : 1 });
					}else{
						for(var j = 0  ; j < srcArr.length ; j++ ){
							if( srcArr[j].key === dataArr[i] && srcArr[j].token === dataArr[i+1] ){
								console.log('count incremented key ' + key + ' value ' + dataArr[i+1]);
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