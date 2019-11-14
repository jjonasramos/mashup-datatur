// =========================================================
// ANGULARJS
// =========================================================

var appAngular = angular.module( "appDatatur", ['ngRoute'] );

appAngular.config(['$httpProvider',  
  function($httpProvider) {

    if(!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.common = {};
    }          

    $httpProvider.defaults.headers.common["If-Modified-Since"] = "0";
    $httpProvider.defaults.headers.common["Cache-Control"] = "no-cache";     
    $httpProvider.defaults.headers.common.Pragma = "no-cache";                     
  }
]);

appAngular.config( function ($routeProvider,$locationProvider) {
	
	$locationProvider.hashPrefix('');

	$routeProvider

	.when("/",{
		templateUrl: "views/home.html"
	}).
	when("/mapa", {
		templateUrl: "views/mapa.html",
		controller: "MapaController"
	}).
	when("/mapa/dossieMunicipio", {
		templateUrl: "views/dossie_mun.html",
		controller: "DossieMunController"
	}).
	otherwise ({
		redirectTo: '/'
	});
} );

appAngular.component('menu',      { templateUrl: 'components/menu-nav.html' })
		  .component('rodape',    { templateUrl: 'components/rodape.html' });

// =========================================================
// QLIK
// =========================================================

var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );
var config = {
	host: window.location.hostname,
	prefix: prefix,
	port: window.location.port,
	isSecure: window.location.protocol === "https:"
};

require.config( {
	baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "") + config.prefix + "/resources"
} );

require( ["js/qlik"], function ( qlik ) {
	qlik.setOnError( function ( error ) {
		$( '#popupText' ).append( error.message + "<br>" );
		$( '#popup' ).fadeIn( 9999999 );
	} );
	$( "#closePopup" ).click( function () {
		$( '#popup' ).hide();
	} );

	// =================================== Angular Global Scope ===================================
	appAngular.run(function ($rootScope) {

		$rootScope.camadas = [
			{
				tipo: "Programas",
			 	count: 0,
			 	items:  [
					{ nome: "Investe Turismo", check: false , var: 'vLayer_Investe_Turismo', template: 'investe.html'}
				]
			},
			{
				tipo: "Categorias",
			 	count: 0,
			 	items:  [
					{ nome: "Divisão territorial", check: false, var: 'vLayer_Divisão_Territorial', template: 'divisao.html' },
					{ nome: "Nicho Turístico", check: false, var: 'vLayer_Nicho_Turístico', template: 'nicho.html' },
					{ nome: "Regiões Turísticas", check: false, var: 'vLayer_Regiões_Turísticas', template: 'regioes-tur.html' },
					{ nome: "Segmento Turístico", check: false, var: 'vLayer_Segmento_Turístico', template: 'segmento-tur.html' },
					{ nome: "Turismo Gastronômico", check: false, var: 'vLayer_Turismo_Gastronômico' },
					{ nome: "Turismo Religioso", check: false, var: 'vLayer_Turismo_Religioso' },
					{ nome: "Categorização", check: false, var: 'vLayer_Categorização', template: 'categorizacao.html' },
					{ nome: "Unidades de Conservação Federais", check: false, var: 'vLayer_Unidades_de_Conservação_Federais', template: 'unidades.html' } 
				]
			},
			{
				tipo: "Infraestrutura",
				count: 0,
			 	items: [
					{ nome: "Aeroportos", check: false, var: 'vLayer_Aeroportos', template: 'aeroportos.html' },
					{ nome: "Ferrovias", check: false, var: 'vLayer_Ferrovias', template: 'ferrovias.html' },
					{ nome: "Hidrovias", check: false, var: 'vLayer_Hidrovias', template: 'hidrovias.html' },
					{ nome: "Portos", check: false, var: 'vLayer_Portos', template: 'portos.html' },
					{ nome: "Rodovias", check: false, var: 'vLayer_Rodovias', template: 'rodovias.html' }
				]
			},
			{
				tipo: "Fluxo",
			 	count: 0,
			 	items: [
					{ nome: "Fluxo Aéreo", check: false, var: 'vLayer_Fluxo_aéreo', template: 'fluxo-aereo.html' },
					{ nome: "Fluxo Aéreo (País/Estado)", check: false, var: 'vLayer_Fluxo_aéreo_Estado', template: 'fluxo-aereo-pe.html' },
					{ nome: "Fluxo Rodoviário", check: false, var: 'vLayer_Fluxo_rodoviário', template: 'fluxo-rodo.html' },
					{ nome: "Fluxo Rodoviário (País/Estado)", check: false, var: 'vLayer_Fluxo_rodoviário_Estado', template: 'fluxo-rodo-pe.html' }
				]
			},
			{
				tipo: "Atrativos",
				count: 0,
				items: [
					{ nome: "Eventos", check: false, var: 'vLayer_Eventos', template: 'eventos.html' },
					{ nome: "Atrativos Turísticos", check: false, var: 'vLayer_Atrativos_Turísticos', template: 'atrat-tur.html' },
					{ nome: "Empresas Turismo", check: false, var: 'vLayer_Empresas_Turismo', template: 'empresas.html' },
					{ nome: "Turismo Acessível", check: false, var: 'vLayer_Turismo_Acessível', template: 'turismo-acess.html' }						
				]
			},
			{
				tipo: "Indicadores",
				count: 0,
			 	items: [
					{ nome: "Emprego", check: false, var: 'vLayer_Emprego', template: 'emprego.html' }
				]
			}
		];

		$rootScope.export = function (tipo, id) {

			var settingsPdf = { documentSize: 'a4', aspectRatio: 2, orientation: "landscape" };
			var settingsImg = { format: 'png', height: 1080, width: 1920 }

			switch (tipo) {
				case 0:
					$('#text-modal-export').html('Exportando imagem...');
					appMapa.visualization.get(id).then(function(vis){
						vis.exportImg(settingsImg).then(function (result) {
							window.open(result);
							$('#exportModal').modal('hide');
						});
					});
					break;
				case 1:
					$('#text-modal-export').html('Exportando dados...');
					appMapa.visualization.get(id).then(function(vis){
						vis.exportData({format:'OOXML', state: 'A'}).then(function (link) {
							window.open(link);
							$('#exportModal').modal('hide');
						});
					});
					break;
				case 2:
					$('#text-modal-export').html('Gerando PDF...');
					appMapa.visualization.get(id).then(function(vis){
						vis.exportPdf(settingsPdf).then(function (result) {
							window.open(result);
							$('#exportModal').modal('hide');
						});
					});
					break;
			
				default:
					break;
			}
		};

		$rootScope.fullScreen = function (div, id) {
			appMapa.getObject(div, id).then(function(vis) {
				vis.layout.showTitles = false;
			});
		}
	});
	// =================================== Route - Dossiê ===================================
	appAngular.controller("DossieMunController", ['$scope', '$location', function ( $scope, $location ) {

		var qtd;
		$scope.destMunicipio = [];

		$scope.atratMun = [];

		appMapa.createList({
			qDef: {
				 qFieldDefs: ["Nome Municipio - DNE"]
			},
			qAutoSortByState: {
				 qDisplayNumberOfRows: 1
			},
			qInitialDataFetch: [{
				 qHeight : 2,
				 qWidth : 1
			}]
	   }, function(reply) {
			var rows = _.flatten(reply.qListObject.qDataPages[0].qMatrix);
			var selected = rows.filter(function(row) { return row.qState === "S"; });
			qtd = selected.length;

			if(qtd == 1) {
				appMapa.getObject('mapa', 'ZpLDsjs').then(function(vis) {
					$scope.mapa = vis.id;
					vis.layout.showTitles = false;
				});

				appMapa.getObject('gauge0', 'qgmJrN');

				appMapa.getObject('gauge1', 'atYHkPJ');

				appMapa.getObject('gauge2', 'ECNPaue');

				// =================================== Lists and Cubes ===================================
				appMapa.createGenericObject( {
					macrorregiao : { qStringExpression: "=[Nome Região - DNE]" },
					uf : { qStringExpression: "=[Sigla Estado - DNE]" },
					regiao : { qStringExpression: "=[Região Turistica - DNE]" },
					categoria : { qStringExpression: "=[Categoria Municipio - DNE]" },
					destinos : { qStringExpression: "=Num(Count(distinct [%Id Destino - SIDTUR]), '#.##0')" },
					atrativos : { qStringExpression: "=Num(Count(distinct [%Id Atrativo - SIDTUR]), '#.##0')" },
					nacionais : { qStringExpression: "=Num([Visitantes Domesticos Municipio - SIDTUR], '#.##0')" },
					aniversario : { qStringExpression: "=Date(Date#([Data Aniversario Cidade Municipio - SIDTUR], 'DD/M'), 'DD/MMMM')" },
					estabelecimentos : { qStringExpression: "=Num([Estabelecimentos de Hospedagem Municipio - SIDTUR], '#.##0')" },
					internacionais : { qStringExpression: "=Num([Visitantes Internacionais Municipio - SIDTUR], '#.##0')" }
				}, function ( reply ) {
					$('#macrorregiao').val(reply.macrorregiao);
					$('#uf').val(reply.uf);
					$('#regiao').val(reply.regiao);
					$('#categoria').val(reply.categoria);
					$('#destinos').val(reply.destinos);
					$('#atrativos').val(reply.atrativos);
					$('#vis_nac').val(reply.nacionais);
					$('#aniversario').val(reply.aniversario);
					$('#estabelecimentos').val(reply.estabelecimentos);
					$('#vis_int').val(reply.internacionais);
				});

			   	appMapa.createCube({
					qDimensions : [{
						qDef : {
							qFieldDefs : ["Nome Destino - SIDTUR"]
						}
					}],
				  	qInitialDataFetch: [{ qTop: 0, qLeft: 0, qWidth: 1, qHeight: 10000 }]
				}).then(function(model) {
					model.layout.qHyperCube.qDataPages[0].qMatrix.forEach(e => {
						$scope.destMunicipio.push(e[0].qText);
					});
				});

				// CRIAR A TABELA
				var cubo = appMapa.createTable(
									["Nome Evento - AgendaEventos", 
									"Descrição Evento - AgendaEventos",
									"Tipo Evento - AgendaEventos",
									"Categoria Evento - AgendaEventos",
									"Período/Data Evento - AgendaEventos",								
									"Relevancia Evento - AgendaEventos"], {rows:200});
				
				var listener = function() {
					var rowCount = cubo.rowCount;
					var dataSet = [];

					
					for (let i = 0; i < rowCount; i++) {
						let aux_row = [];
						for (let j = 0; j < 6; j++) {
							aux_row.push(cubo.rows[i].cells[j].qText);
						}

						dataSet.push(aux_row);
					}

					var table = $('#tbEventos').DataTable( {
						data: dataSet,
						responsive: true,
						dom: 'Bfrtip',
						buttons: [
							{extend: 'copy', text: 'Copiar'}, 
							{extend: 'csv', text: 'CSV'}, 
							{extend: 'excel', text: 'Excel'}, 
							{extend: 'pdf', text: 'PDF'}, 
							{extend: 'colvis', text: 'Colunas'}
						],
						scrollY:        "400px",
						scrollX:        false,
						scrollCollapse: true,
						paging:         true,
						fixedColumns:   {
							heightMatch: 'none'
						},
						autoWidth: true,
            			bAutoWidth: true,
						"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
						"language": {
							"lengthMenu": 	  "Mostrar _MENU_ eventos por página",
							"zeroRecords": 	  "Nenhum evento encontrado",
							"info": 		  "Exibindo página _PAGE_ de _PAGES_",
							"infoEmpty": 	  "Não existem eventos para este município",
							"infoFiltered":   "(Filtrados de _MAX_ eventos)",
							"search":         "Pesquisar:",
							"paginate": {
								"first":      "Primeira",
								"last":       "Última",
								"next":       "Próxima",
								"previous":   "Anterior"
							}
						},
						columns: [
							{ title: "Nome" },
							{ title: "Descrição" },
							{ title: "Tipo" },
							{ title: "Categoria" },
							{ title: "Período" },
							{ title: "Relevância" }
						]
					} );

					table.buttons().container().appendTo( '#tbEventos .col-md-6:eq(0)' );

					table.columns.adjust().responsive.recalc();

					cubo.OnData.unbind( listener );
				};

				cubo.OnData.bind( listener );


				$scope.getDesc = function() {

					var set = `${$scope.selectedMun.replace(/\'/g, "\'")}`;
					var exp = "=MaxString({<[Nome Destino - SIDTUR] = {\"" + set + "\"}>} DISTINCT [Descrição Destino - SIDTUR])";

					appMapa.createGenericObject( {
						descricao : { qStringExpression: exp }
					}, function ( reply ) {
						$scope.descDestino = reply.descricao;
						$('#collapseDescricao').collapse('show');

						$scope.atratMun = [];

						var expAtrat = "=Only({<[Nome Destino - SIDTUR] = {\"" + set + "\"}>} DISTINCT [Nome Atrativo - SIDTUR])";

						appMapa.createCube({
							qDimensions : [{
								qDef : {
									qFieldDefs : ["Nome Atrativo - SIDTUR"]
								}
							}],
							qMeasures : [{
								qDef : {
									qDef : expAtrat
								}
							}],
							qInitialDataFetch: [{ qTop: 0, qLeft: 0, qWidth: 1, qHeight: 10000 }]
						}).then(function(model) {
							model.layout.qHyperCube.qDataPages[0].qMatrix.forEach(e => {
								$scope.atratMun.push(e[0].qText);
							});
						});
					});
				}

				$scope.getAtrat = function() {
					var dest = `${$scope.selectedMun.replace(/\'/g, "\'")}`;
					var atrat = `${$scope.selectedAtrat.replace(/\'/g, "\'")}`;
					var exp = "=MaxString({<[Nome Destino - SIDTUR] = {\"" + dest + "\"}, [Nome Atrativo - SIDTUR] = {\"" + atrat + "\"}>} DISTINCT [Descrição Atrativo - SIDTUR])";
				
					appMapa.createGenericObject( {
						atrativo : { qStringExpression: exp }
					}, function ( reply ) {
						$scope.descAtrativo = reply.atrativo;
						$('#collapseAtrativo').collapse('show');
					});
				}


			} else {
				$('#errorModal').modal('show');

				$("#errorModal").on('hidden.bs.modal', function () {
					$scope.$apply(function(){
						$location.path('/mapa');  
					});
				});
			}
	   });
	}]);

	// =================================== Route - Mapa ===================================
	appAngular.controller("MapaController", ['$scope', '$rootScope', function ( $scope, $rootScope ) {


		// =================================== Angular Functions ===================================
		$scope.checkCamada = function(e) {
			
			if(e.item.check) {
				appMapa.variable.setNumValue(e.item.var, 0);
				e.$parent.camada.count--;
			}
			else {
				appMapa.variable.setNumValue(e.item.var,1);
				e.$parent.camada.count++;
			} 
			
			e.item.check = !e.item.check;
		};

		$scope.closeModal = function () {
			const elements = document.getElementById('result');
			while (elements.firstChild) {
				elements.removeChild(elements.firstChild);
			}

			$scope.layout = '';
		}

		$scope.setTemplate = function(e) {
			$scope.layout = 'components/filtros/' + e.item.template;
		}

		$scope.getObject = function(div, id) {
			appMapa.getObject(div, id);
		}

		$scope.limparCamadas = function() {
			$rootScope.camadas.forEach(camada => {
				camada.items.filter(e => e.check).forEach(item => {
					item.check = false;
					appMapa.variable.setNumValue(item.var, 0);
					camada.count--;
				})
			});
		}

		// =================================== Get Objects ===================================
		appMapa.getObject('mapa', 'cuEuHj').then(function(vis) {
			$scope.mapa = vis.id;
			vis.layout.showTitles = false;
		});

		appMapa.getObject('Selecoes', 'CurrentSelections');

		appMapa.getObject('filtros', 'DysVpj').then(function (vis) {
			vis.layout.showTitles = false;
		});

		// =================================== Lists and Cubes ===================================
		appMapa.createList({
			qDef: {
					qFieldDefs: ["Nome Municipio - DNE"]
			},
			qAutoSortByState: {
					qDisplayNumberOfRows: 1
			},
			qInitialDataFetch: [{
					qHeight : 2,
					qWidth : 1
			}]
		}, function(reply) {			
			var rows = _.flatten(reply.qListObject.qDataPages[0].qMatrix);
			var selected = rows.filter(function(row) { return row.qState === "S"; });

			if(selected.length == 1)
				$('#showDossieModal').collapse('show');
			else
				$('#showDossieModal').collapse('hide');
		});

		appMapa.getList( "CurrentSelections", function( reply ) {
			if(reply.qSelectionObject.qSelections.length > 0) {
				$('.btn-filtros').css('background', '#4caf50');
				$('.btn-filtros').css('color', 'white');
			} else {
				$('.btn-filtros').css('background', 'white');
				$('.btn-filtros').css('color', '#007bff');
			}
		});
	
	}]);


	angular.bootstrap( document, ["appDatatur", "qlik-angular"] );

	appMapa = qlik.openApp('4f7111a4-791b-4e32-b57e-1be898d61d55');

	qlik.theme.apply('mtur_painelemendas');
} );