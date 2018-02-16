import {Pipe, PipeTransform} from '@angular/core';

/**
 * Generated class for the ThumbnailPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'thumbnail',
})
export class ThumbnailPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    let size: string;
    const temp = value.split('.');
    switch (args[0]) {
      case 'small':
        size = '160';
        break;
      case 'medium':
        size = '320';
        break;
      case 'large':
        size = '640';
        break;
    }
    return temp[0] + '-tn' + size + '.png';

  }
}
