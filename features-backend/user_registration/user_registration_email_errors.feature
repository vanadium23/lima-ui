@ts-implemented
Feature: email validations on user registration

  Background:
    When I want to register as a user
    And I provide a correct password
    And I repeat current password

  Scenario Outline: Attempting to register a user with a erroneous email
    But I provide the absent, empty or incorrect email: <email>
    Then my attempt to register fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <error message>
    Examples:
      | email    | error message     |
      | absent   | "email-missing"   |
      | ""       | "email-empty"     |
      | null     | "email-empty"     |
      | 123      | "email-incorrect" |
      | {}       | "email-incorrect" |
      | []       | "email-incorrect" |
      | false    | "email-incorrect" |
      | true     | "email-incorrect" |
      | "some"   | "email-invalid"   |
