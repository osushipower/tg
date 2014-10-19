var app = angular.module("projetolistacompras", []);
app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{_');
    $interpolateProvider.endSymbol('_}');
});

function NiceController($scope, $http) {
    $scope.produtos = [
        {"nome": "pacoca", "marca": "pacoquita"},
        {"nome": "creme-dental", "marca": "colgate"}
    ];
    $scope.listatemp = [];
    $scope.listasuser = [];
    $scope.search = "";

    $scope.adicionarProduto = function (index) {

        $scope.listatemp.push($scope.produtos[index]);

    };

    $scope.editarProduto = function(index) {
        index.editando = true;
    };

    $scope.removerProduto = function(index) {
        $scope.listatemp.splice(index, 1);
    };


}