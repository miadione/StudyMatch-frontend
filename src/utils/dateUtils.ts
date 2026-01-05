export function calculateAge(birthdate: string | null | undefined): number | null {
    if (!birthdate) return null

    const birth = new Date(birthdate)
    const today = new Date()

    // Ungültiges Datum prüfen
    if (isNaN(birth.getTime())) return null

    let age = today.getFullYear() - birth.getFullYear()

    const monthDiff = today.getMonth() - birth.getMonth()
    const dayDiff = today.getDate() - birth.getDate()

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--
    }

    return age
}