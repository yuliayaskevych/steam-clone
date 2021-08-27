import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Game } from '../models';
import { UserService } from '../user.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  public gamesForm: FormGroup;
  private allGames: Game[];
  public games: Game[];
  public max = 13
  private rate = 100;


  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.userService.readAllGames().subscribe(r => {
      this.allGames = r;
      this.games = [...this.allGames]
    });
  }

  private initForm() {
    this.gamesForm = this.formBuilder.group({
      searchGames: new FormControl('', [Validators.required]),
      casual: new FormControl(true),
      strategy: new FormControl(true),
      adventure: new FormControl(true),
      range: new FormControl(this.max),
    })
  }

  public addFilter() {
    const price = this.gamesForm.value.range * this.rate;
    this.games = this.allGames.filter(game => this.gamesForm.value[game.genre]);
    if (this.gamesForm.value.range !== this.max) {
      this.games = this.games.filter(game => game.price <= price);
    }
    this.games = this.games.filter(game => game.name.includes(this.gamesForm.value.searchGames))
  }

  public addGame(name: string) {
    const addGame = this.games.find(game => game.name === name);
    const uid = this.route.snapshot.root.children[0].params.uid;
    if (addGame) {
      this.userService.addGameInLibrary(uid, addGame);
    }
  }

}
