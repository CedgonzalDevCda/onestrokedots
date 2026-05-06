# 📦 Essential Files for a React Native + Expo Project (Clean Architecture)

This document lists the key files required to ensure:
- ✅ clear project understanding  
- ✅ high maintainability  
- ✅ consistent code quality  
- ✅ fast onboarding  

---

# 🧭 1. Main Documentation

## README.md  
👉 The most important file  

Includes:
- project description  
- tech stack (Expo, React Native, TypeScript…)  
- installation instructions  
- how to run the app  
- how to run tests  
- overall structure  

---

## TESTING_STRATEGY.md 
👉 your testing strategy  

Includes:
- testing pyramid  
- tools used (Jest, Testing Library)  
- conventions  
- examples  

---

## ARCHITECTURE.md  
👉 highly recommended for clean architecture  

Includes:
- explanation of layers (domain, use cases, infrastructure, UI)  
- dependency rules  
- simple diagram  

---

# ⚙️ 2. Project Configuration

## package.json  
- dependencies  
- scripts (`start`, `test`, etc.)  

## tsconfig.json  
- TypeScript configuration  
- path aliases (`@/...`)  

## babel.config.js  
- alias support  

## jest.config.js  
- Jest configuration (Expo preset, transforms…)  

## jest.setup.js  
- global setup (gesture handler, mocks…)  

---

# 📁 3. Code Structure

## src/  
Clear organization:

- domain/  
- application/ (use cases)  
- infrastructure/  
- presentation/  

👉 plus a `__tests__` folder inside each layer  

---

## app/ (Expo Router)  
- screens  
- navigation  

---

# 🧪 4. Test Files

## *.test.ts / *.test.tsx  
- unit tests  
- integration tests  

## mocks/  
- fake repositories  
- test data  

---

# 🧰 5. Environment & Code Quality

## .gitignore  
- node_modules  
- build files  
- sensitive files  

## .env (not committed)  
- API keys  
- configuration  

## .env.example  
👉 very important for sharing the project  

---

## eslint.config.js / .eslintrc  
- code quality rules  

## prettier.config.js  
- automatic formatting  

---

# 🚀 6. CI / Automation (optional but recommended)

## .github/workflows/  
- automated tests  
- linting  

---

# 🎮 7. Mobile Game Specific

## dev/  
- testing scripts (e.g. `testLevel.ts`)  

## assets/  
- images  
- SVGs  

---

# ✅ Summary

For a clean and shareable project:

**Required:**
- README.md  
- package.json  
- tsconfig.json  
- jest.config.js  

**Strongly recommended:**
- TESTING.md  
- ARCHITECTURE.md  
- .env.example  
- eslint + prettier  

---

👉 Goal: any developer should be able to understand and run your project in under 5 minutes.
