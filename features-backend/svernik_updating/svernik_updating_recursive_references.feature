@ts-implemented
Feature: Recursive referencing is not allowed.

  It leads to infinite loops, and programming products are rarely about them.

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

  Scenario: Attempting to update a svernik by adding itself to its items
    But I provide a link to this very svernik
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "recursive-referencing"
    Then I see the erroneous essence's index in the error message
    Then I see the erroneous essence's textual representation in the error message

  Scenario: Attempting to update a svernik by adding itself to its items indirectly
    And I provide a link to available svernik
    Then I successfully update the svernik and see properly sorted updated version of it
    When I want to do the referenced svernik update
    And I provide a reason for latest update
    And I use the already existing items as the base
    But I provide a link to the original svernik
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "recursive-referencing"
    Then I see the erroneous essence's index in the error message
    Then I see the erroneous essence's textual representation in the error message
