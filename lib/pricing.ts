/**
 * Flat delivery fee in USD, charged once per order with at least one item.
 *
 * This lives here because the figure was previously written out three times —
 * the cart, the checkout and the orders API — and the API's copy is the one
 * that gets stored on the order. Three literals meant the customer could be
 * shown one price and charged another.
 */
export const SHIPPING_FEE = 5

/** Delivery is free on an empty cart, so the summary reads 0 rather than 5. */
export function shippingFor(itemCount: number) {
  return itemCount > 0 ? SHIPPING_FEE : 0
}
