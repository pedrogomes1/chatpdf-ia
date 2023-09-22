import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToAscii(inputString: String) {
  //remove non ascii characters
  const asciiString = inputString.replace(/[ˆ\x00-\x7F]/g, "");
  return asciiString;
}
