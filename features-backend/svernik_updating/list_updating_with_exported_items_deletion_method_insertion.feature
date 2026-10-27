@ts-implemented
Feature: Inserting exported item copies into importing lists via update

  Background:
    Given I am "user@example.com"
    When I create a new list

  Scenario: Deleting an exported item from the original list inserts its copy into other lists
    And I create the following number of lists: 1
    And I add items from the original list to other lists
    When I want to update the original list
    And I use the already existing items as the base
    And I delete an exported item from the original list via "insertion"
    And I provide a reason for latest update
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    When I ask for the original lists
    Then I do not see the deleted exported item in the original lists items
    Then I see the deleted exported item recreated in the original lists items the following number of times: 1
    Then I see that the recreated exported items have unique ids

  Scenario: Deleting an exported item when at the limit of lists inserts its copy into other lists
    And I create the following number of lists: pre-limit
    And I add items from the original list to other lists
    When I want to update the original list
    And I use the already existing items as the base
    And I delete an exported item from the original list via "insertion"
    And I provide a reason for latest update
    Then I successfully update the svernik and see properly sorted updated version of it
    When I ask for the original lists
    Then I do not see the deleted exported item in the original lists items
    Then I see the deleted exported item recreated in the original lists items the following number of times: 1
    Then I see that the recreated exported items have unique ids

  Scenario: Deleting an exported item imported multiple times into a list inserts copies into all places
    And I create the following number of lists: 1
    And I add items from the original list to other lists
    And I ensure the following number of items of the prepared lists: 5
    And I add items from the original list to other lists
    When I want to update the original list
    And I use the already existing items as the base
    And I delete an exported item from the original list via "insertion"
    And I provide a reason for latest update
    Then I successfully update the svernik and see properly sorted updated version of it
    When I ask for the original lists
    Then I do not see the deleted exported item in the original lists items
    Then I see the deleted exported item recreated in the original lists items the following number of times: 2
    Then I see that the recreated exported items have unique ids

  Scenario: Deletion and insertion work together when deleting multiple exported items
    And I create the following number of lists: 1
    And I add items from the original list to other lists
    And I ensure the following number of items of the original list: 3
    When I want to update the original list
    And I use the already existing items as the base
    And I remove two exported items from the original list: one via "deletion" and one via "insertion"
    And I provide a reason for latest update
    Then I successfully update the svernik and see properly sorted updated version of it
    When I ask for the original lists
    Then I do not see the deleted exported item removed via "deletion" in the original lists items
    Then I see the deleted exported item removed via "insertion" recreated in the original lists items the following number of times: 1
    Then I see that the recreated exported items removed via "insertion" have unique ids
