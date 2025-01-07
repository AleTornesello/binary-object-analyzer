export class Sequence {
  public address: number;
  public name: string;
  public color?: string;

  constructor(address: number, name: string, color?: string) {
    this.address = address;
    this.name = name;
    this.color = color;
  }
}
