Feature: Importing elements from another list

  Background:
    Given I clear all data
    When I add a list
    And I add a list

  @zero-lists
  Scenario: User imports list via tools panel button
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
    Then I expect to see 1 item in the first imported group
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
    And I ensure the tools panel is open
    And I press the "add list item" button
    And I ensure the tools panel does not disturb
    When I hover "first list item"
    And I press the "open context menu first item" button
    And I press the visible "import element above" menu item
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    And I press the "import" button
    Then I expect not to see the "import" dialog modal box
    And I ensure the tools panel does not disturb
    Then I expect to see 1 imported group in the list
    Then I expect the imported group to be above the first list item

  @some-lists
  Scenario: User imports list below via context menu
    And I ensure the tools panel is open
    And I press the "add list item" button
    And I ensure the tools panel does not disturb
    When I hover "first list item"
    And I press the "open context menu first item" button
    And I press the visible "import element below" menu item
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    And I press the "import" button
    Then I expect not to see the "import" dialog modal box
    And I ensure the tools panel does not disturb
    Then I expect to see 1 imported group in the list
    Then I expect the imported group to be below the first list item

  @some-lists
  Scenario: Pressing "Go to source list" navigates to the imported list page
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    And I press the "save" button
    And I wait for the list update to complete
    When I hover the first imported group
    And I press the visible "open context menu imported group" button
    And I press the visible "go to source list" menu item
    Then I expect to see the "exported to" button

  @some-lists
  Scenario: Pressing "Remove" button removes the imported group and enables "Save" button
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    And I press the "save" button
    And I wait for the list update to complete
    When I press the first imported group name link
    And I save the current page URL
    And I go back to the previous page
    When I hover the first imported group
    And I press the visible "open context menu imported group" button
    And I press the visible "remove imported group" menu item
    Then I expect to see 0 imported groups in the list
    Then I expect to see the "save" button enabled
    And I press the "save" button
    And I wait for the list update to complete
    When I navigate to the saved page URL
    Then I expect not to see the "exported to" button

  @some-lists
  Scenario: Pressing "Edit" button in context menu shows edit import dialog
    And I ensure the tools panel is open
    When I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    And I press the "save" button
    And I wait for the list update to complete
    And I press the first imported group name link
    And I ensure the tools panel is open
    And I press the "add list item" button
    And I press the "add list item" button
    And I ensure the tools panel does not disturb
    And I type the following text into the "first item" input: "First item text"
    And I type the following text into the "second item" input: "Second item text"
    And I type the following text into the "third item" input: "Third item text"
    And I press the "save" button
    And I wait for the list update to complete
    And I save the current page URL
    When I press the "exported to" button
    And I press the "first exported to list" in the exported to list
    When I hover the first imported group
    And I press the visible "open context menu imported group" button
    And I press the visible "edit imported group" menu item
    Then I expect to see the "edit import" dialog modal box
    When I press the "edit imported group" button
    Then I expect not to see the "edit import" dialog modal box
    Then I expect to see 0 imported groups in the list
    Then I expect to see the "second item" input to have the following text: "First item text"
    Then I expect to see the "third item" input to have the following text: "Second item text"
    Then I expect to see the "forth item" input to have the following text: "Third item text"
    Then I expect to see the "save" button enabled
    And I press the "save" button
    And I wait for the list update to complete
    And I refresh the page
    Then I expect to see 0 imported groups in the list
    When I navigate to the saved page URL
    Then I expect not to see the "exported to" button

  @some-lists
  Scenario: Pressing "Add item above" on imported group context menu adds item above the group
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    Then I expect to see 1 imported group in the list
    When I hover the first imported group
    And I press the visible "open context menu imported group" button
    And I press the visible "add item above" menu item
    Then I expect the list item to be above the first imported group

  @some-lists
  Scenario: Pressing "Add item below" on imported group context menu adds item below the group
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    Then I expect to see 1 imported group in the list
    When I hover the first imported group
    And I press the visible "open context menu imported group" button
    And I press the visible "add item below" menu item
    Then I expect the list item to be below the first imported group

  @some-lists
  Scenario: Pressing "Import above" on imported group context menu adds imported group above
    And I add a list
    And I add a list
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I check the "third import list" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    Then I expect to see 1 imported group in the list
    When I hover the first imported group
    And I press the visible "open context menu imported group" button
    And I press the visible "import element above" menu item
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    Then I expect to see 2 imported groups in the list
    Then I expect the second imported group to be above the first imported group

  @some-lists
  Scenario: Pressing "Import below" on imported group context menu adds imported group below
    And I add a list
    And I add a list
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I check the "third import list" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    Then I expect to see 1 imported group in the list
    When I hover the first imported group
    And I press the visible "open context menu imported group" button
    And I press the visible "import element below" menu item
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    Then I expect to see 2 imported groups in the list
    Then I expect the second imported group to be below the first imported group

  @some-lists
  Scenario: A list exported elsewhere is marked with an icon on the My Lists page
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    And I press the "save" button
    And I wait for the list update to complete
    When I open "My Lists" page
    Then I expect the "second" list stripe to be marked as exported
    Then I expect the "first" list stripe to not be marked as exported

  @some-lists
  Scenario: Removing all imports of a list hides the exported icon on the My Lists page
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    And I press the "save" button
    And I wait for the list update to complete
    When I hover the first imported group
    And I press the visible "open context menu imported group" button
    And I press the visible "remove imported group" menu item
    And I press the "save" button
    And I wait for the list update to complete
    When I open "My Lists" page
    Then I expect the "second" list stripe to not be marked as exported
    Then I expect the "first" list stripe to not be marked as exported

  @some-lists
  Scenario: A list whose individual items are imported elsewhere has no exported icon on the My Lists page
    When I open "My Lists" page
    And I press on the "first" list stripe
    And I type the following text into the "first item" input: "Source item A"
    And I type the following text into the "automatic item" input: "Source item B"
    And I press the "save" button
    And I wait for the list update to complete
    And I open "My Lists" page
    And I press on the "second" list stripe
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I press the "first import list" list stripe for import
    And I check the "first import item" checkbox in the "first import list"
    And I press the "import" button
    And I ensure the tools panel does not disturb
    And I press the "save" button
    And I wait for the list update to complete
    When I open "My Lists" page
    Then I expect the "first" list stripe to not be marked as exported
    Then I expect the "second" list stripe to not be marked as exported
