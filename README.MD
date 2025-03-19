# useForm Hook for React

A simple and flexible React hook for managing forms with validation and dynamic field arrays.

## Installation

Install the package using npm or yarn:

```sh
npm install use-form-hook
```

or

```sh
yarn add use-form-hook
```

---

## Features

- ✅ Simple API for managing form state
- ✅ Built-in validation support
- ✅ Supports nested fields
- ✅ Handles dynamic field arrays
- ✅ Written in TypeScript

---

## Usage

### **Basic Form Example**

```tsx
import { useForm } from "use-form-hook";

const MyForm = () => {
  const { register, handleSubmit, errors } = useForm(
    { username: "", password: "" },
    {
      username: (val) => (val.length < 3 ? "Username must be at least 3 characters" : null),
      password: (val) => (val.length < 6 ? "Password must be at least 6 characters" : null),
    }
  );

  return (
    <form onSubmit={handleSubmit((values) => console.log(values))}>
      <input {...register("username")} />
      {errors.username && <p>{errors.username}</p>}

      <input type="password" {...register("password")} />
      {errors.password && <p>{errors.password}</p>}

      <button type="submit">Submit</button>
    </form>
  );
};
```

---

## **Dynamic Field Arrays**

The package includes `useFieldArray`, which allows dynamic management of array fields in forms.

### **Example: Managing a List of Items**

```tsx
import { useForm, useFieldArray } from "use-form-hook";

const DynamicForm = () => {
  const { register, handleSubmit, setValues, values } = useForm({ items: [] });
  const { add, remove } = useFieldArray("items", setValues);

  return (
    <form onSubmit={handleSubmit((values) => console.log(values))}>
      {values.items.map((_, index) => (
        <div key={index}>
          <input {...register(`items.${index}`)} placeholder="Enter item" />
          <button type="button" onClick={() => remove(index)}>Remove</button>
        </div>
      ))}

      <button type="button" onClick={() => add("")}>Add Item</button>
      <button type="submit">Submit</button>
    </form>
  );
};
```

---

## **API Reference**

### `useForm<T>(initialValues: T, validationRules?: ValidationRules<T>)`

#### **Returns:**
- `values`: The form state.
- `errors`: The form errors.
- `register(name: string)`: Returns input props for a field.
- `setValue(name: string, value: any)`: Manually set a field value.
- `watch(name: string)`: Watch a field value.
- `handleSubmit(callback: (values: T) => void)`: Handles form submission.
- `reset(newData?: T)`: Reset the form to initial or new values.

---

### `useFieldArray<T>(name: string, setValues: (cb: (prev: any) => any) => void)`

#### **Returns:**
- `add(newItem: T)`: Adds a new item to the array.
- `remove(index: number)`: Removes an item at a specific index.
- `append(newItem: T)`: Appends a new item to the array.

---

## **License**

This project is licensed under the MIT License.

