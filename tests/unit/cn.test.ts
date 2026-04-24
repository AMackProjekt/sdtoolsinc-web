import { describe, expect, it } from "vitest";
import { cn } from "@/lib/cn";

describe("cn", () => {
  it("merges class values", () => {
    expect(cn("p-2", "p-4", false && "hidden", undefined, "text-sm")).toBe("p-4 text-sm");
  });
});
