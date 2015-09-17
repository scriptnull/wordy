var app = angular.module('wordy', []);
app.controller('TextController', ['$scope', function ($scope) {
	var getCursorPosition = function (id) {
		return $('#' + id).caret('position');
	};


	$scope.$watch('contentText', function (content) {
		if (!content) return;
		if (content.toString().lastIndexOf(' ') == content.length - 1) {
			var dataArr = content.split(' ').filter(function(val){
				return val != '';
			});
			var key = dataArr.pop();
			var srcArr = [];
			for(var i = 0 ; i < dataArr.length -1 ; i++){
				if(dataArr[i].toLowerCase().localeCompare(key.toLowerCase()) == 0 && srcArr.indexOf(dataArr[i + 1].toLowerCase()) == -1 ){
					srcArr.push(dataArr[i + 1 ]);
				}
			}
			$('#inputor').atwho({
				at: "",
				data: srcArr
			});
		}
	});
	
	
}]);