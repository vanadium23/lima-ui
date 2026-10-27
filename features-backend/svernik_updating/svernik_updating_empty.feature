@ts-implemented
Feature: Attempting to do an empty update to svernik

  At the time of svernik update, a user can provide no data or meaningless data.
  A user can also send the very same data, which could mean some communication
  problems. Svernik will reject these types of update.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several correct items
    Then I successfully create a properly sorted svernik
    When I want to do essence update

  Scenario: Updating a list with a new reason for latest update
    # Иногда забываешь добавить, а это возможность докинуть информацию.
    And I provide a reason for latest update
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then updated svernik contains the provided reason for latest update
    Then updated svernik contains mark of the presence of a reason for latest update

  Scenario: Attempting to update svernik with empty data
    But I provide an empty update to essence
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "list-update-empty"

  Scenario: Attempting to update svernik with the same data
    But I provide to essence the same data which is in it
    Then my attempt to update a svernik with any set of the same data fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "list-update-repeats-current-content"

  Scenario: Attempting to update svernik with the same data and misleading mark of the reason for latest update
    And I provide another name
    And I provide a reason for latest update
    And I provide several correct items
    Then I successfully update the svernik and see properly sorted updated version of it
    And I want to do svernik update again
    But I provide to essence the same data which is in it
    And I provide the following mark of the absence of a reason for latest update: true
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "list-update-repeats-current-content"

  Scenario: Attempting to update svernik with the same data and extra non-relevant fields
    But I provide to essence the same data which is in it
    And I provide several non-relevant fields
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "list-update-repeats-current-content"
