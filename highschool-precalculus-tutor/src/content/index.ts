import type { Unit } from "../types";
import unit00 from "./unit-00";
import unit01 from "./unit-01";
import unit02 from "./unit-02";
import unit03 from "./unit-03";
import unit04 from "./unit-04";
import unit05 from "./unit-05";
import unit06 from "./unit-06";
import unit07 from "./unit-07";
import unit08 from "./unit-08";
import unit09 from "./unit-09";
import unit10 from "./unit-10";
import unit11 from "./unit-11";
import unit12 from "./unit-12";

export const UNITS: Unit[] = [
  unit00,
  unit01,
  unit02,
  unit03,
  unit04,
  unit05,
  unit06,
  unit07,
  unit08,
  unit09,
  unit10,
  unit11,
  unit12,
];

export function findUnit(id: string): Unit | undefined {
  return UNITS.find((u) => u.id === id);
}

export function findSkill(skillId: string): { unit: Unit; skillIndex: number } | undefined {
  for (const unit of UNITS) {
    const idx = unit.skills.findIndex((s) => s.id === skillId);
    if (idx >= 0) return { unit, skillIndex: idx };
  }
  return undefined;
}
