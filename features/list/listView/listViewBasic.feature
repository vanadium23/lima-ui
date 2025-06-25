Feature: Seeing the basis of List view page

  Background:
    When I clear all data

  Scenario: Seeing list on List view page
    When I add a list
    Then I expect to see the suffixed list title as tab title
    Then I expect to see sidebar or its button
    Then I expect to see header
    Then I expect to see search
    Then I expect to see tools panel or its button
    Then I expect to see the "list title" input enabled
    Then I expect to see the "list purpose" input enabled
    Then I expect to fully see the collapsed "list note" accordion ready for expanding
    Then I expect to see list items area
    Then I expect to see the "first" item input enabled
    Then I expect to have the "automatic" item input enabled
    Then I expect to see the "save" button "disabled" with the following text: "Сохранить"
    And I ensure the tools panel is open
    Then I expect to see the "add list item" button enabled
    Then I expect to see the "copy items" button enabled
    Then I expect to see the "remove list tools panel" button enabled
    Then I expect to see the "checklist" switch enabled
    Then I expect to see the "print list" button enabled
    And I ensure the tools panel does not disturb
    Then All necessary elements are on the "List View" page
    Then I expect to see no other elements

  Scenario: Seeing list on List view page after page refresh
    When I add a list
    And I refresh the page
    Then I expect to see the suffixed list title as tab title
    Then I expect to see sidebar or its button
    Then I expect to see header
    Then I expect to see search
    Then I expect to see tools panel or its button
    Then I expect to see the "list title" input enabled
    Then I expect to see the "list purpose" input enabled
    Then I expect to fully see the collapsed "list note" accordion ready for expanding
    Then I expect to see list items area
    Then I expect to see the "first" item input enabled
    Then I expect to have the "automatic" item input enabled
    Then I expect to see the "save" button "disabled" with the following text: "Сохранить"
    And I ensure the tools panel is open
    Then I expect to see the "add list item" button enabled
    Then I expect to see the "copy items" button enabled
    Then I expect to see the "remove list tools panel" button enabled
    Then I expect to see the "checklist" switch enabled
    Then I expect to see the "print list" button enabled
    And I ensure the tools panel does not disturb
    Then All necessary elements are on the "List View" page
    Then I expect to see no other elements

  Scenario: First item is visible when opening a list with many items
    When I open List Creation page
    And I type some text with length less or equal to the one of "list title" input limit
    And I type some text with length less or equal to the one of "list purpose" input limit
    And I type some text with length less or equal to the one of "first item" input limit
    And I ensure the tools panel is open
    And I add list items till scroll appears plus one item input
    And I ensure the tools panel does not disturb
    And I type some text to all items inputs
    And I press the "save" button
    And I wait for the list to create
    And I open Lists page
    And I press on the "first" list stripe
    And I wait for the page to load
    Then I expect to see the "first item" input
    Then I expect not to see the last item input

  Scenario: List view page with list loading error
    When I add a list
    And I open Lists page
    And I press on the "first" list stripe
    But Error happens while loading
    Then I expect to see the default tab title
    Then I expect to see sidebar or its button
    Then I expect to see header
    Then I expect to see search
    Then I expect not to see tools panel
    Then I expect to see the "connection" error
    Then I expect not to see the "save" button
    Then All necessary elements are on the "List View with Error" page
    Then I expect to see no other elements
