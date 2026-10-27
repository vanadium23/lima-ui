@ts-implemented
Feature: Redirecting user asking for anything with an extra slash in a URL

  Svernik API URLs are not expected to have / in the end.
  For such requests, users will be redirected to a slashless URL.

  Scenario: Sending request to URL with excessive slash
    When I make request using any route with excessive slash
    Then I see the redirect to slashless URL
