angular.module("projetolistacompras", []).config(function ($interpolateProvider) {
	$interpolateProvider.startSymbol('{_');
	$interpolateProvider.endSymbol('_}');
});