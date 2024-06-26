export enum ErrorMessage {
  InvalidCredentials = "InvalidCredentials",
  UserAlreadyExists = "UserAlreadyExists",
  SecretsNotFound = "SecretsNotFound",
  OAuthUser = "OAuthUser",
  InvalidResetToken = "InvalidResetToken",
  InvalidVerificationToken = "InvalidVerificationToken",
  EmailAlreadyVerified = "EmailAlreadyVerified",
  TwoFactorNotEnabled = "TwoFactorNotEnabled",
  TwoFactorAlreadyEnabled = "TwoFactorAlreadyEnabled",
  InvalidTwoFactorCode = "InvalidTwoFactorCode",
  InvalidTwoFactorBackupCode = "InvalidTwoFactorBackupCode",
  InvalidBrowserConnection = "InvalidBrowserConnection",
  SlugAlreadyExists = "SlugAlreadyExists",
  NotFound = "NotFound",
  SomethingWentWrong = "SomethingWentWrong",

  // Organization
  OrganizationSlugAlreadyExists = "OrganizationSlugAlreadyExists",
  OrganizationNotFound = "OrganizationNotFound",
}
