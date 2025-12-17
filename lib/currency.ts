// Currency formatting for Kenyan Shillings
export function formatPrice(price: number): string {
    return `KSh ${price.toLocaleString('en-KE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
}

// Convert USD to KSh (approximate rate: 1 USD = 130 KSh)
export function usdToKsh(usdPrice: number): number {
    return Math.round(usdPrice * 130);
}
