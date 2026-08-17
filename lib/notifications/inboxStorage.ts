export type InboxState = {
  readIds: string[]
  dismissedIds: string[]
  lastPushIds: string[]
  lastDigestAt: string | null
}

const DEFAULT_INBOX: InboxState = {
  readIds: [],
  dismissedIds: [],
  lastPushIds: [],
  lastDigestAt: null,
}

const STORAGE_PREFIX = "astra-notification-inbox:"

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`
}

function normalizeInbox(input?: Partial<InboxState> | null): InboxState {
  return {
    readIds: Array.isArray(input?.readIds)
      ? input!.readIds.filter((id) => typeof id === "string")
      : [],
    dismissedIds: Array.isArray(input?.dismissedIds)
      ? input!.dismissedIds.filter((id) => typeof id === "string")
      : [],
    lastPushIds: Array.isArray(input?.lastPushIds)
      ? input!.lastPushIds.filter((id) => typeof id === "string")
      : [],
    lastDigestAt:
      typeof input?.lastDigestAt === "string" ? input.lastDigestAt : null,
  }
}

export function loadInboxState(userId: string): InboxState {
  if (typeof window === "undefined" || !userId) {
    return { ...DEFAULT_INBOX }
  }
  try {
    const raw = window.localStorage.getItem(storageKey(userId))
    if (!raw) return { ...DEFAULT_INBOX }
    return normalizeInbox(JSON.parse(raw) as Partial<InboxState>)
  } catch {
    return { ...DEFAULT_INBOX }
  }
}

export function saveInboxState(userId: string, state: InboxState) {
  if (typeof window === "undefined" || !userId) return
  try {
    window.localStorage.setItem(storageKey(userId), JSON.stringify(normalizeInbox(state)))
  } catch {
    // ignore
  }
}

/** Keep storage bounded when alert ids churn daily. */
export function pruneInboxState(
  state: InboxState,
  activeIds: Set<string>,
  maxIds = 200
): InboxState {
  const keep = (ids: string[]) =>
    ids.filter((id) => activeIds.has(id)).slice(-maxIds)
  return {
    readIds: keep(state.readIds),
    dismissedIds: keep(state.dismissedIds),
    lastPushIds: keep(state.lastPushIds),
    lastDigestAt: state.lastDigestAt,
  }
}
