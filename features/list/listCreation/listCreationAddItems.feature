Feature: Adding items on the List Creation page

  Background:
    When I open "List Creation" page

  Scenario: Adding single item input
    When All necessary elements are on the "List Creation" page
    And I ensure the tools panel is open
    And I press the "add list item" button
    And I ensure the tools panel does not disturb
    And I hover "list title" input
    Then I expect to see the "first" item input enabled
    Then I expect to see the "automatic" item input enabled
    Then I expect to see no other elements

  Scenario: Adding items inputs more than fit into screen
    When I ensure the tools panel is open
    And I add list items till scroll appears plus one item input
    And I ensure the tools panel does not disturb
    Then I expect to see the last added item input
    Then I expect not to see the first item input
    Then I expect to see the "list title" input enabled
    Then I expect to see the "list purpose" input enabled
    Then I expect to see the "save" button enabled
    And I ensure the tools panel is open
    Then I expect to see the "add list item" button enabled
    And I ensure the tools panel does not disturb

  @heavy
  Scenario: Adding items inputs to the limit
    When I ensure the tools panel is open
    And I add list items to their limit
    And I ensure the tools panel does not disturb
    Then I expect to see the warning about items inputs limit reached
    And I ensure the tools panel is open
    Then I expect to see the "add list item" button disabled
    And I ensure the tools panel does not disturb
    Then I expect not to see the "automatic" item input
    And I focus "some item" input
    And I open the corresponding list item context menu
    Then I expect to see the "add item above" menu item disabled
    Then I expect to see the "add item below" menu item disabled
    Then I reviewed all item addition method of the list page
