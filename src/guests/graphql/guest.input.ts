import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, IsOptional } from 'class-validator';

@InputType({ description: 'Данные для создания гостя' })
export class CreateGuestInput {
  @Field({ description: 'Полное имя гостя' })
  @IsString()
  name: string;

  @Field({ description: 'Email гостя' })
  @IsEmail()
  email: string;

  @Field({ nullable: true, description: 'Номер телефона' })
  @IsOptional()
  @IsString()
  phone?: string;
}

@InputType({ description: 'Данные для обновления гостя' })
export class UpdateGuestInput {
  @Field({ nullable: true, description: 'Полное имя гостя' })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true, description: 'Email гостя' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true, description: 'Номер телефона' })
  @IsOptional()
  @IsString()
  phone?: string;
}
