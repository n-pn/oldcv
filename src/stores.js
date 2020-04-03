import { writable } from 'svelte/store'

export const active_lookup = writable(true)

export const lookup_input = writable('')
export const lookup_offset = writable(0)

export const upsert_input = writable('')
export const upsert_dname = writable('various')

export const segment = writable('/')
