import type {
  ActionFunctionArgs,
  MetaFunction,
  TypedResponse,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Credit Card validator" }];

interface ActionData {
  isValid?: boolean;
}

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<TypedResponse<ActionData>> => {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  const value = validateFormvalues(values);
  // deleteCreditCard(creditCardId);
  return json({ isValid: value });
};

const Index = () => {
  const data = useActionData<typeof action>();
  console.log(data);

  return (
    <div className="flex h-screen">
      <div className="mx-auto w-1/3">
        <Form method="post">
          <div className="flex w-full flex-wrap gap-3 p-5">
            <label className="relative flex w-full flex-col">
              <span className="mb-3 font-bold">Card number</span>
              <input
                className="peer rounded-md border-2 border-gray-200 p-2 placeholder:text-gray-300"
                type="text"
                name="cardNumber"
                placeholder="0000 0000 0000 0000"
                maxLength={16}
                minLength={16}
                pattern="[0-9]+"
                required
              />
              <p className="text-xs italic text-gray-600">
                Please enter a 16 digit number
                <br />
                No spaces or special characters
              </p>
              <button
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                type="submit"
              >
                Submit
              </button>
            </label>
          </div>
        </Form>
        {data?.isValid === false && (
          <div
            className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
            role="alert"
          >
            <span className="block sm:inline">Credit Card is invalid</span>
          </div>
        )}
        {data?.isValid === true && (
          <div
            className="relative rounded border border-teal-500 bg-teal-100 px-4 py-3 text-teal-900"
            role="alert"
          >
            <span className="block sm:inline">Credit Card is valid</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

/*
Luhn checksum algorithm https://en.wikipedia.org/wiki/Luhn_algorithm
1. If the number already contains the check digit, drop that digit to form the "payload". The check digit is most often the last digit.
2. With the payload, start from the rightmost digit. Moving left, double the value of every second digit (including the rightmost digit).
3. Sum the values of the resulting digits.
*/

// NOTE exported for testin purposes
export const validateFormvalues = (values: {
  [k: string]: FormDataEntryValue;
}): boolean => {
  const cardNumber = String(values.cardNumber);
  const payload = cardNumber.split("").reverse();
  const checkDigit = payload.splice(0, 1)[0];
  const digitSum = payload.reduce<number>((acc, num, i) => {
    const number = Number(num);
    // odd index position just add the number
    if (i % 2 !== 0) {
      return acc + number;
    }
    // double the value of every second digit
    const doubled = number * 2;
    // Sum the values of the resulting digits.
    // The sum of the digits of any number equals the remainder of the division of that number by nine (step 3 above)
    if (doubled > 9) {
      return acc + (doubled - 9);
    }
    return acc + doubled;
  }, 0);
  // Compare your result with the original check digit. If both numbers match, the result is valid
  const isValid = 10 - (digitSum % 10) === Number(checkDigit);
  return isValid;
};
