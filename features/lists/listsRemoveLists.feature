Feature: Removing the lists on the Lists page

  Background:
    When I clear all data

  Scenario: Seeing a dialog modal box on pressing the remove button
    When I add a list
    And I hover away from anything actionable
    And I open Lists page
    And I hover "first" list stripe
    And I press the visible "remove list" button
    Then I expect to see the "remove list" dialog modal box

  Scenario: Closing a dialog modal box on pressing the cancel button
    When I add a list
    When I add a list
    And I hover away from anything actionable
    And I open Lists page
    And I hover "first" list stripe
    And I press the visible "remove list" button
    And I press the visible "cancel list removal" button
    Then I expect not to see the "remove list" dialog modal box

  Scenario: Closing a dialog modal box on pressing outside of it
    When I add a list
    And I hover away from anything actionable
    And I open Lists page
    And I hover "first" list stripe
    And I press the visible "remove list" button
    And I click outside of the "remove list" dialog modal box
    Then I expect not to see the "remove list" dialog modal box

  Scenario: Confirming list removal leads to the loading state of a list stripe
    When I add a list
    And I add a list
    And I open Lists page
    And I hover "first" list stripe
    And I press the visible "remove list" button
    And I press the visible "confirm list removal" button
    Then I expect not to see the "remove list" dialog modal box
    Then I expect to see the visible "first" list stripe "view list" link disabled
    Then I expect to see the visible "first" list stripe "edit list" link disabled
    Then I expect to see the visible "first" list stripe "remove list" button disabled

  @under-development
  Scenario: Not seeing the dialog modal box when removal in progress
    When I add a list
    And I open Lists page
    And I hover "first" list stripe
    And I press the visible "remove list" button
    And I press the visible "confirm list removal" button
    And I forcefully press the "first" list stripe "remove list" button
    Then I expect not to see the "remove list" dialog modal box
