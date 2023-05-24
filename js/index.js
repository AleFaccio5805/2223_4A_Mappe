var map;
var citta = [
    {nome:"Roma", desc: "Roma è il capoluogo del Lazio ma anche la capitale d'Italia, composta da 2.863.843 abitanti, fondata il 21 aprile del 753 a.C., su sette colli. Ancora oggi si possono vedere nel suo centro storico. Roma, è stata da millenni capitale del Impero Romano e si estendeva su tutto il bacino del Mar Mediterraneo."}
    /*"Torino",
    "Milano",
    "Napoli",
    "Bari",
    "Catanzaro",
    "Bologna",
    "Trento",
    "Perugia",
    "Piacenza"*/
];

let div = `
    <div id="alert">
        <div>
            <h3 id="titolo"></h3>
        </div>
        <div>
            <p id = "descrizione"></p>
        </div>
    </div>`

window.onload = async function(){
    let busta = await fetch("https://nominatim.openstreetmap.org/search?format=json&city=" + citta[0].nome);
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
            zoom: 5.5
        })
    });

    for(var i = 0; i < citta.length; i++){

        busta = await fetch("https://nominatim.openstreetmap.org/search?format=json&city=" + citta[i].nome);
        vet = await busta.json();
        coord = [parseFloat(vet[0].lon), parseFloat(vet[0].lat)];
        //Incercettazione del click sulla mappa
        
        //Indirizzo riferito alla cartella principale (index.html, non nel js)
        let layer1 = aggiungiLayer(map, "img/marker.png");
        aggiungiMarker(layer1, citta[i], coord[0], coord[1]);
    }
    
    map.on("click", function(evento){
        //proprietà pixel dell'evento

        /** forEachFeatureAtPixel: passo da avere i pixel premuti ad avere un marker
         * secondo parametro --> funzione richiamata per ogni feature trovata
         */
        let marker = map.forEachFeatureAtPixel(evento.pixel, feature => feature); // (feature) =>{return feature;});
        alert(marker.dati.nome + " - " + marker.dati.desc);
        console.log(marker.dati);

        let body = document.getElementsByTagName("main")[0];
        var modal = document.getElementById("myModal");

        var span = document.getElementsByClassName("close")[0];

        document.getElementById("titolo").innerHTML = marker.dati.nome;
        document.getElementById("desc").innerHTML = marker.dati.desc;

        modal.style.display = "block";

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        }

    });
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
function aggiungiMarker(layer, comune, lon, lat){
    let marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([lon, lat])));
    marker.dati = {
        nome:comune.nome,
        lon:lon,
        lat:lat,
        desc:comune.desc
    };
    marker.name = comune.nome;
    //Inserisce il marker nel layer passato nel parametro
    layer.getSource().addFeature(marker);
}