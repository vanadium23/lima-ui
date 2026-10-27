@ts-implemented
Feature: Provide information about where items are exported via exported data

  The exported data shows in which other lists the current item has been exported.
  This field is an array that contains information about target lists where imports happen.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several correct items
    Then I successfully create a properly sorted svernik
    And I remember this list as the source list
    And I create the first target list that imports the first item of the source list
    And I create the second target list that imports the first item of the source list

  Scenario: Successfully explore list with several imports
    And I explore the source list
    Then The first item contains exported data with both target lists
    And I see first target list in item's exported data
    And I see second target list in item's exported data

  Scenario: Successfully explore list imports after removing the connections
    And I remove all imports from the first target list
    And I explore the source list
    Then The first item contains exported data with single target list
    And I do not see first target list in item's exported data
    And I see second target list in item's exported data

  Scenario: List has exported items when its items are imported to other lists
    When I create a new list
    And I create the following number of lists: 3
    And I add items from the original list to other lists
    When I ask for the original list
    Then The original list has exported items property equal to true

  Scenario: List has no exported items when importing list removes the items
    When I create a new list
    And I create the following number of lists: 1
    And I add items from the original list to other lists
    When I ask for the original list
    Then The original list has exported items property equal to true
    When I remove all imports from the prepared lists
    And I ask for the original list
    Then The original list has exported items property equal to false

  Scenario: List has no exported items when importing list is deleted
    When I create a new list
    And I create the following number of lists: 1
    And I add items from the original list to other lists
    When I ask for the original list
    Then The original list has exported items property equal to true
    When I delete all prepared lists
    And I ask for the original list
    Then The original list has exported items property equal to false

  Scenario: List has no exported items when it imports other items
    When I create a new list
    And I create the following number of lists: 1
    And I add items from the original list to other lists
    When I ask for the original lists
    Then The original lists have exported items property equal to false

  # TODO: Написать сценарий на случай удаления пунктов из системы.
