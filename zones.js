	var clusters;
	var map;
	var geoDep;
function initMap(){

//	Initialiser la carte
	map = L.map('map').setView([42.35, -71.08], 12);


	L.tileLayer('http://tiles.mapc.org/basemap/{z}/{x}/{y}.png',
			{
		attribution: 'Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="http://mass.gov/mgis">MassGIS</a>',
		maxZoom: 17,
		minZoom: 9
			}).addTo(map); 

//	Affichage des zones de Boston (polygon) par rapport au nombre de crimes
	$.getJSON("neighborhoods_boston3.geojson",function(hoodData){
		geoDep= L.geoJson( hoodData, {
			style: function(feature){
				var fillColor,
				nbCrimes = feature.properties.PNTCNT;
				if ( nbCrimes <=0 ) fillColor = "#fee5d9";
				else if ( nbCrimes <= 615 ) fillColor = "#fcae91";
				else if ( nbCrimes <= 1229 ) fillColor = "#fb6a4a";
				else if ( nbCrimes <= 1844  ) fillColor = "#de2d26";
				else if ( nbCrimes >= 1845 ) fillColor = "#a50f15";
				else fillColor = "#f7f7f7";  // no data
				return { color: "#999", weight: 1, fillColor: fillColor, fillOpacity: .6 };
			},
			onEachFeature: function( feature, layer ){
				layer.on({
					mouseover: function(e){
						var layer = e.target,
							prop=layer.feature.properties,
							souris=e.originalEvent,
							tooltip=document.getElementById("tooltip");
						
						layer.setStyle({
							fillOpacity: 1,
							color: "#000"
						});
						
						// affichage des infos dans le tooltip
						document.getElementById("Name").innerHTML= prop.Name;
						document.getElementById("juin").innerHTML = prop.June;
                        document.getElementById("juillet").innerHTML = prop.July;
                        document.getElementById("aout").innerHTML = prop.August;
					creationGraph(prop);
					// Affichage du tooltip
                    tooltip.style.display = "initial";

                    // Déplacement du tooltip en fonction de la souris
                    if (souris.pageY + 125 > window.innerHeight) {
                        tooltip.style.top = souris.pageY - 250 + "px";
                    } else {
                        tooltip.style.top = souris.pageY - 125 + "px";
                    }
                    tooltip.style.left = souris.pageX + 10 + "px";
                    
                    // Graphique à mettre ici !
                },
                mouseout : function (e) {
                   geoDep.resetStyle(e.target);
                   // document.getElementById("tooltip").style.display = "none";
					}
				});
				
			}
		}).addTo(map);
	});
	
	function getColor(d) {
	    return d <= 0 ? '#fee5d9' :
	           d <= 615  ? '#fcae91' :
	           d <= 1229  ? '#fb6a4a' :
	           d <= 1844  ? '#de2d26' :
	           d >= 1845   ? '#a50f15' : '#a50f15';
	         
	}
	
	//Création légende
	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {

	    var div = L.DomUtil.create('div', 'info legend'),
	        grades = [0, 615, 1229, 1844, 1845],
	        labels = [];
	    // loop through our density intervals and generate a label with a colored square for each interval
	    for (var i = 0; i < grades.length; i++) {
	        div.innerHTML +=
	            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
	    }

	    return div;
	};

	legend.addTo(map);
	
//	Afficher les crimes sur la map
	$.getJSON("incidents_crime_2015_2.geojson",function(data){

		var crimes = L.geoJson(data,{
			// Afficher l'icone en fonction du crime
			pointToLayer: function(feature, latlng) {
				var smallIcon = L.icon({ 	                
					iconUrl: "icons/" +feature.properties.INCIDENT_TYPE_DESCRIPTION + '.png',
					iconSize: [30, 30]
				});



				//Affichage icone + pop up message après clique
				return L.marker(latlng, {icon: smallIcon
				
				}).on('mouseover',function () {
					this.bindPopup('<strong> Type de crime : </strong>' + feature.properties.INCIDENT_TYPE_DESCRIPTION + '<br/>' 
						+ '<strong> Lieu </strong>: ' + feature.properties.STREETNAME + '<br/>' 
						+ '<strong> Date : </strong> ' + feature.properties.FROMDATE).openPopup();
				});			
			}
		});
		//Regrouper les crimes
		clusters = L.markerClusterGroup();
		clusters.addLayer(crimes);
		map.addLayer(clusters);
	});


//	tableau contenant l'ensembles des INCIDENT_TYPE_DESCRIPTION

	var Incident = ['Other' ,

	                'Aggravated Assault',

	                'Medical Assistance',

	                'Towed',

	                'Vandalism',

	                'Investigate Person',

	                'Property Found',

	                'Sex Offender Registration',

	                'Other Burglary',

	                'Larceny',

	                'Violations',

	                'Residential Burglary',

	                'Simple Assault',

	                'Larceny From Motor Vehicle',

	                'Warrant Arrests',

	                'Counterfeiting',

	                'Verbal Disputes',

	                'Drug Violation',

	                'Motor Vehicle Accident Response',

	                'Auto Theft',

	                'Explosives',

	                'Property Lost',

	                'Fraud',

	                'Restraining Order Violations',

	                'Investigate Property',

	                'Police Service Incidents',

	                'Disorderly Conduct',

	                'Confidence Games',

	                'Landlord Tenant Disputes',

	                'Prisoner Related Incidents',

	                'Evading Fare',

	                'Robbery',

	                'Missing Person Located',

	                'Missing Person Reported',

	                'License Plate Related Incidents',

	                'Property Related Damage',

	                'Service',

	                'Fire Related Reports',

	                'Recovered Stolen Property',

	                'Auto Theft Recovery',

	                'Operating Under the Influence',

	                'Firearm Violations',

	                'Ballistics',

	                'Indecent Assault',

	                'Search Warrants',

	                'Offenses Against Child Family',

	                'Homicide',

	                'Assembly or Gathering Violations',

	                'Commercial Burglary',

	                'License Violation',

	                'Liquor Violation',

	                'Harbor Related Incidents',

	                'Prostitution',

	                'Criminal Harassment',

	                'Embezzlement',

	                'Firearm Discovery',

	                'Rape and Attempted',
	                'Arson']

//	Trier le tableau dans l'ordre alphabétique A-Z
	Incident.sort();

	var text = "Sélectionner un crime : "; 
//	Création du select avec les crimes  
	text +=   '<select onchange = "changement(this.value)" >';


	for (i = 0; i < Incident.length; i++) { 
		text += '<option>' + Incident[i] + '</option>';

	}
	text +=   '</select> ';

//	on recupere la div
	var tmp = document.getElementById("selection"); 
//	Ecriture dans la div selection
	tmp.innerHTML = text;


	var textAll=""; 
//	Création du lien dans la div all
	textAll += '<A href="javascript:window.location.reload()">REMETTRE TOUS LES CRIMES</A>';

//	on recupere la div
	var tmp = document.getElementById("all"); 
//	on ecrit ds la div
	tmp.innerHTML = textAll;
}



	function changement(type){		
		//Retire les clusters existant
		map.removeLayer(clusters);

		var promise = $.getJSON("incidents_crime_2015_2.geojson");
		promise.then(function(data) {

			var selected = L.geoJson(data, {
				// on creer le filtre
				filter: function(feature, layer) {
					return feature.properties.INCIDENT_TYPE_DESCRIPTION == type;


				},
				//on cree les icones 
				pointToLayer: function(feature, latlng) {
					var smallIcon = L.icon({ 	                
						iconUrl: "icons/"+ feature.properties.INCIDENT_TYPE_DESCRIPTION + '.png',
						iconSize: [30, 30]
					});


					return L.marker(latlng, {icon: smallIcon
						
					}).on('mouseover',function () {
						this.bindPopup('<strong> Type de crime : </strong>' + feature.properties.INCIDENT_TYPE_DESCRIPTION + '<br/>' 
							+ '<strong> Lieu </strong>: ' + feature.properties.STREETNAME + '<br/>' 
							+ '<strong> Date : </strong> ' + feature.properties.FROMDATE).openPopup();
					});			
				}
			});
			//Regrouper la selection des crimes
			clusters2 = L.markerClusterGroup();
			clusters2.addLayer(selected);
			map.addLayer(clusters2);

		});
	}   


