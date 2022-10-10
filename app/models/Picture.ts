export class Picture
{
  private id: number = -1;
  private name: string ="";
  private picAlt: number = -1;

  constructor(id:number, name:string, picAlt:number)
  {
    this.id = id;
    this.name = name;
    this.picAlt = picAlt;
  }

  get Id():number
  {
    return this.id
  }

  set Id(id:number)
  {
    this.id = id;
  }

  get Name():string
  {
    return this.name;
  }
  set Name(Name:string)
  {
    this.name = this.name;
  }

  get PicAlt():number
  {
    return this.picAlt;
  }
  set PicAlt(picAlt:number)
  {
    this.picAlt = picAlt;
  }
}
