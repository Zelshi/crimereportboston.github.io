var dataTableChart ;
var dataTableGraphe;
var regroupementNombre;
var pie;
var colOptions;
var lineChart;
var lineOptions;
var tabCrime;
var dataBubbleChart;
var pieOptions;
var options;
var optionsBubble;
var dataGraph;
var chartBubble;
var columnChart;
var line;
var Monday = new Array(59);
var layerLine;

for (j=0;j<59;j++) {
	Monday[j]=0;
}Monday[0] = 'Monday';
var Tuesday= new Array(59);

for (j=0;j<59;j++) {
	Tuesday[j]=0;
}Tuesday[0] = 'Tuesday';

var Wednesday= new Array(59);

for (j=0;j<59;j++) {
	Wednesday[j]=0;
}Wednesday[0]='Wednesday';

var Thursday= new Array(59);

for (j=0;j<59;j++) {
	Thursday[j]=0;
}Thursday[0]= 'Thursday';

var Friday= new Array(59);

for (j=0;j<59;j++) {
	Friday[j]=0;
}Friday[0]='Friday';

var Saturday= new Array(59);

for (j=0;j<59;j++) {
	Saturday[j]=0;
}Saturday[0]='Saturday';

var Sunday= new Array(59);

for (j=0;j<59;j++) {
	Sunday[j]=0;
}Sunday[0]='Sunday';

function initData(){

	var isType = false;
	var tmp;
	// Chargement des données
	$.getJSON("incidents_crime_2015_2.geojson", function (data) {
		// Création d'une DataTable compatible pour Google Charts
		dataTableChart = new google.visualization.DataTable();
		//dataTableGraphe = new google.visualization.DataTable();
		dataTableChart.addColumn('string', 'TypeCrime');
		dataTableChart.addColumn('date', 'DateCrime'); // date americaine  mm/dd/yyyy hh:mm
		dataTableChart.addColumn('string', 'Lieu'); 
		dataTableChart.addColumn('string', 'jour'); // jour du crime 
		var result = data.features.length;

		for(var i = 0; i < result; i++){
			dataTableChart.addRows([[ data.features[i].properties.INCIDENT_TYPE_DESCRIPTION,
			                          new Date( data.features[i].properties.FROMDATE),
			                          data.features[i].properties.REPTDISTRICT,
			                          data.features[i].properties.DAY_WEEK
			                          ]]);
		}

		tabCrime = dataTableChart.getDistinctValues(0);
		tabCrime.splice(0, 0, "Jour");
		var j  = 0;


		//On bloucle sur chaque ligne
		for(var l = 0; l < result; l++){
			//Pour chaque ligne on va récupérer le jour du crime

			var jourDuCrime = data.features[l].properties.DAY_WEEK;
			var typeDeCrime = data.features[l].properties.INCIDENT_TYPE_DESCRIPTION;

			for( j = 0; j< tabCrime.length-1;j++){
				if(tabCrime[j]==typeDeCrime){
					break;
				}
			}
			//On parcourt notre tableau de jour pour récupérer l'index du jour

			if(jourDuCrime=="Monday"){
				Monday[j] = Monday[j] + 1
			}if(jourDuCrime =="Tuesday"){
				Tuesday[j] = Tuesday[j] + 1
			}if(jourDuCrime =="Wednesday"){
				Wednesday[j] = Wednesday[j] + 1
			}if(jourDuCrime =="Thursday"){
				Thursday[j] = Thursday[j] + 1
			}if(jourDuCrime =="Friday"){
				Friday[j] = Friday[j] + 1
			}if(jourDuCrime =="Saturday"){
				Saturday[j] = Saturday[j] + 1
			}if(jourDuCrime =="Sunday"){
				Sunday[j] = Sunday[j] + 1

			}

		}

		// Appel de la fonction créant les graphiques



		//Nous allons créer une 2e DataTavle pour exploiter les zones dangereuses

		// Chargement des données
		$.getJSON("neighborhoods_boston3.geojson", function (data2) {
			// Création d'une DataTable compatible pour Google Charts
			dataTableGraphe = new google.visualization.DataTable();
			dataTableGraphe.addColumn('string', 'Nom des zones');
			dataTableGraphe.addColumn('number', 'Nombre de crime'); // date americaine  mm/dd/yyyy hh:mm

			var result2 = data2.features.length;
			for(var i = 0; i < result2; i++){
				dataTableGraphe.addRows([[ data2.features[i].properties.Name,
				                           parseInt(data2.features[i].properties.PNTCNT)
				                           ]]);
			}
			//	go();

		});

		//Bubble chart
		$.getJSON("neighborhoods_boston3.geojson", function(data){
			dataBubbleChart = new google.visualization.DataTable();
			dataBubbleChart.addColumn ('string', "Zone");
			dataBubbleChart.addColumn ('number', 'Acres');
			dataBubbleChart.addColumn ('number', "Crimes");
			dataBubbleChart.addColumn ('number', "NbCrimes1");
			dataBubbleChart.addColumn ('number', "NbCrimes");



			var result = data.features.length;

			for(var i=0; i<result; i++){

				dataBubbleChart.addRows([[data.features[i].properties.Name,
				                          data.features[i].properties.Acres,
				                          parseInt(data.features[i].properties.PNTCNT),
				                          parseInt(data.features[i].properties.PNTCNT),
				                          parseInt(data.features[i].properties.PNTCNT)
				                          ]]);
			}

		});

	});
}

function afficherPie(){
	// Calcul d'agrégat sur le type de crime : COUNT
	regroupementNombre1 = google.visualization.data.group(
			dataTableChart,
			[0],
			[{'column': 0, 'aggregation': google.visualization.data.count, 'type': 'number'}]
	);


	regroupementNombre1.setColumnLabel(0, "Type de Crime")
	regroupementNombre1.setColumnLabel(1, "Nombre de Crimes");

	//On remet à jour dans le cas ou d'autres choix (courbe, columnChart, etc) ont été fait avant
	document.getElementById('choixUser').innerHTML ="<div style=\"margin-top: 100px; text-align: center;\" id = \"filter_div\"></div><div id = \"chart_div\"></div>";
	pie = new google.visualization.Dashboard(document.getElementById('choixUser'));

	var donutRangeSlider = new google.visualization.ControlWrapper({
		'controlType': 'NumberRangeFilter',
		'containerId': 'filter_div',
		'options': {
			'filterColumnLabel': 'Nombre de Crimes'
		}
	})


	// Create a pie chart, passing some options
	var pieChart = new google.visualization.ChartWrapper({
		'chartType': 'PieChart',
		'containerId': 'chart_div',
		'options': {
			'width': 700,
			'height': 500,
			'pieSliceText': 'value',
			'legend': 'right'
		}
	});
	pie.bind(donutRangeSlider, pieChart);

	// Draw the dashboard.
	pie.draw(regroupementNombre1);

}



////Ce graphe nous permettra de comparer le taux de crimes commis par mois


//pieOptions = {
//title: 'Taux de crimes '
//};
//pie.draw(regroupementNombre1, pieOptions);
//}

function afficherGraphe(){
	dataChart = google.visualization.arrayToDataTable([tabCrime,
	                                                   Monday,
	                                                   Tuesday,
	                                                   Wednesday,
	                                                   Thursday,
	                                                   Friday,
	                                                   Saturday,
	                                                   Sunday

	                                                   ], false );

	columnChart = new google.visualization.ColumnChart(document.getElementById("choixUser"));


	options = {
			width: 700,
			height: 700,
			title: 'Nombre de crimes par type en fonction du jour de la semaine',
			legend: { position: 'bottom', maxLines: 6},
			bar: { groupWidth: '75%' },
			isStacked: true,
	};
	columnChart.draw(dataChart, options);
///////////////////////////////////////////////////////////

	//regroupement pour déterminer les zones les plus dangereuses
}

function afficherCourbe(){

	line = new google.charts.Line(document.getElementById('choixUser'));

	lineOptions = {
			width : 700,
			height: 700,
			title: 'Nombre de crimes pour chaque zone',
			curveType: 'function',
			legend: { position: 'bottom' }
	};
	line.draw(dataTableGraphe, lineOptions);

	google.visualization.events.addListener(line, 'select', metEnValeurZone);

}

//On va ajouter un listener sur la courbe qui permettra de mettre en valeur la zone correspondante



function metEnValeurZone(){
	var zoneMV = line.getSelection()[0];
	if(zoneMV){
		//On va récupérer le nom de ma ville
		metEnValeur(dataTableGraphe.getValue(zoneMV.row, 0));
	}else
		return
}

function metEnValeur(zoneMV){
	//Nous allons ensuite récuperer la layer a partir de la ville

	//Remise a zero si non null
	if(layerLine){
		geoDep.resetStyle(layerLine)
	}
	for( var index in geoDep._layers){
		layerLine = geoDep._layers[index];
		//Nous récuperons ensuite le layer correpondant a la ville cliqué
		if(layerLine.feature.properties.Name == zoneMV)
			break;
	}

	//Nous allons ensuite la mettre en valeur
	layerLine.setStyle({
		fillOpacity: 1,
		color: "#000"
	});

}

//Dessine le bubble chart
function afficherBubble() {
	optionsBubble = {
			width: 800,
			title: 'Comparaison entre le nombre de crimes d\'une zone par rapport à la taille de la zone (en Acres)',
			hAxis: {title: 'Taille de la zone (en Acres)'},
			vAxis: {title: 'Nombre de crimes par zone'},
			bubble: {textStyle: {fontSize: 10}},
			colorAxis: {colors: ['yellow', 'red']}
	};

	chartBubble = new google.visualization.BubbleChart(document.getElementById('choixUser'));
	chartBubble.draw(dataBubbleChart, optionsBubble);
}

//Création du graphique du tooltip
function creationGraph(info) {
	"use strict";

	dataGraph = new google.visualization.DataTable();
	dataGraph.addColumn('string', 'Mois');
	dataGraph.addColumn('number', 'Nb de crimes');
	dataGraph.addRows([
	                   ['Juin', parseInt(info.June)],
	                   ['Juillet', parseInt(info.July)],
	                   ['Août', parseInt(info.August)]
	                   ]);

	lineChart = new google.visualization.LineChart(document.getElementById('graph'));
	lineChart.draw(dataGraph,
			{
		'title': 'Evolution du nombre de crimes',
		'width': 350,
		'height': 250,
		'vAxis': { viewWindow: { min: 0, max: 3000 } },
		'legend': { position: 'none' }
			});
}

function afficherTableauDeBord(){

	//On affiche nos tableaux de bord 
	document.getElementById("choix").style.visibility = "visible";
	document.getElementById("choix").style.display = "";
	//On elenve le tooltip et le pie est directement affiché ( c'est le choix par défaut)
	document.getElementById("tooltip").style.visibility = "hidden";
	//On remet à jour les 
	document.getElementById("choix").children[0].checked = true;

	document.getElementById("choixUser").style.display = "";
	afficherPie();

}



