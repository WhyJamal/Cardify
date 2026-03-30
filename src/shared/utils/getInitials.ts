export function getInitials(name: string) {
    const parts = name.trim().split(" ").filter(Boolean);

    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    return parts[0].slice(0, 2).toUpperCase();
};