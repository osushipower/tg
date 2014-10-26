var app = angular.module("projetolistacompras", []);
app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{_');
    $interpolateProvider.endSymbol('_}');
});

function NiceController($scope, $http) {
    $scope.produtos = [];
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

    $scope.cadastrarProduto = function() {
        var produto = {
            "nome": $scope.inputNome,
            "marca": $scope.inputMarca
        };
        console.log(produto)
        $http.post('/admin/rest/salvar', produto).success(function(json){

            produto.id = json.id;
            $scope.produtos.push(produto)
        });
    }
}