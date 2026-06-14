import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const MARKET_TAX_RATE = 0.065;
const PREMIUM_MARKET_TAX_RATE = 0.045;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateNetMargin(
  buyPrice: number,
  sellPrice: number,
  hasPremium = false
): number {
  if (buyPrice === 0 && sellPrice === 0) return 0;
  const taxRate = hasPremium ? PREMIUM_MARKET_TAX_RATE : MARKET_TAX_RATE;
  const tax = Math.round(sellPrice * taxRate);
  return sellPrice - buyPrice - tax;
}

export function calculateMarginPercent(
  buyPrice: number,
  netMargin: number
): number {
  if (buyPrice === 0) return 0;
  return Math.round((netMargin / buyPrice) * 100);
}

export function formatSilver(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return millions % 1 === 0 ? `${millions}M` : `${parseFloat(millions.toFixed(1))}M`;
  }
  if (amount >= 1_000) {
    const thousands = amount / 1_000;
    return thousands % 1 === 0 ? `${thousands}K` : `${parseFloat(thousands.toFixed(1))}K`;
  }
  return amount.toString();
}

interface RiskInput {
  volume: number;
  marginPct: number;
  dataAge: number;
}

export function evaluateRisk({ volume, marginPct, dataAge }: RiskInput): number {
  const volumeRisk = volume <= 1 ? 1 : volume < 10 ? 0.6 : volume < 50 ? 0.3 : 0.1;
  const ageRisk = dataAge > 30 ? 0.9 : dataAge > 15 ? 0.5 : dataAge > 5 ? 0.2 : 0.1;
  const marginRisk = marginPct > 200 ? 0.4 : marginPct > 100 ? 0.2 : 0;
  const score = volumeRisk * 0.4 + ageRisk * 0.4 + marginRisk * 0.2;
  return Math.min(1, Math.max(0, Math.round(score * 100) / 100));
}
