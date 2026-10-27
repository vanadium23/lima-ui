@ts-implemented
Feature: Treating any body-having request without Content-Type as JSON

  For incoming requests with not empty bodies but without Content-Type header
  Svernik thinks that the attached data is JSON and tries to act accordingly.

  Scenario: Sending any body-having request without Content-Type
    When I make request using any route with body but without Content-Type
    Then I expect not to receive the 500, INTERNAL SERVER ERROR, HTTP response status
