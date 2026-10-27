@ts-implemented
Feature: Returning OK for a request to existing address using the HEAD HTTP method

  Scenario: Expecting every route to support HEAD method
    When I plan to make a request using HEAD HTTP method
    Then I expect every Svernik route to support HEAD HTTP method

  Scenario: Requesting something from Svernik using the HEAD method
    When I make request using any route with HEAD method
    Then I expect not to receive the 405, METHOD NOT ALLOWED, HTTP response status
    Then I expect to receive the empty response body
