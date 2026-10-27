@ts-implemented
Feature: Public routes do not require authentication

  Scenario: Public routes return success without Authorization header
    When I make requests to all public routes without Authorization header
    Then I expect no public route to return 401 Unauthorized
