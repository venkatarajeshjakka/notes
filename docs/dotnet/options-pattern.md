---
sidebar_position: 3
---

# Options Pattern in .NET

The **Options Pattern** in .NET allows you to bind configuration data from sources like `appsettings.json` into strongly typed objects. To customize how those objects are configured, .NET provides two powerful interfaces:

- `IConfigureOptions<TOptions>`
- `IConfigureNamedOptions<TOptions>`

---

## ✅ `IConfigureOptions<TOptions>`

### 📌 Purpose

`IConfigureOptions<T>` is used to configure **unnamed** or default options. It modifies the default instance of a configuration object.

### 📦 Interface Definition

```csharp
public interface IConfigureOptions<in TOptions>
{
    void Configure(TOptions options);
}
```

### 🧠 When to Use

Use when:

You only have one configuration instance of a given options class.

You don't need to support multiple named options.

### 💡 Example

```csharp
public class JwtOptionsSetup : IConfigureOptions<JwtOptions>
{
    private readonly IConfiguration _configuration;

    public JwtOptionsSetup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void Configure(JwtOptions options)
    {
        _configuration.GetSection("Jwt").Bind(options);
    }
}
```

Then register it in `Program.cs`:

```csharp

builder.Services.ConfigureOptions<JwtOptionsSetup>();

```

## ✅ `IConfigureNamedOptions<TOptions>`

### 📌 Purpose

`IConfigureNamedOptions<T>` is used to configure named options — useful when you have multiple configurations of the same options type.

### 📦 Interface Definition

```csharp
public interface IConfigureNamedOptions<in TOptions>
{
    void Configure(string name, TOptions options);
}
```

### 🧠 When to Use

Use when:

You want to configure multiple named instances of the same options class.

You work with components like authentication schemes that support naming.

### 💡 Example: JWT Bearer Schemes

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

Register in `Program.cs`:

```csharp
builder.Services.ConfigureOptions<JwtBearerOptionSetup>();
```
