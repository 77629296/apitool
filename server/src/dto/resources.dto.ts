import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateResourceDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  pid: string;

  @IsString()
  @IsNotEmpty()
  type: 'apiFolder' | 'api' | 'schemaFolder' | 'schema';

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  index: number;

  @IsBoolean()
  @IsOptional()
  disabled: boolean;
}

export class DeleteResourceDto {
  @IsUUID()
  @IsNotEmpty()
  resourceId: string;
}

export class UpdateResourceDto {
  resourceId: string;
  diff: CreateResourceDto[];
}
