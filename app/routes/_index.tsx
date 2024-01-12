import type {
  ActionFunctionArgs,
  MetaFunction,
  TypedResponse,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Credit Card validator" }];

interface ActionData {
  values?: string;
}

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<TypedResponse<ActionData>> => {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  // const creditCardId = validateFormvalues(values);
  // deleteCreditCard(creditCardId);
  return json({ values: "test" });
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
                name="card_number"
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
      </div>
    </div>
  );
};

export default Index;
