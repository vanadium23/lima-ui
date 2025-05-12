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

  @needs-fixing
  Scenario: Unsuccessful list removal accompanied by reached items limit leads to error and warning at the same time
    When I add a list
    And I add list items to their limit
    And I press the "remove list tools panel" button
    Given Data server is not available
    And I press the visible "confirm list removal" button
    Then I expect to see the warning about items inputs limit reached
    Then I expect to see the "list removal" error

  Scenario: Disabling form controls when pressing the "Confirm list removal" button
    When I add a list
    And I press on the "list note" accordion
    And I press the "remove list tools panel" button
    And I press the visible "confirm list removal" button
    Then I expect to see the suffixed list title as tab title
    Then I expect to see sidebar
    Then I expect to see header
    Then I expect to see tools panel
    Then I expect to see the "list title" input disabled
    Then I expect to see the "list purpose" input disabled
    Then I expect to see the "list note" accordion disabled
    Then I expect to see the "list note" accordion content expanded
    Then I expect to see the "list note" text area disabled
    Then I expect to see items inputs area without scroll
    Then I expect to see the "first" item input disabled
    Then I expect to see the "automatic" item input disabled
    Then I expect to see the "add list item" button disabled
    Then I expect to see the "save" button disabled
    Then I expect to see the "copy items" button disabled
    Then I expect to see the "remove list tools panel" button in the loading state
    Then I expect to see the "checklist" switch disabled
    Then I expect to see the "print list" button disabled
    Then All necessary elements are on the "List View During Removal" page
    Then I expect to see no other elements
