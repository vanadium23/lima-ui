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
  Scenario: Importing several items creates several imported groups
    When I open "My Lists" page
    And I press on the "first" list stripe
    And I ensure the tools panel is open
    And I press the "add list item" button
    And I ensure the tools panel does not disturb
    And I type the following text into the "first item" input: "Item A"
    And I type the following text into the "second item" input: "Item B"
    And I type the following text into the "automatic item" input: "Item C"
    And I press the "save" button
    And I wait for the list update to complete
    And I open "My Lists" page
    And I press on the "second" list stripe
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I press the "first import list" list stripe for import
    And I check the "first import item" checkbox
    And I check the "second import item" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    Then I expect to see 2 imported groups in the list
    Then I expect to see 1 item in the imported group #1
    Then I expect to see 1 item in the imported group #2
    Then I expect the item #1 in the imported group #1 to contain the following text: "Item A"
    Then I expect the item #1 in the imported group #2 to contain the following text: "Item B"

  @some-lists
  Scenario: Checking every item in the import dialog treats the import as a whole-list import
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
    And I check the "second import item" checkbox in the "first import list"
    And I press the "import" button
    And I ensure the tools panel does not disturb
    And I press the "save" button
    And I wait for the list update to complete
    Then I expect to see 1 imported group in the list
    Then I expect to see 2 items in the imported group #1
    When I press the first imported group name link
    And I type the following text into the "automatic item" input: "Source item C"
    And I press the "save" button
    And I wait for the list update to complete
    When I press the "exported to" button
    And I press the "first exported to list" in the exported to list
    Then I expect to see 1 imported group in the list
    Then I expect to see 3 items in the imported group #1

  @some-lists
  Scenario: Editing an item in the source list is reflected wherever the item is imported
    When I open "My Lists" page
    And I press on the "first" list stripe
    And I type the following text into the "first item" input: "Initial item text"
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
    When I press the first imported group name link
    And I type the following text into the "first item" input: "Updated item text"
    And I press the "save" button
    And I wait for the list update to complete
    When I press the "exported to" button
    And I press the "first exported to list" in the exported to list
    Then I expect to see 1 imported group in the list
    Then I expect to see 1 item in the imported group #1
    Then I expect the item #1 in the imported group #1 to contain the following text: "Updated item text"

  @some-lists
  Scenario: Pressing the list name link above an imported item opens the source list
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
    When I press the first imported group name link
    Then I expect to be on the "Some List" page
    Then I expect the "list title" input to match the import list #2 name

  @some-lists
  Scenario: User imports a mix of items and a whole list
    When I open "My Lists" page
    And I press on the "first" list stripe
    And I ensure the tools panel is open
    And I press the "add list item" button
    And I ensure the tools panel does not disturb
    And I type the following text into the "first item" input: "Item A"
    And I type the following text into the "second item" input: "Item B"
    And I type the following text into the "automatic item" input: "Item C"
    And I press the "save" button
    And I wait for the list update to complete
    And I add a list
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I press the "second import list" list stripe for import
    And I check the "first import item" checkbox in the "second import list"
    And I check the "second import item" checkbox in the "second import list"
    And I check the "first import list" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    Then I expect to see 3 imported groups in the list
    Then I expect to see 1 item in the imported group #2
    Then I expect to see 1 item in the imported group #3
    Then I expect the item #1 in the imported group #2 to contain the following text: "Item A"
    Then I expect the item #1 in the imported group #3 to contain the following text: "Item B"
    Then I expect the imported group #1 name to match the import list #1 name
    Then I expect the imported group #2 name to match the import list #2 name
    Then I expect the imported group #3 name to match the import list #2 name

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
