Feature: Removing exported lists and items

  Background:
    Given I clear all data
    When I add a list
    And I add a list

  @some-lists
  Scenario: Deleting an exported list everywhere from its own page removes it from all importing lists
    When I open "My Lists" page
    And I press on the "second" list stripe
    And I type the following text into the "first item" input: "Source List Item A"
    And I press the "save" button
    And I wait for the list update to complete
    And I open "My Lists" page
    And I press on the "second" list stripe
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    And I press the "save" button
    And I wait for the list update to complete
    When I press the first imported group name link
    And I ensure the tools panel is open
    And I press the "remove list tools panel" button
    Then I expect to see the "remove list" dialog modal box
    When I press the visible "delete exported list everywhere" button
    Then I expect to be on the "My Lists" page
    When I press on the "first" list stripe
    Then I expect to see 0 imported groups in the list

  @some-lists
  Scenario: Deleting only the exported list from its own page creates own items in importing lists
    When I open "My Lists" page
    And I press on the "second" list stripe
    And I type the following text into the "first item" input: "Source List Item A"
    And I press the "save" button
    And I wait for the list update to complete
    And I open "My Lists" page
    And I press on the "second" list stripe
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    And I press the "save" button
    And I wait for the list update to complete
    When I press the first imported group name link
    And I ensure the tools panel is open
    And I press the "remove list tools panel" button
    Then I expect to see the "remove list" dialog modal box
    When I press the visible "delete only this exported list" button
    Then I expect to be on the "My Lists" page
    When I press on the "first" list stripe
    Then I expect to see 0 imported groups in the list
    Then I expect to see the "second item" input to have the following text: "Source List Item A"

  @some-lists
  Scenario: Deleting an exported list everywhere from My Lists removes it from all importing lists
    When I open "My Lists" page
    And I press on the "second" list stripe
    And I type the following text into the "first item" input: "Source List Item A"
    And I press the "save" button
    And I wait for the list update to complete
    And I open "My Lists" page
    And I press on the "second" list stripe
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    And I press the "save" button
    And I wait for the list update to complete
    When I open "My Lists" page
    And I hover "second" list stripe
    And I press the "second" list stripe "open context menu list stripe" button
    And I press the visible "remove list" button
    Then I expect to see the "remove list" dialog modal box
    When I press the visible "delete exported list everywhere" button
    Then I expect not to see the "remove list" dialog modal box
    When I press on the "first" list stripe
    Then I expect to see 0 imported groups in the list

  @some-lists
  Scenario: Deleting only the exported list from My Lists creates own items in importing lists
    When I open "My Lists" page
    And I press on the "second" list stripe
    And I type the following text into the "first item" input: "Source List Item A"
    And I press the "save" button
    And I wait for the list update to complete
    And I open "My Lists" page
    And I press on the "second" list stripe
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    When I check the "first import list" checkbox
    And I press the "import" button
    And I ensure the tools panel does not disturb
    And I press the "save" button
    And I wait for the list update to complete
    When I open "My Lists" page
    And I hover "second" list stripe
    And I press the "second" list stripe "open context menu list stripe" button
    And I press the visible "remove list" button
    Then I expect to see the "remove list" dialog modal box
    When I press the visible "delete only this exported list" button
    Then I expect not to see the "remove list" dialog modal box
    When I press on the "first" list stripe
    Then I expect to see 0 imported groups in the list
    Then I expect to see the "second item" input to have the following text: "Source List Item A"

  @some-lists
  Scenario: Deleting an exported item everywhere from the source list removes it from all importing lists
    When I open "My Lists" page
    And I press on the "second" list stripe
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
    And I hover "first list item"
    And I press the "open context menu first item" button
    And I press the visible "remove list item" menu item
    Then I expect to see the "remove exported item" dialog modal box
    When I press the visible "delete exported item everywhere" button
    Then I expect not to see the "remove exported item" dialog modal box
    When I press the "save" button
    And I wait for the list update to complete
    When I open "My Lists" page
    And I press on the "second" list stripe
    Then I expect to see 0 imported groups in the list

  @some-lists
  Scenario: Deleting only the exported item from the source list creates an own item in importing lists
    When I open "My Lists" page
    And I press on the "second" list stripe
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
    And I hover "first list item"
    And I press the "open context menu first item" button
    And I press the visible "remove list item" menu item
    Then I expect to see the "remove exported item" dialog modal box
    When I press the visible "delete only this exported item" button
    Then I expect not to see the "remove exported item" dialog modal box
    When I press the "save" button
    And I wait for the list update to complete
    When I open "My Lists" page
    And I press on the "second" list stripe
    Then I expect to see 0 imported groups in the list
    Then I expect to see the "second item" input to have the following text: "Source item A"

  @some-lists
  Scenario: Deleting a list with exported items everywhere from My Lists removes them from all importing lists
    When I open "My Lists" page
    And I press on the "second" list stripe
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
    And I hover "second" list stripe
    And I press the "second" list stripe "open context menu list stripe" button
    And I press the visible "remove list" button
    Then I expect to see the "remove list" dialog modal box
    When I press the visible "delete exported list everywhere" button
    Then I expect not to see the "remove list" dialog modal box
    When I press on the "first" list stripe
    Then I expect to see 0 imported groups in the list

  @some-lists
  Scenario: Deleting only a list with exported items from My Lists creates own items in importing lists
    When I open "My Lists" page
    And I press on the "second" list stripe
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
    And I hover "second" list stripe
    And I press the "second" list stripe "open context menu list stripe" button
    And I press the visible "remove list" button
    Then I expect to see the "remove list" dialog modal box
    When I press the visible "delete only this exported list" button
    Then I expect not to see the "remove list" dialog modal box
    When I press on the "first" list stripe
    Then I expect to see 0 imported groups in the list
    Then I expect to see the "second item" input to have the following text: "Source item A"
