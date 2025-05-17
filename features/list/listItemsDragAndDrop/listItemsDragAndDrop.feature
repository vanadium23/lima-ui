Feature: List items drag and drop functionality

  Background:
    When I clear all data
    And I add a list
    And I add list items till scroll appears plus one item input
    And I fill all items inputs with their index
    And I press the "save" button
    And I wait for the list update to complete
    And I scroll to the "first list item"

  Scenario: Display dragging overlay with correct content while dragging an item
    And I start dragging the "first" list item
    And I drag to 50 from left and 50 from top
    Then I expect to see the dragged item overlay with item content
    Then I expect to see the drop indicator showing where the item will be placed

  Scenario: Reorder list items with drag and drop
    And I start dragging the "third" list item
    And I drag the item on the "second" item
    And I complete the drag operation
    Then I expect to see the dragged list item on the "second" position
    Then I expect to see the "save" button enabled

  Scenario: Restoring list items order with drag and drop
    And I start dragging the "third" list item
    And I drag the item on the "second" item
    And I complete the drag operation
    And I start dragging the "second" list item
    And I drag the item on the "third" item
    And I complete the drag operation
    Then I expect to see the "save" button disabled

  Scenario: Drag item to the start of a list
    And I start dragging the "third" list item
    And I drag the item on the "first" item
    And I complete the drag operation
    Then I expect to see the dragged list item on the "first" position

  Scenario: Drag item to the end of a list
    And I start dragging the "first" list item
    And I drag the item on the "automatic" item
    And I complete the drag operation
    And I scroll to the bottom of the list items
    Then I expect to see the dragged list item last
    Then I expect not to see the "automatic" item input
