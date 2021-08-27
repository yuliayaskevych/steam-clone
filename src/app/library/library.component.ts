import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Game } from '../models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  public games: Game[];
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const uid = this.route.snapshot.root.children[0].params.uid;
    this.userService.readGamesFromLibrary(uid).subscribe(r => this.games = r);
  }

  public download(name: string) {
    alert(`Wait a minute, the game ${name} is installed on your computer`)
  }

  public share(name: string) {
    alert(`You shared the game ${name}`)
  }
}
