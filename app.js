var app = angular.module('wordy', ['lr.upload']);

//Utility Factory
app.factory('utils', function () {
	var getKeyValueObjArrInArr = function (arr, key, val) {
		var filteredArr = arr.filter(function (entry) {
			return entry[key] === val;
		});
		return filteredArr;
	};
	var isKeyValueObjInArr = function (arr, key, val) {
		return getKeyValueObjArrInArr(arr, key, val).length > 0;
	};
	var sortByDecendingOrder = function (a, b) {
		if (a < b) return 1;
		else if (a > b) return -1;
		else return 0;
	};
	var cloneArray = function (arr) {
		return arr.slice(0);
	};
	return {
		getKeyValueObjArrInArr: getKeyValueObjArrInArr,
		isKeyValueObjInArr: isKeyValueObjInArr,
		sortByDecendingOrder: sortByDecendingOrder,
		cloneArray: cloneArray
	};
});

//at.js Factory for creating at.js instance 
app.factory('atJs', function () {
	var create = function (jQueryIdentifier, dataArray, limit) {
		$(jQueryIdentifier).atwho({
			at: "",
			data: dataArray,
			limit: limit,
			displayTpl: '<li>${token}</span></li>',
			insertTpl: '${token}'
		});
	};
	return {
		create: create
	};
});

//Text Controller for performing text editor related operations 
app.controller('TextController', ['$scope', 'utils', 'atJs', function ($scope, utils, atJs) {

	var srcArr = [];
	var networkTokensCache = [];
	$scope.predictionLimit = 3;
	$scope.uploadList = [];
	$scope.hideUploadButton = false;
	$scope.logList = [];

	$scope.onUpload = function (files) {
		$scope.hideUploadButton = true;
		files[0]['progress'] = 'Uploading file ...';
		$scope.currentUploadItem = files[0];
		$scope.logList.push(files[0].name + ' upload started.');
	};

	$scope.onSuccess = function (response) {
		$scope.hideUploadButton = false;
		$scope.currentUploadItem.progress = "Upload Completed.";
		if (response.data && response.data.srcArr.forEach) {
			response.data.srcArr.forEach(function (res) {
				networkTokensCache.push(res);
				srcArr.push(res);
			});
		}
		$scope.logList.push(response.data.fileInfo.fileDescriptor.filename + ' uploaded successfully.');
	};

	$scope.onError = function (response) {
		$scope.hideUploadButton = false;
		$scope.currentUploadItem.progress = "Something went wrong while uploading.";
		$scope.logList.push(response.data.fileInfo.fileDescriptor.filename + ' upload failed.');
	};

	$scope.onComplete = function (response) {

	};
	
	//get Predictions  
	var getPredictions = function (key, dataArr) {
		for (var i = 0; i < dataArr.length - 1; i++) {
			//match the key 
			if (dataArr[i] === key) {
				if (!utils.isKeyValueObjInArr(utils.getKeyValueObjArrInArr(srcArr, 'key', key), 'token', dataArr[i + 1])) {
					srcArr.push({ key: dataArr[i], token: dataArr[i + 1], count: 1 });
				} else {
					for (var j = 0; j < srcArr.length; j++) {
						if (srcArr[j].key === dataArr[i] && srcArr[j].token === dataArr[i + 1]) {
							srcArr[j].count = srcArr[j].count + 1;
							break;
						}
					}
				}
			}
		}
		var predictArr = srcArr.filter(function (entry) {
			return entry.key === key;
		}).sort(function (a, b) {
			return utils.sortByDecendingOrder(a.count, b.count);
		});
		return predictArr;
	};


	$scope.$watch('contentText', function (content) {
		//if no content empty source and populate network cached tokens 
		if (!content) {
			srcArr = utils.cloneArray(networkTokensCache);
			atJs.create('#inputor', [], $scope.predictionLimit);
			return;
		}
		var cursorPosition = $('#inputor').caret('pos');
		if( content.charCodeAt(cursorPosition - 1) === 32 ){
			var sub = content.substr(0, cursorPosition - 1);
			sub = sub.split('\n');
			var key = sub[sub.length - 1].split(' ').filter(function (val) {
				return val != '';
			}).pop();
			var dataArr = content.split('\n').join(' ').split(' ').map(function(x){
				return x.toString().trim();
			}).filter(function (val) {
				return val != '';
			});
			atJs.create('#inputor', getPredictions(key, dataArr), $scope.predictionLimit);
		}else{
			atJs.create('#inputor', [] , $scope.predictionLimit);
		}
	});

}]);