Feature: Printing lists with imported items (item-level import)

  Background:
    Given I clear all data
    When I add a list
    And I add a list

  @some-lists
  Scenario: Imported items are visible on the print page
    And I type the following text into the "first item" input: "Imported List First Item"
    And I type the following text into the "automatic item" input: "Imported List Second Item"
    And I press the "save" button
    And I wait for the list update to complete
    And I open "My Lists" page
    And I press on the "second" list stripe
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I press the "first import list" list stripe for import
    And I check the "first import item" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    And I press the "save" button
    And I wait for the list update to complete
    And I ensure the tools panel is open
    And I press the print list button and wait for the new tab with printing stub
    Then I expect to see the "second" item on print page to have the following text: "Imported List First Item"
