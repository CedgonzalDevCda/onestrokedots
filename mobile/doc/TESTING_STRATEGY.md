# 🧪 Testing Strategy

## 🎯 Objective

Ensure the reliability, correctness, and scalability of the puzzle game by testing:
- Core gameplay logic (engine)
- Level generation
- Application use cases
- UI integration (light)

---

## 🧠 Testing Philosophy

- Core must be **fully deterministic and testable in isolation**
- UI should be **thin and minimally tested**
- Prefer **pure functions and state machines**
- Focus on **gameplay correctness over UI coverage**

---

## 🧩 Test Layers

### 1. ✅ Core Engine (HIGH PRIORITY)

**Scope:**
- CollisionEngine
- GameEngine (future stateful)
- PathEngine
- Validator

**Goals:**
- Deterministic behavior
- No React dependency
- Full gameplay validation

**Tests:**
- Segment → point collision
- Path validity (no illegal intersections)
- Visit count correctness
- Edge cases (fast movement, overlapping points)

---

### 2. 🎮 Gameplay Rules

**Source of truth:**
- core-engine-rules.MD

**Tests:**
- No self-intersection outside circles
- Exact visit count per point
- Star collection rules
- Invalid move → reset

**Strategy:**
- Convert rules into unit tests
- One test per rule

---

### 3. 🧬 Level Generation

**Modules:**
- GraphGenerator
- PathBuilder
- SolverValidator
- ValueAssigner
- LevelGenerator

**Tests:**
- Generated graph validity
- Path length correctness
- No invalid edges in solution
- Values match solution
- Level always solvable

**Advanced:**
- Property-based testing (random seeds)
- Retry mechanism reliability

---

### 4. 📦 Application Layer

**Modules:**
- GetLevels
- CompleteLevel

**Tests:**
- Correct level retrieval
- Progression updates
- Completion triggers

---

### 5. 🧪 Integration Tests

**Scope:**
- useGame hook (temporary engine)

**Tests:**
- Full game loop:
  - start → move → end
- State transitions
- Reset behavior

---

### 6. 🖥 UI / Routing

**Existing:**
- smoke.test.ts
- _layout.test.tsx

**Tests:**
- Navigation works
- Screens render without crash

**Note:**
UI testing is minimal by design

---

## ⚠️ Current Gaps

- GameEngine not fully tested (not source of truth)
- Gameplay logic split between UI and core
- No tests for star logic in core
- No deterministic seed for generation
- No end-to-end gameplay validation

---

## 🚀 Target Testing Architecture

### ✅ Core-first approach

- GameEngine becomes:
  - Stateful
  - Fully tested
  - Independent from React

### ✅ useGame becomes adapter

- Only tested for:
  - input/output mapping
  - event forwarding

---

## 🧰 Tools & Practices

- Jest (unit + integration)
- Deterministic inputs (no Math.random without seed)
- Snapshot tests for levels (optional)
- Test data builders for levels

---

## 📌 Best Practices

- One rule = one test
- No logic in UI
- Prefer small pure functions
- Avoid hidden side effects
- Keep tests readable (gameplay > implementation)

---

## ✅ Example Test Cases

- Draw valid path → success
- Draw invalid intersection → fail
- Miss one visit → fail
- Extra visit → fail
- Collect all stars → success condition met

---

## 🧭 Evolution Plan

1. Extract logic from useGame → GameEngine
2. Add full GameEngine test suite
3. Introduce seed-based generation
4. Add solver for validation
5. Add difficulty-based test scenarios

---

## 🏁 Conclusion

The long-term stability of the game depends on:
- A **fully tested core engine**
- A **clear separation between UI and logic**
- A **deterministic generation pipeline**

Focus testing efforts on the core — everything else becomes easier.