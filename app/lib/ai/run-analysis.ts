/** Functions to analyze run activities */

import { DatabaseActivity } from "../definitions";

export function analyzeRunType(elevation: number, distance: number) : string {

    if (elevation >= 150) {
        return "Hill"
    }

    if (distance > 8000) {
        return "Long"
    }

    return "";
}