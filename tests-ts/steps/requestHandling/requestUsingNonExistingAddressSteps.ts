// Ported from features/request_handling/request_using_non_existing_address_steps.clj.
import { ERRORS } from "../../../src-ts/domain/constants.ts";
import { Then, When, is, isEqual, type TestData } from "../../support/world.ts";
import { request, type ApiResponse } from "../../support/http.ts";
import { serverUrl } from "../../support/config.ts";
import { NOT_FOUND } from "../../utilities/httpStatuses.ts";
import { errorsJsonProperlySorted } from "../../utilities/properlySortedJson.ts";
import { isErrors } from "../../utilities/validators.ts";

// This feature threads the raw HTTP response through its steps.
type ResponseData = TestData & Partial<ApiResponse> & { body?: { errors?: { id: string }[] } };

When("I make request using a non-existing address", async (): Promise<TestData> => {
  const response = await request("GET", `${serverUrl()}/some-non-existing-address`);
  return response as never;
});

Then(
  "I expect to receive the 404, NOT FOUND, HTTP response status",
  (response: ResponseData): TestData => {
    isEqual(response.status, NOT_FOUND);
    return response as TestData;
  },
);

Then(
  "I see the resource-not-found error as the response data",
  (response: ResponseData): TestData => {
    is(errorsJsonProperlySorted(response.text ?? ""), "Errors JSON is not properly sorted.");
    isErrors(response.body);
    isEqual(
      response.body?.errors?.[0]?.id,
      ERRORS.resourceNotFound.id,
    );
    return response as TestData;
  },
);
