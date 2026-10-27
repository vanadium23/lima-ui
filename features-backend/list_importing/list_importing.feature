@ts-implemented
Feature: Provide information about where lists are exported via exported data

  The exported data shows in which other lists the current list has been exported.
  This field is an array that contains information about target lists where imports happen.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several correct items
    Then I successfully create a properly sorted svernik
    And I remember this list as the source list
    And I create the first target list that imports the source list

  Scenario: Successfully explore list with several imports
    And I create the second target list that imports the source list
    And I explore the source list
    Then List contains exported data with both target lists
    And I see first target list in exported data
    And I see second target list in exported data

  Scenario: Successfully explore list imports after removing the connections
    And I create the second target list that imports the source list
    And I remove all imports from the first target list
    And I explore the source list
    Then List contains exported data with single target list
    And I do not see first target list in exported data
    And I see second target list in exported data

  Scenario: Successfully explore list imports after target updates
    And I update the first target list with another name
    And I explore the source list
    Then List contains exported data with single target list
    And I see updated first target list in exported data
