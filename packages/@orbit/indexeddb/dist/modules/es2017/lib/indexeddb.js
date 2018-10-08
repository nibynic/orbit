import Orbit from '@orbit/core';
export function supportsIndexedDB() {
    return !!Orbit.globals.indexedDB;
}