# 🧪 Testing Strategy — React Native + Expo (Clean Architecture)

## 🎯 Objective

This document defines a **clear and scalable testing strategy** for a mobile game built with:

- React Native
- Expo
- Clean Architecture

The goal is to ensure:
- ✅ Reliability of game logic
- ✅ Maintainability over time
- ✅ Fast and useful test feedback

---

## 🧠 Core Principle

We test **by architectural layer**, from the most critical logic to the most external parts:

```
UI (Screens)
↓
Use Cases (Business Logic)
↓
Domain (Entities & Rules)
↓
Infrastructure (API, Storage)
```

> The deeper the layer, the more tests you should write.

---

## 🏗️ Test Pyramid

### ✅ 70% — Unit Tests
Focus on:
- Domain logic
- Use cases
- Game mechanics

### ✅ 20% — Integration Tests
Focus on:
- Interaction between layers
- Use case + repository
- UI + state

### ✅ 10% — E2E Tests (optional)
Focus on:
- Full user flows

---

## 🧱 What to Test

### 🎮 Domain Layer (HIGH PRIORITY)

Pure logic, no dependencies.

Test:
- Game rules
- Score calculations
- Player progression
- Validations

✅ No mocks  
✅ Fast and deterministic  

---

### ⚙️ Use Cases (CORE LOGIC)

Encapsulates application behavior.

Test:
- Business flows (e.g., play turn, unlock reward)
- Data transformations

Use mocks for dependencies (repositories).

✅ Focus on behavior  
✅ No UI / network  

---

### 🌐 Infrastructure Layer

Handles external systems:
- API calls
- AsyncStorage
- Firebase

Test:
- Data fetching/parsing
- Storage behavior

✅ Mock external systems  
✅ Avoid real network calls  

---

### 📱 UI Layer (React Native)

Use:
- @testing-library/react-native

Test:
- User-visible behavior
- Rendering of key elements
- Interaction (press, input)

❌ Avoid testing styles or implementation details  
✅ Focus on what the user sees  

---

## 🎯 Game-Specific Testing

Critical areas to cover:

- ✅ Player progression system
- ✅ Save / load system
- ✅ Economy (coins, rewards)
- ✅ Randomness (mock randomness)

Example:
- Mock Math.random to ensure deterministic tests

---

## 🧰 Mocking Strategy

Keep it simple:

✅ Mock:
- Repositories
- APIs
- Storage
- Navigation (lightly)

❌ Avoid:
- Over-mocking
- Mocking React Native internals

---

## 🗂️ Recommended Structure

```
src/
  domain/
    __tests__/
  usecases/
    __tests__/
  infrastructure/
    __tests__/
  presentation/
    __tests__/
```

---

## 🚀 Best Practices

### ✅ Test behavior, not implementation

Good:
- Check outputs
- Check user-visible results

Bad:
- Checking internal function calls unnecessarily

---

### ✅ Keep tests simple

- One responsibility per test
- Clear naming
- Minimal setup

---

### ✅ Deterministic tests

- No randomness
- No real network
- No timing issues

---

## 📌 Recommended Order (for implementation)

1. ✅ Use cases
2. ✅ Domain logic
3. ✅ UI (critical screens)
4. ✅ Infrastructure (if needed)
5. ✅ E2E (later)

---

## 💥 Summary

- Test your **game logic heavily**
- Keep UI tests focused and light
- Mock external dependencies
- Avoid complexity
- Build confidence incrementally

---

A solid testing strategy ensures your game remains stable, scalable, and easy to evolve 🚀
