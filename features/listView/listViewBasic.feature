Feature: Seeing the basis of List view page

  Scenario: Seeing list on List view page
    When I clear all data
    When I add a list
    Then I expect to see sidebar
    Then I expect to see header
    Then I expect to see tools panel
    Then I expect to see "list title" input enabled
    Then I expect to see "list purpose" input enabled
    Then I expect to fully see the collapsed "list note" accordion ready for expanding
    Then I expect to see items inputs area without scroll
    Then I expect to see 2 item inputs ready for typing
    Then I expect to see the "create" button "disabled" with the following text: "Сохранить"
    Then I expect to see the "add item" button enabled
    Then I expect to see the "copy items" button enabled
    Then I expect to see the "remove list tools panel" button enabled
    Then I expect to see the "checklist" switch enabled
    Then I expect to see the "print list" button enabled
    Then All elements expected to be on the "List View" page
    Then I expect to see no other elements

  @needs-fixing
  Scenario: First item is visible when opening a list with many items
    When I clear all data
    When I open List Creation page
    And I type some text with length less or equal to the one of "list title" input limit
    And I type some text with length less or equal to the one of "list purpose" input limit
    And I type some text with length less or equal to the one of "first item" input limit
    And I add items inputs till scroll appears plus one item input
    And I type some text to all items inputs
    And I press the "create" button
    And I wait for the list to create
    And I open Lists page
    And I press on the "first" list stripe
    And I wait for the page to load
    Then I expect to see the "first item" input
    Then I expect not to see the last item input
