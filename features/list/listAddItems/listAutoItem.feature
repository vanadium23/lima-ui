Feature: Seeing the basis of the automatically added item

  Background:
    When I open "List Creation" page

  Scenario: Seeing the new item automatically added
    When I type some text with length less or equal to the one of "first item" input limit
    Then I expect to have the "automatic" item input enabled

  Scenario: Not seeing the automatically added item when the first item is removed
    When I type some text with length less or equal to the one of "first item" input limit
    And I hover "first list item"
    And I press the "open context menu first item" button
    And I press the "remove first list item" menu item
    Then I expect not to see the "automatic" item input

  Scenario: Seeing the automatically added item removed when the previous is cleared
    When I type some text with length less or equal to the one of "first item" input limit
    Then I expect to have the "automatic" item input enabled
    And I clear the "first item" input
    Then I expect not to see the "automatic" item input

  @heavy
  Scenario: Reaching limit via the automatically added item
    When I add list items to their limit via automatically added item
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

  Scenario: Restoring automatically added item after its removal
    When I type some text with length less or equal to the one of "first item" input limit
    And I hover "automatic list item"
    And I press the "open context menu for automatic list item" button
    And I press the visible "remove list item" menu item
    Then I expect not to see the "automatic" item input
    And I type some text with length less or equal to the one of "first item" input limit
    Then I expect to have the "automatic" item input enabled

  Scenario: Automatically added item is not restored when modifying the not last list item
    When I type some text with length less or equal to the one of "first item" input limit
    And I type some text with length less or equal to the one of "automatic item" input limit
    And I hover "automatic list item"
    And I press the "open context menu for automatic list item" button
    And I press the visible "remove list item" menu item
    And I type some text with length less or equal to the one of "first item" input limit
    Then I expect not to see the "automatic" item input

  Scenario: The first item keeps its focus after cleaning it
    When I type some text with length less or equal to the one of "first item" input limit
    And I clear the "first item" input
    Then I expect to be focused on the "first item" input
