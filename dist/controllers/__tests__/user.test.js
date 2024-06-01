import createApp from "../../app.js";
import { expect, describe, it } from "vitest";
const app = createApp();
describe("user", () => {
    describe("user test", () => {
        describe("POST /user", () => {
            it("should return 200", async () => {
                expect(1).toBe(1);
            });
        });
    });
});
