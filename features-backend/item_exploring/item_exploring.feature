@ts-implemented
Feature: Exploring an item

  Item — is a single life-tested brilliant.

  Background:
  Given I am "user@example.com"


  Scenario: Exploring item
    When I ask to show me a specific item
    Then It's item
    Then I see item's id
    Then I see item's version id
    Then I see item's older version id in its default state
    Then I see item's newer version id in its default state
    Then I see item's URL
    Then I see item's type
    Then I see item's date and time of creation
    Then I see its content
    Then I see present or empty item's note
    Then I see present or empty item's purpose
    Then I see present or empty item's reason for latest update
    Then I see item's original list
    Then I see item's exported data
    Then I see item's user id
    Then I overviewed all fields in item


  Scenario: Exploring item right after creation
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide an item with correct content
    Then I successfully create a properly sorted svernik
    Then Created list contains one item
    Then I ask to show me item by the id
    And I want to do the precise investigation of the item
    Then item contains the id
    Then item contains the version id
    Then item contains the older version id in its default state
    Then item contains the newer version id in its default state
    Then item contains the type
    Then item contains the date and time of creation
    Then item contains the URL
    Then item contains the provided content
    Then item contains purpose in its default state
    Then item contains reason for latest update in its default state
    Then item contains note in its default state
    Then item contains the original list
    Then item contains the exported data
    Then item contains the user id
    Then I overviewed all fields in item

  Scenario: Exploring several items right after creation
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several items with correct content
    Then I successfully create a properly sorted svernik
    Then I ask to show me all items by their ids
    Then Items contain the id
    Then Items contain the version id
    Then Items contain the older version id in its default state
    Then Items contain the newer version id in its default state
    Then Items contain the URL
    Then Items contain the type
    Then Items contain the date and time of creation
    Then Items contain the provided content
    Then Items contain purpose in its default state
    Then Items contain reason for latest update in its default state
    Then Items contain note in its default state
    Then Items contain the original list
    Then Items contain the exported data
    Then Items contain the user id
    Then I overviewed all fields in items


  Scenario: Exploring item gives the most recent version of it
  Absence of a newer version means that the current one is the newest.
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide an item with correct content
    Then I successfully create a properly sorted svernik
    Then The last item is the required one
    When I want to do essence update
    And I provide a reason for latest update
    Then I successfully update the item and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then I ask to show me item by the id
    And I want to do the precise investigation of the item
    Then item contains the newer version id in its default state

  Scenario: Attempting to explore the unavailable item
    When I ask to show me the unavailable item
    Then my attempt to explore an item fails
    Then I see the following error: "item-not-found"
    Then I see the unavailable item's id in the error message
