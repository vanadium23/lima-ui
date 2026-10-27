@ts-implemented
Feature: Creating a svernik with referenced svernik

  User can create svernik and reference other sverniks. Their consequent update will automatically
  appear in svernik.

  The only id is required to reference a svernik. Items' and sverniks' ids don't intersect.

  There could be the following cases when referencing sverniks:
  - Referencing is correct. The created svernik contains the referenced one.
  - Referencing is correct. However, there is extra data passed with id either relevant to svernik or not.
  This data is ignored.
  - Referencing is incorrect because of the incorrect id.
  - Referencing is incorrect because there is no available svernik with such id.

  Multiple referencing of the same sverniks is totally fine.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose

  Scenario: Creating a svernik with linked svernik
    And I provide a link to available svernik
    Then I successfully create a properly sorted svernik
    Then Created svernik contains another svernik

  Scenario: Creating a svernik with several linked sverniks
    And I provide links to several available sverniks
    Then I successfully create a properly sorted svernik
    Then Items are the already existing sverniks

  Scenario: Creating a svernik with linked svernik with extra information
    And I provide a link to available svernik
    And The provided svernik gets a name, purpose, and note
    Then I successfully create a properly sorted svernik
    Then Created svernik contains another svernik
    Then Svernik doesn't reflect the provided fields

  Scenario Outline: Attempting to create a svernik with svernik with erroneous link
    But I provide an empty or incorrect link to the svernik: <svernik link>
    Then my attempt to create a svernik fails
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

  Scenario: Attempting to create a svernik with svernik with unavailable link
    But I provide a link to the unavailable svernik
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "reference-unavailable"
    Then I see the erroneous essence's index in the error message
    Then I see the erroneous essence's textual representation in the error message

  Scenario: Attempting to create a svernik with several sverniks with unavailable link
    But I provide links to several unavailable essences: "[{\"id\": \"list-hello\"}, {\"id\": \"list-world\"}]"
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the set of following errors: "[\"reference-unavailable\" \"reference-unavailable\"]"

  Scenario: Creating a svernik with item linked several times
    And I provide a link to available svernik
    And I provide a link to available svernik
    Then I successfully create a properly sorted svernik
    Then Created svernik contains two essences
    Then Both sverniks are the already existing svernik and equal to each other
