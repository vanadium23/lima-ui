@ts-implemented
Feature: user registration process

  Background:
    When I want to register as a user

  Scenario: Register a user with correct information
    And I provide a random correct email
    And I provide a correct password
    And I repeat current password
    Then I successfully registered as a user
    Then I see the following HTTP status code: 200
    And I check my emails
    And I see my registration email token
    Then I successfully verify email with token
    Then I see the following HTTP status code: 200
    And I save token from verification response
    Then I successfully see my profile
    Then I see the following HTTP status code: 200
    And I see registration email in profile
    And I don't see my password hash

  Scenario: Attempting to verify email with already used token
    And I provide a random correct email
    And I provide a correct password
    And I repeat current password
    Then I successfully registered as a user
    Then I see the following HTTP status code: 200
    And I check my emails
    And I see my registration email token
    Then I successfully verify email with token
    Then I see the following HTTP status code: 200
    Then my attempt to verify email with same token fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "token-invalid"

  Scenario: Attempting to register already existed user
    And I provide a random correct email
    And I provide a correct password
    And I repeat current password
    Then I successfully registered as a user
    Then I see the following HTTP status code: 200
    And I try to register same email
    And I provide a correct password
    And I repeat current password
    Then my attempt to register fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "email-general-error"
