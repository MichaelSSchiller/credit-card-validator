import type {
  ActionFunctionArgs,
  MetaFunction,
  TypedResponse,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Credit Card validator" }];

interface ActionData {
  isValid: boolean;
  cardNumber: string;
}

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<TypedResponse<ActionData>> => {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  const data = validateLuhnChecksum(values);
  return json(data);
};

const Index = () => {
  const data = useActionData<typeof action>();

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
            <span className="block sm:inline">
              Credit Card # {data.cardNumber} is invalid
            </span>
          </div>
        )}
        {data?.isValid === true && (
          <div
            className="relative rounded border border-teal-500 bg-teal-100 px-4 py-3 text-teal-900"
            role="alert"
          >
            <span className="block sm:inline">
              Credit Card # {data.cardNumber} is valid
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

// Luhn checksum algorithm https://en.wikipedia.org/wiki/Luhn_algorithm
const validateLuhnChecksum = (values: {
  [k: string]: FormDataEntryValue;
}): { isValid: boolean; cardNumber: string } => {
  if (!values.cardNumber) return { isValid: false, cardNumber: "" };
  const [...cardNumberArr] = String(values.cardNumber);
  const reverse = cardNumberArr.reverse();
  // 1. Drop the check digit (last digit) of the number to validate.
  // const droppedCheckDigit = Number(payload.splice(0, 1)[0]);
  const [droppedCheckDigit, ...payload] = reverse;
  // 2. Calculate the check digit
  const digitSum = payload.reduce<number>((acc, num, i) => {
    const number = Number(num);
    // NOTE odd index position just add the number
    if (i % 2 !== 0) {
      return acc + number;
    }
    // NOTE double the value of every second digit
    const doubled = number * 2;
    // NOTE Sum the values of the resulting digits. (The sum of the digits of any number equals the remainder of the division of that number by nine)
    if (doubled > 9) {
      return acc + (doubled - 9);
    }
    return acc + doubled;
  }, 0);
  // 3. Add the diitSum to the droppedCheckDigit and check if it is divisible by 10
  const isValid = (digitSum + Number(droppedCheckDigit)) % 10 === 0;
  return { isValid, cardNumber: String(values.cardNumber) };
};
