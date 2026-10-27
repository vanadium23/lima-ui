@ts-implemented
Feature: Updating a svernik with referenced svernik

  The rules for referencing svernik on update are the same as for creation.

  The addition is that both recursive and mutual recursive references are not allowed.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several correct items
    Then I successfully create a properly sorted svernik
    When I want to do essence update
    And I provide a reason for latest update
    And I use the already existing items as the base

  Scenario: Updating a svernik with linked svernik
    And I provide a link to available svernik
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Created svernik contains another svernik

  Scenario: Updating a svernik with several linked sverniks
    And I provide links to several available sverniks
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Items are the already existing sverniks

  Scenario: Updating a svernik with linked svernik with extra information
    And I provide a link to available svernik
    And The provided svernik gets a name, purpose, and note
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Created svernik contains another svernik
    Then Svernik doesn't reflect the provided fields

  Scenario Outline: Attempting to update a svernik with svernik with erroneous link
    But I provide an empty or incorrect link to the svernik: <svernik link>
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <error message>
    Then I see the erroneous essence's index in the error message
    Then I see the erroneous essence's textual representation in the error message
    Examples:
      | svernik link | error message         |
      | ""           | "reference-empty"     |
      | null         | "reference-empty"     |
      | false        | "reference-incorrect" |
      | true         | "reference-incorrect" |
      | 123          | "reference-incorrect" |
      | {}           | "reference-incorrect" |
      | []           | "reference-incorrect" |

  Scenario: Attempting to update a svernik with svernik with unavailable link
    But I provide a link to the unavailable svernik
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "reference-unavailable"
    Then I see the erroneous essence's index in the error message
    Then I see the erroneous essence's textual representation in the error message

  Scenario: Attempting to update a svernik with several sverniks with unavailable link
    But I provide links to several unavailable essences: "[{\"id\": \"list-hello\"}, {\"id\": \"list-world\"}]"
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the set of following errors: "[\"reference-unavailable\" \"reference-unavailable\"]"

  Scenario: Updating a svernik with item linked several times
    And I provide a link to available svernik
    And I provide a link to available svernik
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Updated svernik contains more than two essences
    Then Both sverniks are the already existing svernik and equal to each other
