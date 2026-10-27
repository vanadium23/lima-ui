@ts-implemented
Feature: Handle session expiration for different tokens

  Background:
    Given I am "user@example.com"

  Scenario: Request with random session
    When I try to see my profile
    And I have a random session
    Then my attempt to see my profile fails
    Then I see the following HTTP status code: 401
    Then I see the following error: "user-unauthorized"

  Scenario: Request with expired session
    When I try to see my profile
    And I have an expired session
    Then my attempt to see my profile fails
    Then I see the following HTTP status code: 401
    Then I see the following error: "user-unauthorized"

  Scenario: Request with active session, but closed to expiration
    When I try to see my profile
    And I have the running out session
    Then I successfully see my profile
    Then I see the following HTTP status code: 200
    And I see my email
    And I don't see my password hash
