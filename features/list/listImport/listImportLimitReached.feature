Feature: Reaching items limit through importing

  Background:
    Given I clear all data
    When I add a list
    And I add a list
    And I open "My Lists" page

  @heavy
  @some-lists
  Scenario: Attempting to edit imported group that would exceed limit shows error
    When I press on the "first" list stripe
    And I ensure the tools panel is open
    And I press the "add list item" button
    And I press the "add list item" button
    And I press the "add list item" button
    And I ensure the tools panel does not disturb
    And I fill all items inputs with their index
    And I press the "save" button
    And I wait for the list update to complete
    And I open "My Lists" page
    And I press on the "second" list stripe
    And I ensure the tools panel is open
    And I add list items to one below their limit
    And I fill all items inputs with their index
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    And I press the "save" button
    And I wait for the list update to complete
    When I hover the first imported group
    And I press the visible "open context menu imported group" button
    And I press the visible "edit imported group" menu item
    Then I expect to see the "edit import" dialog modal box
    When I press the "edit imported group" button
    Then I expect to see the "limit exceeded" error

  @heavy
  @some-lists
  Scenario: Editing imported group without exceeding limit succeeds
    When I press on the "first" list stripe
    And I type the following text into the "first item" input: "Imported List First Item"
    And I press the "save" button
    And I wait for the list update to complete
    And I open "My Lists" page
    And I press on the "second" list stripe
    And I ensure the tools panel is open
    And I add list items to one below their limit
    And I fill all items inputs with their index
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    When I press the "import" button
    And I ensure the tools panel does not disturb
    And I press the "save" button
    And I wait for the list update to complete
    When I hover the first imported group
    And I press the visible "open context menu imported group" button
    And I press the visible "edit imported group" menu item
    Then I expect to see the "edit import" dialog modal box
    When I press the "edit imported group" button
    Then I expect to see the "last item" input to have the following text: "Imported List First Item"

  @heavy
  @some-lists
  Scenario: Removing the on-limit imported group hides limit reached warning
    When I press on the "second" list stripe
    And I ensure the tools panel is open
    And I add list items to one below their limit
    And I fill all items inputs with their index
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    And I press the "save" button
    And I wait for the list update to complete
    Then I expect to see the warning about items inputs limit reached
    When I hover the first imported group
    And I press the visible "open context menu imported group" button
    And I press the visible "remove imported group" menu item
    Then I expect not to see the warning about items inputs limit reached

  @heavy
  @some-lists
  Scenario: Reaching items limit exclusively via importing whole lists
    When I add lists to their limit
    And I open "My Lists" page
    And I press on the "first" list stripe
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I check the first 99 import list checkboxes
    And I press the "import" button
    And I ensure the tools panel does not disturb
    Then I expect to see 99 imported groups in the list
    And I expect to see the warning about items inputs limit reached
    When I press the "save" button
    And I wait for the list update to complete
    Then I expect to see the warning about items inputs limit reached
