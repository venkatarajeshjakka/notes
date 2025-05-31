---
sidebar_position: 1
---

# Middleware in .NET

**Middleware** in .NET is software that's assembled into an application pipeline to handle requests and responses. Each component in the pipeline can:

- Handle the request directly.
- Pass it to the next middleware.
- Perform operations before or after the next component.

Middleware allows us to introduce additional logic **before or after executing an HTTP request**.

## 📌 What Middleware Can Do

- Logging
- Authentication & Authorization
- Exception handling
- Request/Response modification
- Routing
- Caching

## 🧱 Middleware Structure

A middleware component typically:

1. Takes an `HttpContext`.
2. Performs some logic.
3. Calls the next middleware in the pipeline.

## Three Approaches to Define Custom Middleware

### 1. With Request Delegates (Inline Middleware)

```csharp
app.Use(async (context, next) =>
{
    Console.WriteLine("Before Request");
    await next.Invoke(); // Call the next middleware
    Console.WriteLine("After Request");
});
```

### 2. By Convention (Custom Middleware Class)

Create a reusable middleware class.

#### Step 1: Create Middleware

```csharp
public class MyCustomMiddleware
{
    private readonly RequestDelegate _next;

    public MyCustomMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        Console.WriteLine("Custom Middleware: Before");
        await _next(context);
        Console.WriteLine("Custom Middleware: After");
    }
}
```

#### Step 2: Register Middleware

```csharp
app.UseMiddleware<MyCustomMiddleware>();
```

### 3. Factory-Based Middleware (Using `IMiddleware`)

This approach involves implementing the `IMiddleware` interface. It allows .NET to manage the middleware's lifetime and dependencies through **dependency injection**.

#### ✅ Benefits of Using `IMiddleware`

- Better separation of concerns
- Easier to test
- Automatically resolves dependencies via DI container

---

#### Step 1: Create Middleware Class Implementing `IMiddleware`

```csharp
public class LoggingMiddleware : IMiddleware
{
    private readonly ILogger<LoggingMiddleware> _logger;

    public LoggingMiddleware(ILogger<LoggingMiddleware> logger)
    {
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        _logger.LogInformation("Handling request: {Path}", context.Request.Path);
        await next(context);
        _logger.LogInformation("Finished handling request.");
    }
}
```

#### Step 2: Register Middleware in Program.cs

You must register the middleware as a transient service:

```csharp
builder.Services.AddTransient<LoggingMiddleware>();
```

#### Step 3: Use Middleware in the Pipeline

```csharp
app.UseMiddleware<LoggingMiddleware>();
```

Example Summary

```csharp
// Program.cs

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddTransient<LoggingMiddleware>();

var app = builder.Build();
app.UseMiddleware<LoggingMiddleware>();

app.MapGet("/", () => "Hello, Factory-Based Middleware with IMiddleware!");
app.Run();
```
