export class User {
  private readonly name: string;
  private readonly age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  public say() {
    return this.name;
  }

  static go() {

  }
}
