Feature: Changes in exported list are reflected in importing list

  Background:
    Given I clear all data
    And I add a list
    And I add a list
    When I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    When I press the "save" button
    And I wait for the list update to complete
    And I press the first imported group name link

  @some-lists
  Scenario: Adding an item to exported list is reflected in importing list
    When I ensure the tools panel is open
    And I press the "add list item" button
    And I ensure the tools panel does not disturb
    And I type some text with length less or equal to the one of "last item" input limit
    And I press the "save" button
    And I wait for the list update to complete
    When I press the "exported to" button
    And I press the "first exported to list" in the exported to list
    Then I expect to see 1 imported group in the list
    Then I expect to see 2 items in the first imported group

  @some-lists
  Scenario: Editing an item in exported list is reflected in importing list
    When I type some text with length less or equal to the one of "first item" input limit
    And I press the "save" button
    And I wait for the list update to complete
    When I press the "exported to" button
    And I press the "first exported to list" in the exported to list
    Then I expect to see 1 imported group in the list
    Then I expect to see 1 item in the first imported group
    And I expect the first item in the first imported group to contain the text from "first item" input

  @some-lists
  Scenario: Removing an item from exported list is reflected in importing list
    When I ensure the tools panel is open
    And I press the "add list item" button
    And I press the "add list item" button
    And I ensure the tools panel does not disturb
    And I type some text with length less or equal to the one of "second item" input limit
    And I type some text with length less or equal to the one of "last item" input limit
    And I press the "save" button
    And I wait for the list update to complete
    When I press the "exported to" button
    And I press the "first exported to list" in the exported to list
    Then I expect to see 1 imported group in the list
    Then I expect to see 3 items in the first imported group
    And I press the first imported group name link
    When I hover "third list item"
    And I press the "open context menu third item" button
    And I press the visible "remove list item" menu item
    And I press the "save" button
    And I wait for the list update to complete
    When I press the "exported to" button
    And I press the "first exported to list" in the exported to list
    Then I expect to see 1 imported group in the list
    Then I expect to see 2 items in the first imported group
