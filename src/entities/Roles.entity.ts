import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RolesEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  guildId: string;

  @Column()
  channelId: string;

  @Column()
  roleId: string;

  @Column()
  alias: string;
}
