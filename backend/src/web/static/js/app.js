angular.module("projetolistacompras", ['ui.bootstrap']).config(function ($interpolateProvider) {
	$interpolateProvider.startSymbol('{_');
	$interpolateProvider.endSymbol('_}');
});