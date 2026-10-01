import { describe, expect, it } from "bun:test";
import { isoDate, timeAgo } from "./time";

describe("timeAgo", () => {
    const now = new Date("2026-10-01T12:00:00Z");

    it("formats hours", () => {
        expect(timeAgo("2026-10-01T09:00:00Z", now)).toBe("3 hr. ago");
    });

    it("formats days", () => {
        expect(timeAgo("2026-09-29T12:00:00Z", now)).toBe("2 days ago");
    });

    it("handles very recent times", () => {
        expect(timeAgo("2026-10-01T11:59:40Z", now)).toBe("just now");
    });
});

describe("isoDate", () => {
    it("keeps the date part", () => {
        expect(isoDate("2026-09-30T18:22:01Z")).toBe("2026-09-30");
    });
});
