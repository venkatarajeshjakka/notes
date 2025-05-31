---
sidebar_position: 1
---

# Smart Enum in C#: `Enumeration<TEnum>`

Traditional C# enums have limitations — no behavior, no extensibility, and no metadata. `Enumeration<TEnum>` is a powerful, extensible **smart enum base class** that allows you to encapsulate enum values with rich behavior and metadata using object-oriented principles.

---

## ✅ Key Features

- Type-safe enum alternatives
- Extensible with custom behavior
- Provides `FromValue` and `FromName` utilities
- Implements `IEquatable` for proper value comparison
- Automatically discovers derived static instances via reflection

---

## 🧱 Base Class Definition

Here's the generic abstract base class:

```csharp
public abstract class Enumeration<TEnum> : IEquatable<Enumeration<TEnum>>
    where TEnum : Enumeration<TEnum>
{
    private static readonly Dictionary<int, TEnum> Enumerations = CreateEnumerations();

    protected Enumeration(int value, string name)
    {
        Value = value;
        Name = name;
    }

    public int Value { get; protected init; }
    public string Name { get; protected init; } = string.Empty;

    public static TEnum? FromValue(int value)
    {
        return Enumerations.TryGetValue(value, out TEnum? enumeration) ? enumeration : default;
    }

    public static TEnum? FromName(string name)
    {
        return Enumerations.Values.SingleOrDefault(e => e.Name == name);
    }

    public bool Equals(Enumeration<TEnum>? other)
    {
        if (other is null) return false;
        return GetType() == other.GetType() && Value == other.Value;
    }

    public override bool Equals(object? obj)
    {
        return obj is Enumeration<TEnum> other && Equals(other);
    }

    public override int GetHashCode() => Value.GetHashCode();

    public override string ToString() => Name;

    private static Dictionary<int, TEnum> CreateEnumerations()
    {
        var enumerationType = typeof(TEnum);

        var fields = enumerationType
            .GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy)
            .Where(field => enumerationType.IsAssignableFrom(field.FieldType))
            .Select(field => (TEnum)field.GetValue(default)!);

        return fields.ToDictionary(e => e.Value);
    }
}
```

## Example: Creating a Smart Enum

Let's create a smart enum for `OrderStatus`:

```csharp
public sealed class OrderStatus : Enumeration<OrderStatus>
{
    public static readonly OrderStatus Pending = new(1, "Pending");
    public static readonly OrderStatus Shipped = new(2, "Shipped");
    public static readonly OrderStatus Delivered = new(3, "Delivered");

    private OrderStatus(int value, string name) : base(value, name) { }
}

```

## Usage Examples

### Get enum from value

```csharp
var status = OrderStatus.FromValue(2);
Console.WriteLine(status); // Output: Shipped
```

### Get enum from name

```csharp
var status = OrderStatus.FromName("Delivered");
Console.WriteLine(status?.Value); // Output: 3

```
