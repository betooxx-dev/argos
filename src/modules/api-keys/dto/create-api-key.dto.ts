import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateApiKeyDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9][a-zA-Z0-9 _:\-\.]*$/, {
    message:
      'name must start with a letter or number and contain only letters, numbers, spaces, underscores, dashes, dots or colons',
  })
  name: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @Matches(/^[a-z0-9]+(?::[a-z0-9]+)+$/, {
    each: true,
    message: 'each scope must follow the "namespace:action" format',
  })
  scopes?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  expiresInDays?: number;
}
