@ts-implemented
Feature: Exploring a svernik

  Svernik — is a raceme of experience.

  Svernik consists of the following fields:
  - Name, required. Name of a svernik.
  - Items, optional, default empty ordered sequence. An ordered sequence of items combining a svernik.
  - Reason for existence, optional, default "". Text describing a goal at which list aims.
  - Note, optional, default "". Text providing some additional information about a svernik.
  - Reason for latest update, conditionally optional, default "". Text describing a reason for latest update.
  - Mark of the absence of a reason for latest update, conditionally optional, default true.
  The idea behind the reasoning update or clearly stating the absence of a cause is that you learn, gain experience,
  which sometimes takes years or a high price, and you want to capture why the update is necessary.

  Background:
    Given I am "user@example.com"

  Scenario: Exploring the already existing list
    When I ask to show me a specific list
    Then It's a list
    Then I see list's id
    Then I see list's version id equal to the id
    Then I see list's older version id
    Then I see list's newer version id
    Then I see list's type
    Then I see list's user id
    Then I see list's date and time of creation
    Then I see list's URL
    Then I see list's name
    Then I see list's purpose
    Then I see present or empty list's note
    Then I see list's reason for latest update or mark of the absence of a reason for latest update
    Then I see a plain list of items
    Then I can see referenced lists among items
    Then I see list's exported data
    Then I overviewed all fields in a list

  Scenario: Exploring svernik right after creation
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several correct items
    Then I successfully create a properly sorted svernik
    Then I ask to show me a list by the id
    And I want to do the precise investigation of the svernik
    Then Svernik contains the id
    Then Svernik contains the version id equal to the id
    Then Svernik contains the older version id in its default state
    Then Svernik contains the newer version id in its default state
    Then Svernik contains the type
    Then Svernik contains date and time of creation
    Then Svernik contains the URL
    Then Svernik contains the provided name
    Then Svernik contains the provided purpose
    Then List contains several correct items
    Then Svernik contains reason for latest update in its default state
    Then Svernik contains mark of the absence of a reason for latest update in its default state
    Then Svernik contains note in its default state
    Then List contains exported data in its default state
    Then List contains user id
    Then I overviewed all fields in a list

  Scenario: Exploring svernik gives the most recent version of it
  Absence of a newer version means that the current one is the newest.
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several correct items
    Then I successfully create a properly sorted svernik
    When I want to do essence update
    And I provide a reason for latest update
    And I provide another name
    And I provide another purpose
    And I provide several other correct items
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then I ask to show me a list by the id
    And I want to do the precise investigation of the svernik
    Then Svernik contains the newer version id in its default state

  Scenario: Attempting to explore the deleted list
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several correct items
    Then I successfully create a properly sorted svernik
    When I prepare created svernik for consequent actions
    Then I successfully delete the list and see properly sorted deletion result
    Then I see the following HTTP status code: 200
    Then I see the deleted list id in the deletion result message
    Then I ask to show me list by the id
    Then my attempt to explore a svernik fails
    Then I see the following error: "list-not-found"

  Scenario: Attempting to explore the unavailable svernik
    When I ask to show me the unavailable svernik
    Then my attempt to explore a svernik fails
    Then I see the following error: "list-not-found"
    # TODO: Обработать и для других случаев это неучтённое ранее ожидание.
    Then I see the unavailable svernik's id in the error message
