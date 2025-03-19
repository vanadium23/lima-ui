Feature: Removing a list from the List view page

  Background:
    When I clear all data

  Scenario: Closing a dialog modal box on pressing the cancel button
    When I add a list
    And I press the "remove list tools panel" button
    And I press the visible "cancel list removal" button
    Then I expect not to see the "remove list" dialog modal box

  Scenario: Closing a dialog modal box on pressing outside of it
    When I add a list
    And I press the "remove list tools panel" button
    And I click outside of the "remove list" dialog modal box
    Then I expect not to see the "remove list" dialog modal box

  Scenario: Not seeing the dialog modal box when removal in progress
    When I add a list
    And I press the "remove list tools panel" button
    And I press the visible "confirm list removal" button
    And I forcefully press the "remove list tools panel" button
    Then I expect not to see the "remove list" dialog modal box

  Scenario: Confirming list removal leads to redirecting to Lists page
    When I add a list
    And I press the "remove list tools panel" button
    And I start waiting for the "list removal" request to happen
    And I press the visible "confirm list removal" button
    And I wait for the "list removal" request to happen
    Then I expect to be on the Lists page
    Then I expect to see the following number of list stripes: 0
    Then I expect to see the message about lists absence

  @needs-fixing
  Scenario: Unsuccessful list removal leads to error message appearance
    When I add a list
    And I press the "remove list tools panel" button
    Given Data server is not available
    And I press the visible "confirm list removal" button
    Then I expect to see the "list removal" error

  Scenario: Consequent removal attempt leads to error message disappearance
    When I add a list
    And I press the "remove list tools panel" button
    Given Data server is not available
    And I press the visible "confirm list removal" button
    And I press the "remove list tools panel" button
    And I press the visible "confirm list removal" button
    Then I expect not to see the "list removal" error
