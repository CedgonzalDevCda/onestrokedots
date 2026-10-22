export function useInterstitial() {
  function show(onClosed?: () => void) {
    // pas de pubs sur le web : on continue directement
    onClosed?.();
  }

  return { show };
}