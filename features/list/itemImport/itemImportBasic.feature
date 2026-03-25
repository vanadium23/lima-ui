Feature: Importing items from another list

  Background:
    Given I clear all data
    When I add a list
    And I add a list

  @zero-lists
  Scenario: User imports item via tools panel button
    When I type the following text into the "first item" input: "Imported List First Item"
    And I type the following text into the "automatic item" input: "Imported List Second Item"
    And I press the "save" button
    And I wait for the list update to complete
    And I open "My Lists" page
    And I press on the "second" list stripe
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    Then I expect to see the "import" button disabled
    When I press the "first import list" list stripe for import
    And I check the "first import item" checkbox
    Then I expect to see the "import" button enabled
    When I uncheck the "first import item" checkbox
    Then I expect to see the "import" button disabled
    When I check the "first import item" checkbox
    And I press the "import" button
    Then I expect not to see the "import" dialog modal box
    And I ensure the tools panel does not disturb
    Then I expect to see 1 imported group in the list
    Then I expect to see 1 item in the first imported group
    Then I expect the first item in the first imported group to contain the following text: "Imported List First Item"
    Then I expect to see the "save" button enabled
    When I press the "save" button
    And I wait for the list update to complete
    And I refresh the page
    Then I expect to see 1 imported group in the list
    When I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I press the "first import list" list stripe for import
    Then I expect to see the "first import item" checkbox
    When I press the "cancel import" button
    And I ensure the tools panel does not disturb
    And I press the first imported group name link
    When I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    Then I expect to see the "first import list" checkbox

  @some-lists
  Scenario: User imports multiple items in position order
    When I open "My Lists" page
    And I press on the "first" list stripe
    And I type the following text into the "first item" input: "First Item Text"
    And I type the following text into the "automatic item" input: "Second Item Text"
    And I press the "save" button
    And I wait for the list update to complete
    And I open "My Lists" page
    And I press on the "second" list stripe
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I press the "first import list" list stripe for import
    And I check the "second import item" checkbox
    And I check the "first import item" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    Then I expect to see 1 imported group in the list
    Then I expect to see 2 items in the first imported group
    Then I expect the item #1 in the first imported group to contain the following text: "First Item Text"
    Then I expect the item #2 in the first imported group to contain the following text: "Second Item Text"
    Then I expect to see the "save" button enabled
    When I press the "save" button
    And I wait for the list update to complete
    And I refresh the page
    Then I expect to see 1 imported group in the list
    Then I expect to see 2 items in the first imported group
    Then I expect the item #1 in the first imported group to contain the following text: "First Item Text"
    Then I expect the item #2 in the first imported group to contain the following text: "Second Item Text"
