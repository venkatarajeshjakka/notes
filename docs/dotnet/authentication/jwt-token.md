---
sidebar_position: 1
---

# 🔐 Generate JWT Token in ASP.NET Core

This document outlines how to generate and validate JSON Web Tokens (JWT) using ASP.NET Core. It covers the implementation of the token provider, configuration of token validation, and integration with the authentication middleware.

---

## ✅ Prerequisites

Before proceeding, ensure that your project has the following NuGet packages installed:

```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
```

Also, make sure you have a `JwtOptions` class defined with `Issuer`, `Audience`, and `Secret` properties configured in your `appsettings.json`.

## JwtProvider Class

This class is responsible for generating JWT tokens using user-specific claims

```csharp
public sealed class JwtProvider : IJwtProvider
{
    private readonly JwtOptions _jwtOptions;
    public JwtProvider(IOptions<JwtOptions> jwtOptions) => _jwtOptions = jwtOptions.Value;

    public string GenerateToken(string email)
    {
        var claims = new Claim[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, email),
            new Claim(JwtRegisteredClaimNames.Email, email),
        };

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Secret));
        var signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtOptions.Issuer,
            audience: _jwtOptions.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: signingCredentials
        );

        string tokenValue = new JwtSecurityTokenHandler().WriteToken(token);

        return tokenValue;
    }
}
```

## Configure JWT Bearer Authentication

This class sets up the token validation parameters used by the JWT middleware.

```csharp
public class JwtBearerOptionSetup : IConfigureNamedOptions<JwtBearerOptions>
{
    private readonly JwtOptions _options;
    public JwtBearerOptionSetup(IOptions<JwtOptions> options)
    {
        _options = options.Value;
    }
    public void Configure(string? name, JwtBearerOptions options) => Configure(options);

    public void Configure(JwtBearerOptions options)
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = _options.Issuer,
            ValidAudience = _options.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Secret)),
        };
    }
}
```

## Register Services in Program.cs

Add JWT bearer authentication and authorization services in your application startup configuration.

```csharp
builder.Services.ConfigureOptions<JwtBearerOptionSetup>();

builder.Services.AddAuthentication(o =>
    {
        o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    }).AddJwtBearer();

builder.Services.AddAuthorization();
```

## Use Authentication and Authorization Middleware

Ensure you add the following middleware to enable authentication and authorization in your pipeline.

```csharp
app.UseAuthentication();

app.UseAuthorization();
```

## Sample JwtOptions Configuration

Add the following to your `appsettings.json`:

```json
"Jwt": {
  "Issuer": "your-app-name",
  "Audience": "your-app-users",
  "Secret": "your-very-long-secret-key-for-hmac"
}
```
