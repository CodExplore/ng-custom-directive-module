(function () {
	'use strict';

	angular.module('NarrowItDownApp', [])
		.controller('NarrowItDownController', NarrowItDownController)
		.service('MenuSearchService', MenuSearchService)
		.constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com')
		.directive('foundItems', foundItems);

	function foundItems() {
		var ddo = {
			restrict: 'AE',
			templateUrl: 'found.html',
			scope: {
				foundItem: '<',
				onRemove: '&',
			},
			controller: NarrowItDownController,
			controllerAs: 'narrow',
			bindToController: true
		};

		return ddo;
	}

	NarrowItDownController.$inject = ['MenuSearchService'];

	function NarrowItDownController(MenuSearchService) {
		var narrow = this;
		narrow.getItems = function () {
			narrow.found.length = 0;
			narrow.processed = 1;
			if (narrow.searchTerm !== "") {
				MenuSearchService.getMatchedMenuItems(narrow.searchTerm.toLowerCase());
			}
			return true;
		};
		narrow.found = MenuSearchService.getFoundItems();

		narrow.removeItem = function (narrowIndex) {
			MenuSearchService.removeItem(narrowIndex);
		}
	}
	MenuSearchService.$inject = ['$http', 'ApiBasePath'];

	function MenuSearchService($http, ApiBasePath) {
		var service = this;
		var foundItems = [];
		service.getMatchedMenuItems = function (searchTerm) {

			var response = $http({
				method: "GET",
				url: (ApiBasePath + "/menu_items.json")
			});

			return response.then(function (response) {
				for (var i = 0; i < response.data.menu_items.length; i++) {

					if (response.data.menu_items[i].description.indexOf(searchTerm) !== -1) {
						foundItems.push(response.data.menu_items[i]);
					}
				}
				return foundItems;
			});

		};

		service.removeItem = function (itemIndex) {
			foundItems.splice(itemIndex, 1);
		};

		service.getFoundItems = function () {
			return foundItems;
		};
	}
})();
