import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('pedidos')
export class Pedidos extends BaseEntity
{
  @PrimaryGeneratedColumn()
  public id: number = 0;

  @Column()
  public situacao: number = 0;

  @Column()
  public nome: string ="";

  @Column()
  public cidade: string = "";

  @Column()
  public siglaUf: string = "";

  @Column()
  public formaPagamento: string = "";

  @Column()
  public prazoPagamento: string = "";

  @Column()
  public tipoFrete: string = "";

  @Column()
  public observacoes: string = "";
    //campos de pesquisa, campos calculados
  public qtItem: number=0;
  public valorTotal : number =0;
}
