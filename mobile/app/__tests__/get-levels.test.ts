// ✅ Chemins corrigés vers src/infrastructure/repositories/*
jest.mock("../../src/infrastructure/repositories/LevelRepository", () => ({
  levelRepository: {
    getLevelsByWorld: jest.fn().mockReturnValue([]),
  },
}));

jest.mock("../../src/infrastructure/repositories/ProgressRepository", () => ({
  ProgressRepository: {
    get: jest.fn().mockResolvedValue({ completedLevels: {} }),
  },
}));

import { GetLevels } from "../../src/application/level/GetLevels";

describe("GetLevels", () => {
  it("should be defined", () => {
    // Assert
    expect(GetLevels).toBeDefined();
  });
});