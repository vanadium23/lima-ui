@ts-implemented
Feature: Protected routes require valid authentication

  Scenario: All protected routes return 401 with invalid Bearer token
    When I make requests to all protected routes with Authorization header "Bearer bad_token"
    Then I expect every protected route to return 401 Unauthorized

  Scenario: All protected routes return 401 with expired Bearer token
    When I make requests to all protected routes with Authorization header "Bearer expired_token"
    Then I expect every protected route to return 401 Unauthorized
