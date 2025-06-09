Feature: List items drag and drop functionality

  Background:
    When I clear all data
    And I add a list
    When I type the following text into the "list title": "Small title and purpose"
    And I type the following text into the "list purpose": "To avoid flakiness on mobile"
    And I ensure the tools panel is open
    And I add list items till scroll appears plus one item input
    And I ensure the tools panel does not disturb
    And I fill all items inputs with their index
    And I press the "save" button
    And I wait for the list update to complete
    And I scroll to the "first list item"

  Scenario: Display dragging overlay with correct content while dragging an item
    When I start dragging the "first" list item
    And I drag to 50 from left and 50 from top
    Then I expect to see the dragged item overlay with item content
    Then I expect to see the drop indicator showing where the item will be placed

  Scenario: Reorder list items with drag and drop
    When I start dragging the "third" list item
    And I drag the item on the "second" item
    And I complete the drag operation
    Then I expect to see the dragged list item on the "second" position
    Then I expect to see the "save" button enabled

  Scenario: Restoring list items order with drag and drop
    When I start dragging the "third" list item
    And I drag the item on the "second" item
    And I complete the drag operation
    And I start dragging the "second" list item
    And I drag the item on the "third" item
    And I complete the drag operation
    Then I expect to see the "save" button disabled

  Scenario: Dragging list item several times
    When I start dragging the "third" list item
    And I drag the item on the "first" item
    And I complete the drag operation
    Then I expect to see the dragged list item on the "first" position
    And I start dragging the "first" list item
    And I drag the item on the "seventh" item
    And I complete the drag operation
    Then I expect to see the dragged list item on the "seventh" position
    And I start dragging the "seventh" list item
    And I drag the item on the "second" item
    And I complete the drag operation
    Then I expect to see the dragged list item on the "second" position
    And I start dragging the "second" list item
    And I drag the item on the "fifth" item
    And I complete the drag operation
    Then I expect to see the dragged list item on the "fifth" position
    And I start dragging the "fifth" list item
    And I drag the item on the "eighth" item
    And I complete the drag operation
    Then I expect to see the dragged list item on the "eighth" position
    And I start dragging the "eighth" list item
    And I drag the item on the "third" item
    And I complete the drag operation
    Then I expect to see the dragged list item on the "third" position
    And I start dragging the "third" list item
    And I drag the item on the "ninth" item
    And I complete the drag operation
    Then I expect to see the dragged list item on the "ninth" position
    And I expect to see the "save" button enabled

  Scenario: Drag item to the start of a list
    When I start dragging the "third" list item
    And I drag the item on the "first" item
    And I complete the drag operation
    Then I expect to see the dragged list item on the "first" position

  Scenario: Drag item after the automatic item
    When I start dragging the "first" list item
    And I drag the item on the "automatic" item
    And I complete the drag operation
    And I scroll to the bottom of the list items
    Then I expect to see the dragged list item on the "last" position
    Then I expect not to see the "automatic" item input

  Scenario: Automatic item remains if dragged before it
    When I start dragging the "first" list item
    And I drag the item on the "second" item
    And I complete the drag operation
    And I scroll to the bottom of the list items
    Then I expect to see the "automatic" item input enabled

  Scenario: Drag item after automatic item when last item was deleted and recreated
    When I ensure the tools panel is open
    And I add list items to their limit
    And I ensure the tools panel does not disturb
    And I hover "on the last list item of the limit"
    And I press the "open context menu for last list item of the limit" button
    And I press the visible "remove list item" menu item
    And I type some text with length less or equal to the one of "last item" input limit
    And I start dragging the "last" list item
    And I drag the item on the "automatic" item
    And I complete the drag operation
    And I scroll to the bottom of the list items
    Then I expect to see the dragged list item on the "last" position
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
