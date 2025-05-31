---
sidebar_position: 2
---

# Global Error Handling in .NET

In any web application, **global error handling** is essential to catch unhandled exceptions, return meaningful responses, and log errors effectively.

In ASP.NET Core, this is best achieved using **custom middleware**.

## 🧠 Why Global Error Handling?

- Centralized exception logging
- Consistent error response structure (e.g., JSON error object)
- Avoid revealing sensitive internal errors
- Improve debugging and observability

---

## ✅ Approaches to Implement Global Error Handling

### 1. With Request Delegates (Inline Middleware)

Simple and quick, ideal for small apps.

```csharp
app.Use(async (context, next) =>
{
    try
    {
        await next.Invoke();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Unhandled error: {ex.Message}");
        context.Response.StatusCode = 500;
        await context.Response.WriteAsync("An error occurred.");
    }
});
```

### 2. By Convention (Custom Middleware Class)

More reusable and testable than inline code.

#### Step 1: Create Middleware Class

```csharp
public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);

            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            ProblemDetails problem = new()
            {
                Title = "An error occurred while processing your request.",
                Status = (int)HttpStatusCode.InternalServerError,
                Detail = "An internal server error has occured",
                Instance = context.Request.Path,
                Type = "Server error"
            };

            var json = JsonSerializer.Serialize(problem);

            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(json);
        }
    }
}
```

#### Step 2: Register in Pipeline

```csharp
app.UseMiddleware<ErrorHandlingMiddleware>();
```

### 3. Factory-Based Middleware (Implementing IMiddleware) ✅ Recommended

This is the cleanest and most DI-friendly way to create reusable error-handling middleware.

#### Step 1: Create Middleware Class

```csharp
public class ExceptionHandlingMiddleware : IMiddleware
{
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(ILogger<ExceptionHandlingMiddleware> logger) => _logger = logger;

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);

            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            ProblemDetails problem = new()
            {
                Title = "An error occurred while processing your request.",
                Status = (int)HttpStatusCode.InternalServerError,
                Detail = "An internal server error has occured",
                Instance = context.Request.Path,
                Type = "Server error"
            };

            var json = JsonSerializer.Serialize(problem);

            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(json);
        }
    }
}
```

#### Step 2: Register in DI Container

```csharp
builder.Services.AddTransient<ExceptionHandlingMiddleware>();
```

#### Step 3: Use in Middleware Pipeline

```csharp
app.UseMiddleware<ExceptionHandlingMiddleware>();
```
