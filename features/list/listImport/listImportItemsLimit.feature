Feature: Importing elements when items limit is reached

  Background:
    Given I clear all data

  @heavy
  @zero-lists
  Scenario: User with pre-limit items count selects lists for import and reaches the limit
    When I add a list
    And I add a list
    And I add a list
    And I open "My Lists" page
    And I press on the "first" list stripe
    And I ensure the tools panel is open
    And I add list items to one below their limit
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    Then I expect the import counter to show limit reached
    Then I expect to see the "import" button enabled
    When I check the "second import list" checkbox
    Then I expect the import counter to show limit exceeded
    Then I expect to see the "import" button disabled
    When I uncheck the "second import list" checkbox
    Then I expect the import counter to show limit reached
    Then I expect to see the "import" button enabled
    When I press the "import" button
    And I ensure the tools panel does not disturb
    Then I expect to see 1 imported group in the list
    Then I expect to see the warning about items inputs limit reached
