Feature: List items drag and drop with autoscroll functionality

  Background:
    When I clear all data
    And I add a list
    And I press the "add list item" button 30 times
    And I fill all items inputs with their index
    And I press the "save" button
    And I wait for the list update to complete

  Scenario: Drag first item to the end of the list with automatic scroll
    When I scroll to the "first list item"
    And I start dragging the "first" list item
    And I drag the item on the "automatic" item
    And I wait for "scroll completion" for the following number of seconds: 1
    # Этот шаг необходим для того, чтобы ещё раз сработал детектор
    # коллизий и пересчиталось положение приземления пункта.
    # Шаг этот — костыль, но есть подозрение, что для его
    # исправления нужно исправлять библиотеку.
    And I drag to 250 from left and -2 from top
    And I complete the drag operation
    Then I expect to see the dragged list item on the "last" position

  Scenario: Drag last item to the beginning of the list with automatic scroll
    And I scroll to the bottom of the list items
    And I start dragging the "last" list item
    And I drag the item on the "first" item
    And I wait for "scroll completion" for the following number of seconds: 1
    And I drag to 250 from left and 1 from top
    And I complete the drag operation
    Then I expect to see the dragged list item on the "first" position
