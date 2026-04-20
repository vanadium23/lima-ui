Feature: Imported groups drag and drop functionality

  @some-lists
  Scenario: Reorder imported groups with drag and drop
    Given I clear all data
    When I add a list
    And I add a list
    And I add a list
    And I add a list
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    And I check the "second import list" checkbox
    And I check the "third import list" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    Then I expect to see 3 imported groups in the list
    When I press the "save" button
    And I wait for the list update to complete
    When I start dragging the "third" imported group
    And I drag the imported group on the "second" imported group
    And I complete the drag operation
    Then I expect to see the dragged imported group on the "second" position
    Then I expect to see the "save" button enabled
