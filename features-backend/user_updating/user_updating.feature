@ts-implemented
Feature: Updating user name

  Background:
    Given I am "user@example.com"
    And I want to update user

  Scenario Outline: Updating user with garbage data fails
    But I provide the incorrect user update data: <garbage>
    Then my attempt to update user fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "user-update-incorrect"
    Examples:
      | garbage   |
      | []        |
      | 123       |
      | false     |
      | true      |
      | "garbage" |

  Scenario: Updating user with empty data fails
    Then my attempt to update user fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "user-update-empty"

  Scenario: Updating user with unknown fields is treated as empty update
    And I want to update the "unknownField" user field with "value"
    Then my attempt to update user fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "user-update-empty"

  Scenario: Updating name with empty string sets name to empty string
    And I want to update the "name" user field with ""
    Then I successfully update my user name
    Then I see the following HTTP status code: 200
    Then my user name is ""

  Scenario: Updating name with valid short string succeeds
    And I want to update the "name" user field with "John"
    Then I successfully update my user name
    Then I see the following HTTP status code: 200
    Then my user name is "John"

  Scenario: Updating name persists in database
    And I want to update the "name" user field with "John"
    Then I successfully update my user name
    Then I see the following HTTP status code: 200
    Then my user name is "John"
    When I successfully see my profile
    Then I see the following HTTP status code: 200
    Then my user name is "John"

  Scenario: Updating name with 32 character string succeeds
    And I want to update the "name" user field with "12345678901234567890123456789012"
    Then I successfully update my user name
    Then I see the following HTTP status code: 200
    Then my user name is "12345678901234567890123456789012"

  Scenario: Updating name with string longer than 32 characters fails
    And I want to update the "name" user field with "123456789012345678901234567890123"
    Then my attempt to update user fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "name-too-long"

  Scenario Outline: Updating name with incorrect type fails
    And I want to update the "name" user field with <name>
    Then my attempt to update user fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "name-incorrect"
    Examples:
      | name  |
      | null  |
      | 123   |
      | false |
      | true  |
      | {}    |
      | []    |

  Scenario: Updating user with the same name succeeds
    And I want to update the "name" user field with "lopato"
    Then I successfully update my user name
    Then I see the following HTTP status code: 200
    Then my user name is "lopato"
    When I want to update my user name again with the same data
    Then I successfully update my user name
    Then I see the following HTTP status code: 200
    Then my user name is "lopato"

  Scenario: Attempting to update email returns error
    And I want to update the "email" user field with "new@example.com"
    Then my attempt to update user fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "email-update-not-allowed"

  Scenario: Attempting to update password returns Not Implemented
    And I want to update the "password" user field with "NewPassword123!"
    Then my attempt to update user password fails
    Then I see the following HTTP status code: 501
