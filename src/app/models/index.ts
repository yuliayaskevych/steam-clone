export interface User {
    email: string;
    username: string;
    age: number;
    friends: string[];
  }
  
  export interface Users {
    [key: string]: User
  }

  export interface Game {
    name: string;
    genre: string;
    about: string;
    price: number;
  }

  export interface Games {
    [key: string]: Game
  }