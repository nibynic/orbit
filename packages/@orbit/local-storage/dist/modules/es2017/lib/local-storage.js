import Orbit from '@orbit/core';
export function supportsLocalStorage() {
    return !!Orbit.globals.localStorage;
}