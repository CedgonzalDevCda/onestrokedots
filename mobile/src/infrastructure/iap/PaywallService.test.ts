import { PaywallService } from "@/src/infrastructure/iap/PaywallService"
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui"

// ─────────────────────────────────────────────────────────────────────────────
// Mock Setup
// ─────────────────────────────────────────────────────────────────────────────

jest.mock("react-native-purchases-ui", () => ({
  __esModule: true,
  default: {
    presentPaywall: jest.fn(),
  },
  PAYWALL_RESULT: {
    NOT_PRESENTED: "NOT_PRESENTED",
    ERROR: "ERROR",
    CANCELLED: "CANCELLED",
    PURCHASED: "PURCHASED",
    RESTORED: "RESTORED",
  },
}))

const mockPresentPaywall = RevenueCatUI.presentPaywall as jest.MockedFunction<
  typeof RevenueCatUI.presentPaywall
>

describe("PaywallService", () => {
  let service: PaywallService

  beforeEach(() => {
    service = new PaywallService()
    mockPresentPaywall.mockReset()
  })

  // ===========================================================================
  // presentPaywall
  // ===========================================================================
  describe("presentPaywall", () => {
    it("should return true when user purchases", async () => {
      // Arrange
      mockPresentPaywall.mockResolvedValue(PAYWALL_RESULT.PURCHASED)

      // Act
      const result = await service.presentPaywall()

      // Assert
      expect(result).toBe(true)
    })

    it("should return true when purchase is restored", async () => {
      // Arrange
      mockPresentPaywall.mockResolvedValue(PAYWALL_RESULT.RESTORED)

      // Act
      const result = await service.presentPaywall()

      // Assert
      expect(result).toBe(true)
    })

    it("should return false when user cancels the paywall", async () => {
      // Arrange
      mockPresentPaywall.mockResolvedValue(PAYWALL_RESULT.CANCELLED)

      // Act
      const result = await service.presentPaywall()

      // Assert
      expect(result).toBe(false)
    })

    it("should return false when paywall is not presented", async () => {
      // Arrange
      mockPresentPaywall.mockResolvedValue(PAYWALL_RESULT.NOT_PRESENTED)

      // Act
      const result = await service.presentPaywall()

      // Assert
      expect(result).toBe(false)
    })

    it("should return false when RevenueCatUI returns ERROR", async () => {
      // Arrange
      mockPresentPaywall.mockResolvedValue(PAYWALL_RESULT.ERROR)

      // Act
      const result = await service.presentPaywall()

      // Assert
      expect(result).toBe(false)
    })

    it("should return false for unknown result value (defensive programming)", async () => {
      // Arrange — résultat inattendu du SDK, possible en cas de mise à jour
      mockPresentPaywall.mockResolvedValue("UNKNOWN_FUTURE_VALUE" as any)

      // Act
      const result = await service.presentPaywall()

      // Assert — le switch/if default doit attraper ça
      expect(result).toBe(false)
    })

    it("should return false and log warning when RevenueCatUI.presentPaywall throws", async () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {})
      const error = new Error("Network failure")
      mockPresentPaywall.mockRejectedValue(error)

      // Act
      const result = await service.presentPaywall()

      // Assert
      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith("Paywall error:", error)

      // Cleanup
      consoleSpy.mockRestore()
    })

    it("should handle non-Error thrown values gracefully (regression)", async () => {
      // Arrange — certains SDKs peuvent throw des strings ou objets primitifs
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {})
      mockPresentPaywall.mockRejectedValue("string error")

      // Act
      const result = await service.presentPaywall()

      // Assert — ne doit pas crasher, même avec un throw non-standard
      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()

      // Cleanup
      consoleSpy.mockRestore()
    })
  })
})