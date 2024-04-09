import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AppVersion } from './app_version.entity';

/**
 * 资源
 */
@Entity({ name: 'resources' })
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, default: null })
  pid: string | null;

  @Column()
  type: 'apiFolder' | 'api' | 'schemaFolder' | 'schema';

  @Column()
  name: string;

  @Column({ default: 0 })
  index: number;

  @Column({ default: false })
  disabled: boolean;

  @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'app_version_id' })
  appVersionId: string;

  @ManyToOne(() => AppVersion, (appVersion) => appVersion.pages)
  @JoinColumn({ name: 'app_version_id' })
  appVersion: AppVersion;
}
