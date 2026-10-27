@ts-implemented
Feature: Deleting exported items from importing lists via update using the deletion method

  Background:
    Given I am "user@example.com"
    When I create a new list

  Scenario: Deleting an exported item from the original list removes it from other lists
    And I create the following number of lists: 1
    And I add items from the original list to other lists
    When I want to update the original list
    And I use the already existing items as the base
    And I delete an exported item from the original list via "deletion"
    And I provide a reason for latest update
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    When I ask for the original lists
    Then I do not see the deleted exported item in the original lists items

  Scenario: Deleting an exported item when at the limit of lists removes it from other lists
    And I create the following number of lists: pre-limit
    And I add items from the original list to other lists
    When I want to update the original list
    And I use the already existing items as the base
    And I delete an exported item from the original list via "deletion"
    And I provide a reason for latest update
    Then I successfully update the svernik and see properly sorted updated version of it
    When I ask for the original lists
    Then I do not see the deleted exported item in the original lists items

  Scenario: Deleting an exported item imported multiple times into a list removes it from all places
    And I create the following number of lists: 1
    And I add items from the original list to other lists
    And I ensure the following number of items of the prepared lists: 5
    And I add items from the original list to other lists
    When I want to update the original list
    And I use the already existing items as the base
    And I delete an exported item from the original list via "deletion"
    And I provide a reason for latest update
    Then I successfully update the svernik and see properly sorted updated version of it
    When I ask for the original lists
    Then I do not see the deleted exported item in the original lists items
