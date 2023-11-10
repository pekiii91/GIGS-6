import "ol/ol.css";
import "ol-layerswitcher/src/ol-layerswitcher.css";

import Map from "ol/Map";
import View from "ol/View";
import LayerGroup from "ol/layer/Group";
import LayerTile from "ol/layer/Tile";
import BaseLayer from "ol/layer/Base";
import SourceOSM from "ol/source/OSM";
import TileWMS from "ol/source/TileWMS";
import LayerSwitcher from "ol-layerswitcher";
import XYZ from "ol/source/XYZ";
import proj4 from "proj4";
import { get as getProjection } from "ol/proj";
import { register } from "ol/proj/proj4";

import { defaults } from "olgm/interaction";
import GoogleLayer from "olgm/layer/Google.js";
import OLGoogleMaps from "olgm/OLGoogleMaps.js";

// ovde sam registrovao
proj4.defs(
  "EPSG:3395",
  "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"
);
register(proj4);
var proj27700 = getProjection("EPSG:3395"); // from Raster Projectons/OpenLayers projekcija prikaza EPSG395
proj27700.setExtent([
  -20037508.342789244, -20037508.342789244, 20037508.342789244,
  20037508.342789244,
]);

var map = new Map({
  target: "map",
  layers: [
    new GoogleLayer({
      title: "Google Streets", // the default
      type: "base", // osnovna prijekcija
      numZoomLevels: 20,
    }),
    new GoogleLayer({
      title: "Google Hybrid",
      type: "base", // prikaze layer u Geoserveru
      mapTypeId: google.maps.MapTypeId.HYBRID,
    }),
    new GoogleLayer({
      title: "Google Satellite",
      type: "base",
      mapTypeId: google.maps.MapTypeId.SATELLITE,
    }),
    new LayerTile({
      title: "Yandex",
      type: "base",
      visible: true,
      source: new XYZ({
        url: "https://sat0{1-4}.maps.yandex.net/tiles?l=sat&x={x}&y={y}&z={z}",
        projection: "EPSG:3395", //ovde sam primenio projekciju koju Yandex podrzava
        //attributions: '',
      }),
    }),
    new LayerTile({
      title: "OpenStreetMap",
      type: "base",
      visible: true,
      source: new SourceOSM(),
    }),

    new LayerGroup({
      title: "Overlays",
      layers: [
        new LayerTile({
          title: "Cenej",
          transparent: true,
          className: "cenej",
          source: new TileWMS({
            url: "http://localhost:8082/geoserver/wms",
            params: { LAYERS: "cite:G_POLYGON", TILED: true },
            serverType: "geoserver",
          }),
        }),
        new LayerTile({
          title: "Drzava",
          source: new TileWMS({
            url: "http://localhost:8082/geoserver/wms",
            params: { LAYERS: "cite:drzava", TILED: true },
            serverType: "geoserver",
            transition: 0,
          }),
        }),
        new LayerTile({
          title: "Jezera",
          source: new TileWMS({
            url: "http://localhost:8082/geoserver/wms",
            params: { LAYERS: "cite:eco_os_jezero", TILED: true },
            serverType: "geoserver",
            transition: 0,
          }),
        }),
        new LayerTile({
          title: "Pruga",
          source: new TileWMS({
            url: "http://localhost:8082/geoserver/wms",
            params: { LAYERS: "cite:eco_os_pruga1", TILED: true },
            serverType: "geoserver",
            transition: 0,
          }),
        }),
        new LayerTile({
          title: "Zgrade",
          source: new TileWMS({
            url: "http://localhost:8082/geoserver/wms",
            params: { LAYERS: "cite:objekti_poligon", TILED: true },
            serverType: "geoserver",
            transition: 0,
          }),
        }),
      ],
    }),
  ],

  view: new View({
    center: [2281953.166686316, 5591123.972427968],
    zoom: 7,
  }),
});

map.on("click", function (e) {
  console.log(e);
});

var olGM = new OLGoogleMaps({ map: map });
olGM.activate();

var layerSwitcher = new LayerSwitcher(); //kontrola koja omogucava promenjivu vidljivost layera
map.addControl(layerSwitcher);
