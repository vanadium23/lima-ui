@ts-implemented
Feature: Returning NOT FOUND for a request to non-existing address

  Scenario: Requesting something from Svernik using the non-existing address
    When I make request using a non-existing address
    Then I expect to receive the 404, NOT FOUND, HTTP response status
    Then I see the resource-not-found error as the response data
