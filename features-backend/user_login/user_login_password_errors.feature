@ts-implemented
Feature: password validations on user login

  Background:
    When I want to login as a user
    And I provide a correct email

  Scenario Outline: Attempting to login a user with a erroneous password
    But I provide the absent, empty or incorrect password: <password>
    Then my attempt to login fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <error>
    Examples:
      | password | error               |
      | absent   | "password-missing"   |
      | ""       | "password-empty"     |
      | null     | "password-empty"     |
      | 123      | "password-incorrect" |
      | {}       | "password-incorrect" |
      | []       | "password-incorrect" |
      | false    | "password-incorrect" |
      | true     | "password-incorrect" |

  Scenario: Attempting to login a user with a too long password
      And I provide a random password with length: 65
      Then my attempt to login fails
      Then I see the following HTTP status code: 400
      Then I see the following error: "password-too-long"
