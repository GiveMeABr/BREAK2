import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
} from '@ionic-native/google-maps';

/*
  Generated class for the MapProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapProvider {
  map: GoogleMap;

  constructor(public http: HttpClient) {
    console.log('Hello MapProvider Provider');
  }

  loadMap(elementId, latLon) {

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: latLon,
        zoom: 15,
        tilt: 0,
      },
    };

    console.log(mapOptions);

    this.map = GoogleMaps.create(elementId, mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      console.log('Map is ready!');

      // Now you can use all methods safely.
      this.map.addMarker({
        title: 'Ionic',
        icon: 'blue',
        animation: 'DROP',
        position: latLon,
      }).then(marker => {
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          alert('clicked');
        });
      });

    });
  }

}
