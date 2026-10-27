@ts-implemented
Feature: email validations on user login

  Background:
    When I want to login as a user
    And I provide a correct password

  Scenario Outline: Attempting to login a user with a erroneous email
    But I provide the absent, empty or incorrect email: <email>
    Then my attempt to login fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <error>
    Examples:
      | email    |      error        |
      | absent   | "email-missing"   |
      | ""       | "email-empty"     |
      | null     | "email-empty"     |
      | 123      | "email-incorrect" |
      | {}       | "email-incorrect" |
      | []       | "email-incorrect" |
      | false    | "email-incorrect" |
      | true     | "email-incorrect" |
      | "some"   | "email-invalid"   |
