@ts-implemented
Feature: Protected routes require authentication

  Scenario: All protected routes return 401 without Authorization header
    When I make requests to all protected routes without Authorization header
    Then I expect every protected route to return 401 Unauthorized
