var app = angular.module("projetolistacompras", []);
app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{_');
    $interpolateProvider.endSymbol('_}');
});

function controller($scope, $http) {
    $scope.produtos = [
        {"nome": "pacoca", "marca": "pacoquita"},
        {"nome": "creme-dental", "marca": "colgate"}
    ];
    $scope.listatemp = [];
    $scope.listasuser = [];
    $scope.search = "";

    $scope.adicionarProduto = function (index) {

        $scope.listatemp.push(index);

    }

}