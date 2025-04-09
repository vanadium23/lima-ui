Feature: Removing the lists on the Lists page

  Background:
    When I clear all data

  Scenario: Seeing a dialog modal box on pressing the remove button
    When I add a list
    And I hover away from anything actionable
    And I open Lists page
    And I hover "first" list stripe
    And I press the visible "open context menu list stripe" button
    And I press the visible "remove list" button
    Then I expect to see the "remove list" dialog modal box

  Scenario: Closing a dialog modal box on pressing the cancel button
    When I add a list
    And I add a list
    And I hover away from anything actionable
    And I open Lists page
    And I hover "first" list stripe
    And I press the visible "open context menu list stripe" button
    And I press the visible "remove list" button
    And I press the visible "cancel list removal" button
    Then I expect not to see the "remove list" dialog modal box

  Scenario: Closing a dialog modal box on pressing outside of it
    When I add a list
    And I hover away from anything actionable
    And I open Lists page
    And I hover "first" list stripe
    And I press the visible "open context menu list stripe" button
    And I press the visible "remove list" button
    And I click outside of the "remove list" dialog modal box
    Then I expect not to see the "remove list" dialog modal box

  @needs-fixing
  Scenario: Confirming list removal leads to the loading state of a list stripe
    When I add a list
    And I add a list
    And I open Lists page
    And I hover "first" list stripe
    And I press the visible "open context menu list stripe" button
    And I press the visible "remove list" button
    And I press the visible "confirm list removal" button
    Then I expect not to see the "remove list" dialog modal box
    Then I expect to see the visible "first" list stripe "view list" link disabled
    Then I expect to see the visible "first" list stripe "open context menu list stripe" button disabled

  @needs-fixing
  Scenario: Not seeing the dialog modal box when removal in progress
    When I add a list
    And I open Lists page
    And I hover "first" list stripe
    And I press the visible "open context menu list stripe" button
    And I press the visible "remove list" button
    And I press the visible "confirm list removal" button
    And I forcefully press the "first" list stripe "open context menu list stripe" button
    Then I expect not to see the "remove list" dialog modal box

  Scenario: Successful list removal leads to list stripe's disappearance
    When I add a list
    And I add a list
    And I open Lists page
    And I hover "first" list stripe
    And I press the visible "open context menu list stripe" button
    And I press the visible "remove list" button
    And I start waiting for the "list removal" request to happen
    And I press the visible "confirm list removal" button
    And I wait for the "list removal" request to happen
    Then I expect to see the following number of list stripes: 1

  Scenario: Successful removal of a single list leads to the message about lists absence appearance
    When I add a list
    And I open Lists page
    And I hover "first" list stripe
    And I press the visible "open context menu list stripe" button
    And I press the visible "remove list" button
    And I start waiting for the "list removal" request to happen
    And I press the visible "confirm list removal" button
    And I wait for the "list removal" request to happen
    Then I expect to see the message about lists absence

  Scenario: Unsuccessful list removal leads to error message appearance
    When I add a list
    And I add a list
    And I open Lists page
    And I hover "first" list stripe
    And I press the visible "open context menu list stripe" button
    And I press the visible "remove list" button
    Given Data server is not available
    And I press the visible "confirm list removal" button
    Then I expect to see the "list removal" error

  @needs-fixing
  Scenario: Consequent removal attempt leads to error message disappearance
    When I add a list
    And I add a list
    And I open Lists page
    And I hover "first" list stripe
    And I press the visible "open context menu list stripe" button
    And I press the visible "remove list" button
    Given Data server is not available
    And I press the visible "confirm list removal" button
    And I press the visible "open context menu list stripe" button
    And I press the visible "remove list" button
    And I press the visible "confirm list removal" button
    Then I expect not to see the "list removal" error

  Scenario: Unsuccessful list removal accompanied by reached lists limit leads to error and warning at the same time
    When I add lists to their limit
    And I open Lists page
    And I hover "first" list stripe
    And I press the visible "open context menu list stripe" button
    And I press the visible "remove list" button
    Given Data server is not available
    And I press the visible "confirm list removal" button
    Then I expect to see the "list removal" error
    Then I expect to see the warning about lists limit reached

  Scenario: Successful list removal accompanied by reached lists limit leads to hiding the warning and enabling the "Save" button
    When I add lists to their limit
    And I open Lists page
    And I hover "first" list stripe
    And I press the visible "open context menu list stripe" button
    And I press the visible "remove list" button
    And I press the visible "confirm list removal" button
    Then I expect not to see the "lists limit reached" warning
    Then I expect to see the "save" button "enabled" with the following text: "Создать"
