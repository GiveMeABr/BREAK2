import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable, ViewChild} from '@angular/core';
import {User} from "../../app/interfaces/user";

/*
  Generated class for the MediaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MediaProvider {
  @ViewChild('myNav') nav;

  logged = false;

  userInfo: User;

  username: string;
  password: string;
  email: string;
  full_name?: string;

  available: boolean;

  apiUrl = 'http://media.mw.metropolia.fi/wbma';
  mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

  constructor(private http: HttpClient) {
  }

  login(user) {
    const settings = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    };

    return this.http.post(this.apiUrl + '/login', user, settings);
  }

  register(user) {
    return this.http.post(this.apiUrl + '/users', user);
  }

  getUserData(token) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', token),
    };
    return this.http.get(this.apiUrl + '/users/user', settings);
  }

  getUserDataViaId(token, userId) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', token),

    };
    return this.http.get(this.apiUrl + '/users/' + userId, settings);
  }

  upload(formData, token) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', token),
    };
    return this.http.post(this.apiUrl + '/media', formData, settings);
  }

  postFavorite(token, file_id) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', token)
                                //.set('Content-Type', "application/x-www-form-urlencoded")
    };
    return this.http.post(this.apiUrl + '/favourites', file_id, settings);
  }

  deleteMedia(token, id){
    const settings = {
      headers: new HttpHeaders().set('x-access-token', token)
    };
    return this.http.delete(this.apiUrl + '/media/' + id, settings);
  }

  getAllMedia() {
    return this.http.get(this.apiUrl + '/tags/break2');
  }

  getMoreMedia(fromIndex: any) {
    return this.http.get<Array<string>>(this.apiUrl + '/media', {
      params: {
        start: fromIndex,
        limit: '20'
      }
    });

  }

  getSingleMedia(id) {
    return this.http.get<Array<string>>(this.apiUrl + '/media/' + id);
  }

  postTag(tagAndId, token) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', token),
    };

    let result = this.http.post(this.apiUrl + '/tags', tagAndId, settings);
    return result;
  }

  getTagByFile(id) {
    return this.http.get<Array<object>>(this.apiUrl + '/tags/file/' + id);
  }

  userHasToken() {
    return localStorage.getItem('token');
  }

  checkUserName(username: string){
    return this.http.get(this.apiUrl + '/users/username/' + username);
  }


}
