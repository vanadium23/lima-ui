@ts-implemented
Feature: Old user-provided data stays intact if not modified on svernik update

  Scenario: No matter what user-provided data is changed in the svernik, other user-provided data remains the same
  It's also demonstrated that a user doesn't need to provide all the possible data, it's okay to provide just
  a few desired fields accompanied by the reason for latest update or the mark of its absence.
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide a note
    And I provide several items with correct content
    Then I successfully create a properly sorted svernik
    When I want to do essence update
    And I provide a reason for latest update
    And I use the already existing items as the base
    Then Despite the fields modified I successfully update the svernik and see properly sorted updated version of it
    Then I see the not modified fields remain the same
