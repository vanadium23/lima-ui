Feature: Importing elements from another list

  Background:
    Given I clear all data

  @zero-lists
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
    When I press the "cancel import" button
    And I ensure the tools panel does not disturb
    When I press the first imported group name link
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    Then I expect to see the "import" dialog loading
    Then I expect to see the "import" dialog empty message

  @some-lists
  Scenario: User imports multiple lists in position order
    When I add a list
    And I add a list
    And I add a list
    And I add a list
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I check the "third import list" checkbox
    And I check the "first import list" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    Then I expect to see 2 imported groups in the list
    Then I expect the imported group #1 name to match the import list #1 name
    Then I expect the imported group #2 name to match the import list #3 name
    Then I expect to see the "save" button enabled
    When I press the "save" button
    And I wait for the list update to complete
    And I refresh the page
    Then I expect to see 2 imported groups in the list
    Then I expect the imported group #1 name to match the import list #1 name
    Then I expect the imported group #2 name to match the import list #3 name

  @some-lists
  Scenario: User imports list above via context menu
    When I add a list
    And I add a list
    And I ensure the tools panel is open
    And I press the "add list item" button
    And I ensure the tools panel does not disturb
    When I hover "first list item"
    And I press the "open context menu first item" button
    And I press the visible "import item above" menu item
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    And I press the "import" button
    Then I expect not to see the "import" dialog modal box
    And I ensure the tools panel does not disturb
    Then I expect to see 1 imported group in the list
    Then I expect the imported group to be above the first list item

  @some-lists
  Scenario: User imports list below via context menu
    When I add a list
    And I add a list
    And I ensure the tools panel is open
    And I press the "add list item" button
    And I ensure the tools panel does not disturb
    When I hover "first list item"
    And I press the "open context menu first item" button
    And I press the visible "import item below" menu item
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    And I press the "import" button
    Then I expect not to see the "import" dialog modal box
    And I ensure the tools panel does not disturb
    Then I expect to see 1 imported group in the list
    Then I expect the imported group to be below the first list item
