var map;
var citta = [
    "Roma",
    "Torino",
    "Milano",
    "Napoli",
    "Bari",
    "Catanzaro",
    "Bologna",
    "Trento",
    "Perugia",
    "Piacenza"
]

window.onload = async function(){
    let busta = await fetch("https://nominatim.openstreetmap.org/search?format=json&city=" + citta[0]);
    let vet = await busta.json();
    let coord = [parseFloat(vet[0].lon), parseFloat(vet[0].lat)];

    //Definisco una mappa
    map = new ol.Map({
        target:"map", /* id dell'oggetto html */
        /* Definisco il livello base (mappa globale completa) */
        layers:[
            new ol.layer.Tile({source:new ol.source.OSM()})
        ],
        /*caratteristiche visive (zoom, centro, ...) della mappa creata */
        view:new ol.View({
            /* Array di Float: coordinaete (lon.lat) */
            center: ol.proj.fromLonLat(coord),
            zoom: 5
        })
    });

        
    for(var i = 0; i < citta.length; i++){
            
        busta = await fetch("https://nominatim.openstreetmap.org/search?format=json&city=" + citta[i]);
        vet = await busta.json();
        coord = [parseFloat(vet[0].lon), parseFloat(vet[0].lat)];
        //Incercettazione del click sulla mappa
        map.on("click", function(evento){
            //proprietà pixel dell'evento

            /** forEachFeatureAtPixel: passo da avere i pixel premuti ad avere un marker
             * secondo parametro --> funzione richiamata per ogni feature trovata
             */
            let marker = map.forEachFeatureAtPixel(evento.pixel, feature => feature) // (feature) =>{return feature;});
            if(marker)
                alert(marker.name);
        });
        
        //Indirizzo riferito alla cartella principale (index.html, non nel js)
        let layer1 = aggiungiLayer(map, "img/marker.png");
        aggiungiMarker(layer1, "Test", coord[0], coord[1]);
    }
}

/* creazione nuovo layer */
function aggiungiLayer(mappa, pathImg){
    let layer = new ol.layer.Vector({
        /* Il sorgente dello strato visivo che si vuole aggiungere (Es. altra mappa) */
        source: new ol.source.Vector(),
        /* Permette di specificare delle caratteristiche grafiche del layer (no css) */
        style: new ol.style.Style({
            image: new ol.style.Icon({
                /* Coordinate dell'immagine rispetto alle coordinate del punto */
                anchor: [0.5, 1],
                src: pathImg
            })
        })
    });
    mappa.addLayer(layer);
    return layer;
}

/**
 * Aggiunge un nuovo marker in un layer
 * @param {*} layer 
 * @param {*} nome Testo da visualizzare 
 * @param {*} lon:float Longitudine
 * @param {*} lat:float Latitudine
 */
function aggiungiMarker(layer ,nome, lon, lat){
    let marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([lon, lat])));
    
    marker.name = nome;

    //Inserisce il marker nel layer passato nel parametro
    layer.getSource().addFeature(marker);
}