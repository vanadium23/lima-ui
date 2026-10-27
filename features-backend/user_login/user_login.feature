@ts-implemented
Feature: user login process

  Background:
    When I want to login as a user

  Scenario: Attempting to login non existed user
    And I provide a random correct email
    And I provide a random password with length: 12
    Then my attempt to login fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "password-wrong"

  Scenario: Attempting to login with wrong password
    And I provide the user's email
    And I provide a random password with length: 12
    Then my attempt to login fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "password-wrong"

  Scenario: Successfully login user
    And I provide the user's email
    And I provide the user's password
    Then I successfully login as a user
    Then I see the following HTTP status code: 200
    And I save token from login response
    Then I successfully see my profile
    Then I see the following HTTP status code: 200
    And I see my email
    And I don't see my password hash
