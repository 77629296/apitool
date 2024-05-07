import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ErrorMessage } from "@apitool/utils";
import { Profile, Strategy, StrategyOptions } from "passport-github2";

import { UserService } from "@/server/user/user.service";
import { AuthService } from "@/server/auth/auth.service";
import { UserDto } from "@apitool/dto";

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, "github") {
  constructor(
    readonly clientID: string,
    readonly clientSecret: string,
    readonly callbackURL: string,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({ clientID, clientSecret, callbackURL, scope: ["user:email"] } as StrategyOptions);
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err?: string | Error | null, user?: Express.User, info?: unknown) => void,
  ) {
    const { emails, photos, username, displayName } = profile;

    const email = emails?.[0].value ?? `${username}@github.com`;
    const picture = photos?.[0].value || null;

    let user: UserDto;

    if (!email || !username) throw new BadRequestException();

    try {
      const user =
        (await this.userService.findOneByIdentifier(email)) ||
        (await this.userService.findOneByIdentifier(username));

      if (!user) throw new UnauthorizedException();

      done(null, user);
    } catch (error) {
      try {
        user = await this.authService.signup({
          userProfile: {
            email,
            username: displayName,
            picture,
            locale: "en-US",
            provider: "github",
            emailVerified: true, // auto-verify emails
          },
          secrets: { create: {} }
        })
        done(null, user);
      } catch (error) {
        throw new BadRequestException(ErrorMessage.UserAlreadyExists);
      }
    }
  }
}
