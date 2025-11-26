Feature: Removing the lists on the Lists page

  Background:
    When I clear all data

  Scenario: Seeing a dialog modal box on pressing the remove button
    When I add a list
    And I hover away from anything actionable
    When I open "My Lists" page
    And I hover "first" list stripe
    And I press the "first" list stripe "open context menu list stripe" button
    And I press the visible "remove list" button
    Then I expect to see the "remove list" dialog modal box

  Scenario: Closing a dialog modal box on pressing the cancel button on My Lists page
    When I add a list
    And I add a list
    And I hover away from anything actionable
    When I open "My Lists" page
    And I hover "first" list stripe
    And I press the "first" list stripe "open context menu list stripe" button
    And I press the visible "remove list" button
    And I press the visible "cancel list removal" button
    Then I expect not to see the "remove list" dialog modal box

  Scenario: Closing a dialog modal box on pressing outside of it on Lists page
    When I add a list
    And I hover away from anything actionable
    When I open "My Lists" page
    And I hover "first" list stripe
    And I press the "first" list stripe "open context menu list stripe" button
    And I press the visible "remove list" button
    And I click outside of the "remove list" dialog modal box
    Then I expect not to see the "remove list" dialog modal box

  Scenario: Confirming list removal leads to the loading state of a list stripe
    When I add a list
    And I add a list
    When I open "My Lists" page
    And I hover "first" list stripe
    And I press the "first" list stripe "open context menu list stripe" button
    And I press the visible "remove list" button
    And I press the visible "confirm list removal" button
    Then I expect not to see the "remove list" dialog modal box
    Then I expect to see the visible "first" list stripe "view list" link disabled
    Then I expect to see the visible "first" list stripe "open context menu list stripe" button disabled

  Scenario: Opening and closing the list removal dialog multiple times
    When I add a list
    And I hover away from anything actionable
    When I open "My Lists" page
    And I hover "first" list stripe
    And I press the "first" list stripe "open context menu list stripe" button
    And I press the visible "remove list" button
    Then I expect to see the "remove list" dialog modal box
    When I press the visible "cancel list removal" button
    Then I expect not to see the "remove list" dialog modal box
    When I hover "first" list stripe
    And I press the "first" list stripe "open context menu list stripe" button
    And I press the visible "remove list" button
    Then I expect to see the "remove list" dialog modal box
    When I click outside of the "remove list" dialog modal box
    Then I expect not to see the "remove list" dialog modal box

  Scenario: Not seeing the dialog modal box when removal in progress on "My Lists" page
    When I add a list
    When I open "My Lists" page
    And I hover "first" list stripe
    And I press the "first" list stripe "open context menu list stripe" button
    And I press the visible "remove list" button
    And I press the visible "confirm list removal" button
    And I forcefully press the "first" list stripe "open context menu list stripe" button
    Then I expect not to see the "list stripe" context menu

  Scenario: Successful list removal leads to list stripe's disappearance
    When I add a list
    And I add a list
    When I open "My Lists" page
    And I hover "first" list stripe
    And I press the "first" list stripe "open context menu list stripe" button
    And I press the visible "remove list" button
    And I start waiting for the "list removal" request to happen
    And I press the visible "confirm list removal" button
    And I wait for the "list removal" request to happen
    Then I expect to see the following number of list stripes: 1

  Scenario: Successful removal of a single list leads to the message about lists absence appearance
    When I add a list
    When I open "My Lists" page
    And I hover "first" list stripe
    And I press the "first" list stripe "open context menu list stripe" button
    And I press the visible "remove list" button
    And I start waiting for the "list removal" request to happen
    And I press the visible "confirm list removal" button
    And I wait for the "list removal" request to happen
    Then I expect to see the message about lists absence

  Scenario: Unsuccessful list removal leads to error message appearance on My Lists page
    When I add a list
    And I add a list
    When I open "My Lists" page
    And I hover "first" list stripe
    And I press the "first" list stripe "open context menu list stripe" button
    And I press the visible "remove list" button
    Given Data server is not available
    And I press the visible "confirm list removal" button
    Then I expect to see the "single list removal" error

  @heavy
  Scenario: Unsuccessful list removal accompanied by reached lists limit leads to error and warning at the same time
    When I add lists to their limit
    When I open "My Lists" page
    And I hover "first" list stripe
    And I press the "first" list stripe "open context menu list stripe" button
    And I press the visible "remove list" button
    Given Data server is not available
    And I press the visible "confirm list removal" button
    Then I expect to see the "single list removal" error
    Then I expect to see the warning about lists limit reached

  @heavy
  Scenario: Successful list removal accompanied by reached lists limit leads to hiding the warning and enabling the "Create" button
    When I add lists to their limit
    When I open "My Lists" page
    And I hover "first" list stripe
    And I press the "first" list stripe "open context menu list stripe" button
    And I press the visible "remove list" button
    And I press the visible "confirm list removal" button
    Then I expect not to see the "lists limit reached" warning
    Then I expect to see the "create" button enabled
