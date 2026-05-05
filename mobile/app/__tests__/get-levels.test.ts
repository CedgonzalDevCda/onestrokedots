jest.mock("../../src/data/repositories/LevelRepository", () => ({
  levelRepository: {
    getLevelsByWorld: jest.fn().mockReturnValue([]),
  },
}));

jest.mock("../../src/data/repositories/ProgressRepository", () => ({
  ProgressRepository: {
    get: jest.fn().mockResolvedValue({ completedLevels: {} }),
  },
}));

import { GetLevels } from "../../src/application/level/GetLevels";

test("GetLevels is defined", () => {
  expect(GetLevels).toBeDefined();
});
