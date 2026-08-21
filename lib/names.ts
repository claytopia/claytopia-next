export interface AttendeeName {
  firstName: string
  lastName?: string | null
}

/**
 * Turn a list of attendee names into display strings, disclosing as little of
 * the last name as needed to disambiguate people who share a first name.
 *
 * Examples:
 *   [{Eva, Sott}, {Eva, Soltau}]        -> ["Eva Sot.", "Eva Sol."]
 *   [{Eva, Sott}, {Max, Meier}]         -> ["Eva", "Max"]
 *   [{Eva, Sott}, {Eva, Sott}]          -> ["Eva Sott", "Eva Sott"] (identical)
 *
 * The result preserves the input order.
 */
export function disambiguateNames(attendees: AttendeeName[]): string[] {
  // Group indices by first name (case-insensitive)
  const groups = new Map<string, number[]>()
  attendees.forEach((a, i) => {
    const key = a.firstName.trim().toLowerCase()
    const arr = groups.get(key)
    if (arr) arr.push(i)
    else groups.set(key, [i])
  })

  const result: string[] = new Array(attendees.length)

  for (const indices of groups.values()) {
    // Unique first name → first name alone is enough
    if (indices.length === 1) {
      result[indices[0]] = attendees[indices[0]].firstName.trim()
      continue
    }

    // Collision: find the shortest last-name prefix length that makes each
    // person's "FirstName + prefix" unique within the group.
    const lastNames = indices.map(i => (attendees[i].lastName ?? '').trim())
    const maxLen = Math.max(0, ...lastNames.map(n => n.length))

    let chosenLen = maxLen
    for (let len = 1; len <= maxLen; len++) {
      const prefixes = lastNames.map(n => n.slice(0, len).toLowerCase())
      if (new Set(prefixes).size === prefixes.length) {
        chosenLen = len
        break
      }
    }

    indices.forEach((i, gi) => {
      const first = attendees[i].firstName.trim()
      const last = lastNames[gi]
      if (!last) {
        // No last name (e.g. guest) — nothing to disambiguate with
        result[i] = first
        return
      }
      const prefix = last.slice(0, chosenLen)
      // Add a trailing dot only when the name is abbreviated
      const display = prefix.length < last.length ? `${prefix}.` : prefix
      result[i] = `${first} ${display}`
    })
  }

  return result
}

/** Identity key for matching a name against a precomputed display map. */
export function nameKey(firstName: string, lastName?: string | null): string {
  return `${firstName.trim().toLowerCase()}|${(lastName ?? '').trim().toLowerCase()}`
}

/**
 * Build a lookup from name identity to display string, disambiguating across
 * the *entire* set of people passed in (the "universe"), not just those shown
 * in one place. This means "Eva Sott" is rendered as "Eva Sot." even when she
 * is the only Eva at a given session, as long as another "Eva …" exists in the
 * universe.
 */
export function buildDisplayNameMap(universe: AttendeeName[]): Map<string, string> {
  // De-duplicate identical people so a duplicated identity does not force the
  // whole first-name group to full last names.
  const seen = new Map<string, AttendeeName>()
  for (const person of universe) {
    seen.set(nameKey(person.firstName, person.lastName), person)
  }

  const unique = [...seen.values()]
  const displays = disambiguateNames(unique)

  const map = new Map<string, string>()
  unique.forEach((person, i) => {
    map.set(nameKey(person.firstName, person.lastName), displays[i])
  })
  return map
}
