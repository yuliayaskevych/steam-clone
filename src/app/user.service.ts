import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, tap } from 'rxjs/operators';
import { User, Users, Game, Games } from './models';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFireDatabase,

  ) { }

  public login(email: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      this.auth.signInWithEmailAndPassword(email, password)
        .then(res => resolve(res), err => reject(err));
    })
  }

  private read(path: string) {
    return this.db.object(path).valueChanges();
  }

  private readGames(path: string) {
    return this.read(path).pipe(
      map((res) => res as Games),
      map((res) => Object.values(res))
    )
  }

  public readAllGames() {
    return this.readGames('games')
  }

  public readGamesFromLibrary(uid: string){
    return this.readGames(`users/${uid}/games`);
  }

  public readUser(uid: string) {
    return this.read(`users/${uid}`).pipe(map((r) => r as User))
  }

  public readFriends(uid: string) {
    return this.read(`users/${uid}/friends`)
      .pipe(
        map((res) => {
          const data = res as { [key: string]: string };
          if (data) {
            return Object.keys(data).map((key: string) => ({ username: data[key], id: key }))
          }
          return data;
        })
      )
  }

  public update(path: string, data: {}) {
    this.db.database.ref(path).update(data)
      .then(() => { alert('update successful') })
      .catch(err => { alert(err.message); })
  }

  public delete(path: string) {
    return this.db.object(path)
      // return this.db.database.ref(path)
      .remove()
      .then(() => alert('delete successful'))
      .catch((err) => alert(err.message))
  }

  public push(path: string, data: any) {
    this.db.database.ref(path).push(data)
      .then(() => alert("add data"))
      .catch(err => alert(err.message));
  }

  public searchUser(uid: string, search: string) {
    let friendExist: string[] = [];
    return this.read('users').pipe(
      map((r) => r as Users),
      tap((r: Users) => {
        friendExist.push(r[uid].username);
        if (r[uid].friends) {
          friendExist = [...Object.values(r[uid].friends), r[uid].username]
        }
      }),
      map(users => Object.values(users)
        .map(user => user.username)
        .filter(user => user.includes(search))
        .filter(user => !friendExist.includes(user))
      ),
    )
  }

  public addGameInLibrary(uid: string, game: Game) {
    this.db.object(`users/${uid}/games/${game.name}`)
      .set(game)
      .then(() => alert(`add ${game.name} game`))
      .catch(err => alert(err.message));
  }

}
