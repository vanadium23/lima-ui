@ts-implemented
Feature: Returning METHOD NOT ALLOWED for a request to existing address using the unsupported HTTP method

  Scenario: Requesting something from Svernik using the non-existing address
    When I make request using any route but with this route's unsupported methods
    Then I expect to receive the 405, METHOD NOT ALLOWED, HTTP response status
    Then I see the HTTP-method-not-allowed error as the response data
