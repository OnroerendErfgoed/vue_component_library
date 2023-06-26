export abstract class Serializable<IType> {
  public abstract serialize(): IType;

  public toJSON(): IType {
    return this.serialize();
  }
}
