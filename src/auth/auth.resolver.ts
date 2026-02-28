import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login-input-dto';
import { LoginResponse } from './dto/login-response';
import { GqlAuthGuard } from './gql-auth.guard';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => LoginResponse)
  async signIn(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<LoginResponse> {
    return this.authService.signIn(loginInput.email, loginInput.password);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async profile(@Context() context): Promise<User> {
    return this.userService.findOneById(context.req.user.sub);
  }
}
