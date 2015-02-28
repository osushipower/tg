angular.module("projetolistacompras").controller("UserController", function($scope, $http) {

    $scope.produtos_sistema = [];

    $http.post('/admin/rest/listarProdutosSistema').success(function (json) {
        $scope.produtos_sistema = json || [];
    });

    $scope.listas_user = [];
    $http.post('/usuario/rest/exibirlistasusuario').success(function (json) {
        $scope.listas_user = json || [];
    });

    $scope.estabelecimentos = [];
	$http.post('/admin/rest/listarEstabelecimentos').success(function (json) {
		$scope.estabelecimentos = json || [];
	});

    $scope.listasexistentes = [];
    $http.post('/usuario/rest/buscarListas').success(function (json) {
        $scope.listasexistentes = json || [];
        //console.log(json);
    });

    $scope.img_rand_link = "";

    $scope.listatemp = [];

    $scope.search = "";
    $scope.precototal = 0;
    $scope.consultaptotal = 0;

    $scope.img_gera_rand = function() {
        $scope.imagens = ["christian.jpg", "elliot.jpg", "helen.jpg", "jenny.jpg", "justen.jpg",
                            "matt.jpg", "steve.jpg", "stevie.jpg", "tom.jpg", "veronika.jpg"];
        $scope.number_rand = Math.floor(Math.random() * $scope.imagens.length);
        $scope.img_rand_link = "../static/img/avatar/large/" + $scope.imagens[$scope.number_rand];
        //console.log($scope.img_rand_link)
    };

    $scope.initSelectedBrand = function(produto){
      produto.selected_brand = produto.brands[0];
    };

    $scope.setBrand = function(produto, marca){
        produto.selected_brand = marca;
    };

    $scope.initLocalCompra = function(){
      $scope.local_compra = $scope.estabelecimentos[0].nome;
    };

    $scope.listIsEmpty = function(){
        return $scope.listatemp.length === 0;
    };

    $scope.calcularPrecoTotal = function (n) {
        $scope.precototal = n;
        var length = $scope.listatemp.length;

        for (var i = 0; i < length; i++) {
            $scope.precototal = $scope.precototal + ($scope.listatemp[i]["preco"] * $scope.listatemp[i]["quant"]);
        }
        $scope.precototal = parseFloat(Math.round($scope.precototal * 100) / 100).toFixed(2);
    };

    $scope.visualizarLista =  function(l, lt) {
        $scope.consultaptotal = 0;
        $scope.temp = l.produtos;
        $scope.consultaptotal = lt;
        $scope.consultaptotal = parseFloat(Math.round($scope.consultaptotal * 100) / 100).toFixed(2);
    };

    $scope.removerLista = function(lista, index){
      $scope.list_to_remove = lista;
        $scope.actual_list_index = index;
    };

    $scope.confirmarRemover = function(){

      $http.post("/usuario/rest/removerlistasalva",
          {"id": $scope.list_to_remove.id}).success(function(){
              $scope.listas_user.listas.splice($scope.actual_list_index, 1);
          });
    };
    $scope.desfazerRemover = function(){
      $scope.list_to_remove  = null;
    };

    $scope.editarProduto = function (p) {
        p.editando = true;
    };

    $scope.removerProduto = function (p) {
        $scope.listatemp.splice(p, 1);
        p.quant = null;
        p.preco = null;
    };

    $scope.cadastrarProduto = function () {
        var produto = {
            "nome": $scope.inputNome,
            "marca": $scope.inputMarca
        };
        console.log(produto);
        $http.post('/usuario/rest/salvar', produto).success(function (json) {
            produto.id = json.id;
            $scope.produtos_sistema.push(produto)
        });
    };

    $scope.adicionarProdutoListaTemp = function (p) {
        if($scope.listatemp.filter(function(produto){return p.id === produto.id}).length === 0)
        $scope.listatemp.push(p);
    };

    $scope.salvarLista = function () {
        var data = {};
        var preco_total  = 0.0;
        data["produtos"] = [];
        var length = $scope.listatemp.length;

        for (var i = 0; i < length; i++) {
            data["produtos"][i] = {};
            data["produtos"][i]["id"] = $scope.listatemp[i]["id"];
            data["produtos"][i]["brand"] = $scope.listatemp[i]["selected_brand"];
            data["produtos"][i]["quant"] = $scope.listatemp[i]["quant"];
            data["produtos"][i]["preco"] = $scope.listatemp[i]["preco"];
        }
        data["total"] = parseFloat($scope.precototal);
        data["localcompra"] = $scope.local_compra;


        $http.post("/usuario/rest/salvar_lista", {lista: data});
    };

    $scope.fecharModal = function() {
        $("#mConfirmacao").hide();
    };

    $scope.limparBusca = function () {
        document.getElementById("inputSearch").value = "";
    };

});