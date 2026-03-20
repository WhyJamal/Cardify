export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")        
    .replace(/[^\p{L}\p{N}-]+/gu, "") 
    .replace(/--+/g, "-");
}