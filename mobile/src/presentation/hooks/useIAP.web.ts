// Version web : les achats intégrés sont désactivés
export function useIAP() {
  return {
    isPremium: false,
    hasNoAds: false,
    loading: false,
    refreshPurchases: async () => {},
  }
}