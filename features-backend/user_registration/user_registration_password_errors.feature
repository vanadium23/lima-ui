@ts-implemented
Feature: password validations on user registration

  Background:
    When I want to register as a user
    And I provide a correct email

  Scenario Outline: Attempting to register a user with a erroneous password
    But I provide the absent, empty or incorrect password: <password>
    And I repeat current password
    Then my attempt to register fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <error message>
    Examples:
      | password | error message        |
      | absent   | "password-missing"   |
      | ""       | "password-empty"     |
      | null     | "password-empty"     |
      | 123      | "password-incorrect" |
      | {}       | "password-incorrect" |
      | []       | "password-incorrect" |
      | false    | "password-incorrect" |
      | true     | "password-incorrect" |

  Scenario: Attempting to register a user with a weak password
      And I provide a weak password
      And I repeat current password
      Then my attempt to register fails
      Then I see the following HTTP status code: 400
      Then I see the following error: "password-weak"

  Scenario: Attempting to register a user with a too long password
      And I provide a random password with length: 65
      And I repeat current password
      Then my attempt to register fails
      Then I see the following HTTP status code: 400
      Then I see the following error: "password-too-long"

  Scenario: Attempting to register a user with incorrect password confirmation
      And I provide a correct password
      And I mistype a correct password
      Then my attempt to register fails
      Then I see the following HTTP status code: 400
      Then I see the following error: "password-confirmation-mismatch"

  Scenario: Attempting to register a user without password confirmation
      And I provide a correct password
      Then my attempt to register fails
      Then I see the following HTTP status code: 400
      Then I see the following error: "password-confirmation-mismatch"
