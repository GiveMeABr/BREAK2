import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable, ViewChild} from '@angular/core';
import {User} from "../../app/interfaces/user";

/*
  0. TOKEN
  1. LOGIN
  2. USER
  3. MEDIA
  4. COMMENT
  5. FAVOURITE
  6. TAG
*/
@Injectable()
export class MediaProvider {
  @ViewChild('myNav') nav;

  userId: number;

  logged = false;
  userInfo: User;
  username: string;
  password: string;
  email: string;
  full_name?: string;
  comment: string;
  available: boolean;
  apiUrl = 'http://media.mw.metropolia.fi/wbma';
  mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

  constructor(private http: HttpClient) {
  }

  // 0. TOKEN --------------------------------------------------------------

  userHasToken() {
    return localStorage.getItem('token');
  }

  // 1. LOGIN --------------------------------------------------------------

  login(user) {
    const settings = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    };

    return this.http.post(this.apiUrl + '/login', user, settings);
  }

  register(user) {
    return this.http.post(this.apiUrl + '/users', user);
  }

  // 2. USER --------------------------------------------------------------

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

  checkUserName(username: string) {
    return this.http.get(this.apiUrl + '/users/username/' + username);
  }

  getUserId(id){
    this.userId = id;
  }

  // 3. MEDIA --------------------------------------------------------------

  upload(formData, token) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', token),
    };
    return this.http.post(this.apiUrl + '/media', formData, settings);
  }

  deleteMedia(token, id) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', token)
    };
    return this.http.delete(this.apiUrl + '/media/' + id, settings);
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

  // 4. COMMENT --------------------------------------------------------------

  postComment(token, commentData) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', token)
      //.set('Content-Type', "application/x-www-form-urlencoded")
    };
    return this.http.post(this.apiUrl + '/comments', commentData, settings)
  }

  getCommentsFile(fileId: number) {
    return this.http.get(this.apiUrl + '/comments/file/' + fileId);
  }

  // 5. FAVOURITE --------------------------------------------------------------

  postFavorite(token, file_id) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', token)
      //.set('Content-Type', "application/x-www-form-urlencoded")
    };
    return this.http.post(this.apiUrl + '/favourites', file_id, settings);
  }

  getListOfLikes(fileId: number) {
    return this.http.get(this.apiUrl + '/favourites/file/' + fileId);
  }

  // 6. TAG --------------------------------------------------------------

  getAllMedia() {
    return this.http.get(this.apiUrl + '/tags/break2');
  }

  getAllProfilePics() {
    return this.http.get(this.apiUrl + '/tags/break2PP');
  }

  postTag(tagAndId, token) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', token),
    };

    let result = this.http.post(this.apiUrl + '/tags', tagAndId, settings);
    return result;
  }

  postUserId(id, token) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', token),
    };

    let result = this.http.post(this.apiUrl + '/tags', id, settings);
    return result;
  }

  getTagByFile(id) {
    return this.http.get<Array<object>>(this.apiUrl + '/tags/file/' + id);
  }

}
