@ts-implemented
Feature: Treating any request with body containing invalid JSON as BAD REQUEST

  Scenario: Attempting to send any invalid JSON body request
    When I make request using any route with invalid JSON body
    Then I expect to receive the 400, BAD REQUEST, HTTP response status
    Then I see the invalid-JSON error as the response data
