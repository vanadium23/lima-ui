Feature: List items drag and drop functionality

  Scenario: Display dragging overlay with correct content while dragging an item
    When I open List Creation page
    And I add list items till scroll appears plus one item input
    And I type some text to all items inputs
    And I scroll to the "first list item"
    And I start dragging the "first" list item
    Then I expect to see the dragged item overlay with item content
    Then I expect to see the drop indicator showing where the item will be placed
    And I complete the drag operation
