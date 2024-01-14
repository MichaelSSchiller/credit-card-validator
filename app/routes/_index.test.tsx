import { action, validateLuhnChecksum } from "./_index";

// All valid credit card numbers
const valid1 = "4539677908016808";
const valid2 = "5535766768751439";
const valid3 = "371612019985236"; //15 digits
const valid4 = "6011144340682905";
const valid5 = "4539404967869666";

// All invalid credit card numbers
const invalid1 = "4532778771091795";
const invalid2 = "5795593392134643";
const invalid3 = "375796084459914";
const invalid4 = "6011127961777935";
const invalid5 = "5382019772883854";
const invalid6 = "";

const validityTests: [string, boolean][] = [
  [valid1, true],
  [valid2, true],
  [valid3, true],
  [valid4, true],
  [valid5, true],
  [invalid1, false],
  [invalid2, false],
  [invalid3, false],
  [invalid4, false],
  [invalid5, false],
  [invalid6, false],
];

describe("Test valiadtion", () => {
  describe("validateLuhnChecksum", () => {
    test.each(validityTests)(
      "card number %p should validate to %p",
      async (cardNumber, isValid) => {
        const data = validateLuhnChecksum(cardNumber);
        expect(data).toEqual(isValid);
      },
    );
  });

  describe("Action function should return data", () => {
    test.each([
      [valid1, true],
      [invalid1, false],
      [invalid6, false],
    ])(
      "Action should return {cardNumber: %p, isValid: %p}",
      async (cardNumber, isValid) => {
        const body = new URLSearchParams({
          cardNumber,
        });
        const request = new Request("http://app.com/path", {
          method: "POST",
          body,
        });

        const response = await action({ request, params: {}, context: {} });
        const data = await response.json();
        expect(data).toEqual({ cardNumber, isValid });
      },
    );
  });
});
