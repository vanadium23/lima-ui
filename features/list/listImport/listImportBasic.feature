Feature: Importing elements from another list

  Background:
    And I clear all data

  Scenario: User imports list via tools panel button
    When I add a list
    And I add a list
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    Then I expect to see the "import" button disabled
    When I check the "first import list" checkbox
    Then I expect to see the "import" button enabled
    When I uncheck the "first import list" checkbox
    Then I expect to see the "import" button disabled
    When I check the "first import list" checkbox
    And I press the "import" button
    Then I expect not to see the "import" dialog modal box
    And I ensure the tools panel does not disturb
    Then I expect to see 1 imported group in the list
    Then I expect to see at least 1 imported item in the first imported group
    Then I expect the first imported group name to match the first import list name
    Then I expect to see the "save" button enabled
    When I press the "save" button
    And I wait for the list update to complete
    And I refresh the page
    Then I expect to see 1 imported group in the list
    When I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    Then I expect to see the "first import list" checkbox
